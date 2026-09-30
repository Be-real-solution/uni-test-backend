// Ishlatish (loyiha papkasidan):
//   NODE_PATH=dist node scripts/resend-failed-to-journal.js 2026-09-26 --dry-run
//   NODE_PATH=dist node scripts/resend-failed-to-journal.js 2026-09-26 [--rpm=50]
// Yuborilganlar resend-progress.json ga yoziladi; qayta ishga tushirilsa ular o'tkazib yuboriladi.
require('dotenv').config();
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const { sendResultToJournalSync } = require('../dist/modules/archive/journal.helper.js');

const dateArg = process.argv.find((a) => /^\d{4}-\d{2}-\d{2}$/.test(a));
const FROM_DATE = new Date(dateArg || '2026-09-26');
const DRY_RUN = process.argv.includes('--dry-run');
const rpmArg = process.argv.find((a) => a.startsWith('--rpm='));
const RPM = rpmArg ? Number(rpmArg.slice(6)) : 50; // jurnal limiti (anon 60/min) dan past
const INTERVAL_MS = Math.ceil(60000 / RPM);
const PROGRESS_FILE = 'resend-progress.json';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const prisma = new PrismaClient();
  const archives = await prisma.archive.findMany({
    where: { deletedAt: null, startTime: { gte: FROM_DATE } },
    select: {
      id: true, userId: true, collectionId: true, result: true, startTime: true,
      archiveCollection: { select: { name: true } },
      collection: { select: { name: true } },
    },
    orderBy: { startTime: 'asc' },
  });
  let done = new Set();
  try { done = new Set(JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'))); } catch {}
  const todo = archives.filter((a) => !done.has(a.id));
  console.log(`Topildi: ${archives.length} ta natija (${FROM_DATE.toISOString().slice(0, 10)} dan boshlab), avval yuborilgan: ${done.size}, yuboriladi: ${todo.length}, tezlik: ${RPM}/min`);
  if (DRY_RUN) { await prisma.$disconnect(); return; }

  let ok = 0, fail = 0;
  const failed = [];
  for (const [i, a] of todo.entries()) {
    const started = Date.now();
    const sent = await sendResultToJournalSync({
      userId: a.userId,
      collectionId: a.collectionId,
      collectionName: a.archiveCollection?.name ?? a.collection?.name ?? '',
      result: a.result,
    });
    if (sent) { ok++; done.add(a.id); fs.writeFileSync(PROGRESS_FILE, JSON.stringify([...done])); }
    else { fail++; failed.push({ id: a.id, userId: a.userId, collectionId: a.collectionId, result: a.result }); }
    if ((i + 1) % 50 === 0) console.log(`${i + 1}/${todo.length}  ok=${ok}  fail=${fail}`);
    if (ok === 0 && fail >= 5) { console.error('Birinchi 5 tasi ham yuborilmadi, toxtatildi. Tokenni tekshiring.'); break; }
    const wait = INTERVAL_MS - (Date.now() - started);
    if (wait > 0) await sleep(wait);
  }
  fs.writeFileSync('resend-failed.json', JSON.stringify(failed, null, 2));
  console.log(`Tugadi: ok=${ok}  fail=${fail}. Yuborilmaganlar: resend-failed.json`);
  await prisma.$disconnect();
})();
