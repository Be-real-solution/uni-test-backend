import axios from 'axios';
import { appConfig } from 'configs/app.configs';

const JOURNAL_BASE_URL = 'https://e-journal.tashmeduni.uz/api/v1';
const MAX_ATTEMPTS = 5;

// Jurnal (2026-09-26 dan boshlab) `unittest/marks` endpointida JWT emas,
// `X-API-TOKEN` sarlavhasini kutadi. Qiymat jurnal serveridagi
// UNITEST_WEBHOOK_TOKEN bilan bir xil bo'lishi kerak. Login endi shart emas.
function journalHeaders() {
    return {
        'X-API-TOKEN': appConfig.journal_webhook_token,
        accept: 'application/json',
    };
}

// Qayta urinish kerakmi va qancha kutib: null = urinmaslik.
// 429 (throttle): jurnal aytgan Retry-After soniya kutiladi.
// 5xx yoki tarmoq xatosi: 5s, keyin 10s.
// 403 (token) va 404 (talaba/mavzu topilmadi) kutish bilan tuzalmaydi.
function retryDelayMs(error: any, attempt: number): number | null {
    const status = error?.response?.status;
    if (status === 429) {
        const retryAfter = Number(error.response?.headers?.['retry-after']);
        const seconds = Number.isFinite(retryAfter) && retryAfter > 0 ? Math.min(retryAfter, 120) : 60;
        return seconds * 1000 + 1000;
    }
    if (!status || status >= 500) {
        return attempt === 1 ? 5000 : 10000;
    }
    return null;
}

type JournalPayload = {
    userId: string;
    collectionId: string;
    collectionName?: string;
    result: number;
};

function toJournalBody(payload: JournalPayload) {
    return {
        student_id: payload.userId,
        collection_id: payload.collectionId,
        collection_name: payload.collectionName,
        result: payload.result < 60 ? 1 : payload.result,
    };
}

function logError(attempt: number, error: any) {
    console.error(
        `Journal: xato (${attempt}-urinish):`,
        error.response?.status,
        error.response?.data || error.message,
    );
}

async function postMark(payload: JournalPayload): Promise<void> {
    await axios.post(`${JOURNAL_BASE_URL}/journal/student/unittest/marks`, toJournalBody(payload), {
        headers: journalHeaders(),
    });
}

// Fon rejimi: javob kutilmaydi (talaba testni tugatganda chaqiriladi)
export async function sendResultToJournal(payload: JournalPayload, attempt = 1): Promise<void> {
    try {
        await postMark(payload);
        console.log(`Journal: muvaffaqiyatli yuborildi (${attempt}-urinish) - userId: ${payload.userId}`);
    } catch (error: any) {
        logError(attempt, error);
        const delay = attempt < MAX_ATTEMPTS ? retryDelayMs(error, attempt) : null;
        if (delay !== null) {
            setTimeout(() => {
                sendResultToJournal(payload, attempt + 1);
            }, delay);
        } else {
            console.error('Journal: yuborilmadi:', payload);
        }
    }
}

// Sinxron rejim: natijani qaytaradi (sync endpointlar va skriptlar uchun)
export async function sendResultToJournalSync(payload: JournalPayload, attempt = 1): Promise<boolean> {
    try {
        await postMark(payload);
        console.log(`Journal: yuborildi (${attempt}-urinish) - userId: ${payload.userId}`);
        return true;
    } catch (error: any) {
        logError(attempt, error);
        const delay = attempt < MAX_ATTEMPTS ? retryDelayMs(error, attempt) : null;
        if (delay !== null) {
            await new Promise((resolve) => setTimeout(resolve, delay));
            return sendResultToJournalSync(payload, attempt + 1);
        }
        return false;
    }
}
