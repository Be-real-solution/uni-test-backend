// Ishlatish (loyiha papkasidan):
//   NODE_PATH=dist node scripts/resend-failed-to-journal.js 2026-09-26 --dry-run
//   NODE_PATH=dist node scripts/resend-failed-to-journal.js 2026-09-26
require('dotenv').config();
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const { sendResultToJournalSync } = require('../dist/modules/archive/journal.helper.js');

const dateArg = process.argv.find((a) => /^\d{4}-\d{2}-\d{2}$/.test(a));
const FROM_DATE = new Date(dateArg || '2026-09-26');
const DRY_RUN = process.argv.includes('--dry-run');

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
  console.log(`Topildi: ${archives.length} ta natija (${FROM_DATE.toISOString().slice(0, 10)} dan boshlab)`);
  if (DRY_RUN) { await prisma.$disconnect(); return; }

  let ok = 0, fail = 0;
  const failed = [];
  for (const [i, a] of archives.entries()) {
    const sent = await sendResultToJournalSync({
      userId: a.userId,
      collectionId: a.collectionId,
      collectionName: a.archiveCollection?.name ?? a.collection?.name ?? '',
      result: a.result,
    });
    if (sent) ok++;
    else { fail++; failed.push({ id: a.id, userId: a.userId, collectionId: a.collectionId, result: a.result }); }
    if ((i + 1) % 50 === 0) console.log(`${i + 1}/${archives.length}  ok=${ok}  fail=${fail}`);
    if (ok === 0 && fail >= 5) { console.error('Birinchi 5 tasi ham yuborilmadi, toxtatildi. Tokenni tekshiring.'); break; }
  }
  fs.writeFileSync('resend-failed.json', JSON.stringify(failed, null, 2));
  console.log(`Tugadi: ok=${ok}  fail=${fail}. Yuborilmaganlar: resend-failed.json`);
  await prisma.$disconnect();
})();
