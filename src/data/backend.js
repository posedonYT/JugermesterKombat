import axios from "axios";
const API_BASE_URL = 'https://6cfc-31-192-239-18.ngrok-free.app'; // Замените на ваш URL бэкенда
const TG = window.Telegram?.WebApp || {}; // Безопасная проверка на существование объекта

export function getTgID() {
    // Проверка на доступность WebApp и данных пользователя
    if (TG && TG.initDataUnsafe?.user) {
        return TG.initDataUnsafe.user.id;
    }
    // Для тестирования можно вернуть тестовый ID
    return 0; 
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

// Добавление монет за клики - обновленная версия с поддержкой множественных кликов
export async function addClickCoins(tg_id, clickCount = 1) {
    try {
        const response = await axios.post(`${API_BASE_URL}/users/click/`, { 
            tg_id: tg_id,
            clicks: clickCount 
        });
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