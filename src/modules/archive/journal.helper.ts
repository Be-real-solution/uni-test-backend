import axios from 'axios';
import { appConfig } from 'configs/app.configs';

const JOURNAL_BASE_URL = 'https://e-journal.tashmeduni.uz/api/v1';

async function getJournalToken(): Promise<string> {
    const response = await axios.post(`${JOURNAL_BASE_URL}/account/auth/login/`, {
        username: appConfig.journal_username,
        password: appConfig.journal_password,
    });
    return response.data.access;
}

export async function sendResultToJournal(payload: {
    userId: string;
    collectionId: string;
    result: number;
}, attempt = 1): Promise<void> {
    try {
        const token = await getJournalToken();

        await axios.post(
            `${JOURNAL_BASE_URL}/journal/student/unittest/marks`,
            {
                student_id: payload.userId,
                collection_id: payload.collectionId,
                result: payload.result < 60 ? 0 : payload.result,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    accept: 'application/json',
                },
            },
        );
        console.log(`Journal: muvaffaqiyatli yuborildi (${attempt}-urinish)`);
    } catch (error: any) {
        console.error(
            `Journal: xato (${attempt}-urinish):`,
            error.response?.data || error.message,
        );

        if (attempt < 3) {
            const delay = attempt === 1 ? 5000 : 10000;
            setTimeout(() => {
                sendResultToJournal(payload, attempt + 1);
            }, delay);
        } else {
            console.error('Journal: 3 marta urinildi, muvaffaqiyatsiz:', payload);
        }
    }
}