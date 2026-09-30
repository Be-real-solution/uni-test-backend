import axios from 'axios';
import { appConfig } from 'configs/app.configs';

const JOURNAL_BASE_URL = 'https://e-journal.tashmeduni.uz/api/v1';

// Jurnal (2026-09-26 dan boshlab) `unittest/marks` endpointida JWT emas,
// `X-API-TOKEN` sarlavhasini kutadi. Qiymat jurnal serveridagi
// UNITEST_WEBHOOK_TOKEN bilan bir xil bo'lishi kerak. Login endi shart emas.
function journalHeaders() {
    return {
        'X-API-TOKEN': appConfig.journal_webhook_token,
        accept: 'application/json',
    };
}

// 403 (token noto'g'ri yoki jurnalda sozlanmagan) va 404 (talaba/mavzu topilmadi)
// qayta urinish bilan tuzalmaydi, shuning uchun ular uchun retry qilinmaydi.
function isRetryable(error: any): boolean {
    const status = error?.response?.status;
    return !status || status >= 500;
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

// Fon rejimi: javob kutilmaydi (talaba testni tugatganda chaqiriladi)
export async function sendResultToJournal(payload: JournalPayload, attempt = 1): Promise<void> {
    try {
        await axios.post(`${JOURNAL_BASE_URL}/journal/student/unittest/marks`, toJournalBody(payload), {
            headers: journalHeaders(),
        });
        console.log(`Journal: muvaffaqiyatli yuborildi (${attempt}-urinish) - userId: ${payload.userId}`);
    } catch (error: any) {
        logError(attempt, error);
        if (attempt < 3 && isRetryable(error)) {
            const delay = attempt === 1 ? 5000 : 10000;
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
        await axios.post(`${JOURNAL_BASE_URL}/journal/student/unittest/marks`, toJournalBody(payload), {
            headers: journalHeaders(),
        });
        console.log(`Journal: yuborildi (${attempt}-urinish) - userId: ${payload.userId}`);
        return true;
    } catch (error: any) {
        logError(attempt, error);
        if (attempt < 3 && isRetryable(error)) {
            const delay = attempt === 1 ? 5000 : 10000;
            await new Promise((resolve) => setTimeout(resolve, delay));
            return sendResultToJournalSync(payload, attempt + 1);
        }
        return false;
    }
}
