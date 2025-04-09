import axios from "axios";
import {WebApp} from '@twa-dev/types'

const API_BASE_URL = 'http://176.113.82.88:8000/'; // Замените на ваш URL бэкенда

export function getTgID() {
    const tgData = WebApp.initDataUnsafe
    const tg_id = tgData.user?.id
    return tg_id
}

export async function createOrGetUser(tg_id, name) {
    try {
        const response = await axios.post(`${API_BASE_URL}/users/`, {
            tg_id: tg_id,
            name: name
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
}

// Получение данных пользователя
export async function getUserData(tg_id) {
    try {
        const response = await axios.get(`${API_BASE_URL}/users/${tg_id}`);
        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
}

// Добавление монет за клик
export async function addClickCoins(tg_id) {
    try {
        const response = await axios.post(`${API_BASE_URL}/users/click/`, { tg_id });
        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
}

// Получение текущего количества монет
export async function getUserCoins(tg_id) {
    try {
        const response = await axios.get(`${API_BASE_URL}/users/${tg_id}/coins`);
        return response.data.coins;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
}

// Улучшение клика
export async function upgradeClick(tg_id) {
    try {
        const response = await axios.put(`${API_BASE_URL}/users/${tg_id}/upgrade_click`);
        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
}

// Улучшение почасового дохода
export async function upgradeHourly(tg_id) {
    try {
        const response = await axios.put(`${API_BASE_URL}/users/${tg_id}/upgrade_hourly`);
        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
}

// Обработка ошибок API
export function handleApiError(error) {
    if (error.response) {
        console.error('Ошибка API:', {
            status: error.response.status,
            message: error.response.data?.detail || 'Unknown error'
        });
    } else {
        console.error('Network error:', error.message);
    }
}

// Пример использования:
// async function initUser() {
//     const user = await createOrGetUser(123456789, 'Игрок1');
//     console.log('User data:', user);
// }