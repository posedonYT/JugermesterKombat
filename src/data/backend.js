import axios from "axios";
const API_BASE_URL = 'https://6cfc-31-192-239-18.ngrok-free.app'; // Замените на ваш актуальный URL бэкенда
const TG = window.Telegram?.WebApp || {}; // Безопасная проверка на существование объекта

// Настройка Axios для лучшей отладки
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // Увеличенный таймаут
    headers: {
        'Content-Type': 'application/json'
    }
});

// Логирование запросов
api.interceptors.request.use(config => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`, config.data || {});
    return config;
});

// Логирование ответов
api.interceptors.response.use(
    response => {
        console.log(`API Response: ${response.status}`, response.data);
        return response;
    },
    error => {
        console.error('API Error:', error.response?.status || 'Network Error', 
                     error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export function getTgID() {
    // Проверка на доступность WebApp и данных пользователя
    if (TG && TG.initDataUnsafe?.user) {
        return TG.initDataUnsafe.user.id;
    }
    // Для тестирования возвращаем тестовый ID
    console.log("Using test TG ID");
    return 12345678; // Используем конкретный ID для тестирования
}

export async function createOrGetUser(tg_id, name) {
    try {
        const response = await api.post(`/users/`, {
            tg_id: tg_id,
            name: name
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
        // В случае ошибки возвращаем базовые данные
        return { coins: 0, coins_click: 1, coins_hours: 10 };
    }
}

// Получение данных пользователя
export async function getUserData(tg_id) {
    try {
        const response = await api.get(`/users/${tg_id}`);
        return response.data;
    } catch (error) {
        handleApiError(error);
        // В случае ошибки возвращаем базовые данные
        return { coins: 0, coins_click: 1, coins_hours: 10 };
    }
}

// Добавление монет за клики - обновленная версия с поддержкой множественных кликов
export async function addClickCoins(tg_id, clickCount = 1) {
    try {
        console.log(`Отправка ${clickCount} кликов для пользователя ${tg_id}`);
        const response = await api.post(`/users/click/`, { 
            tg_id: tg_id,
            clicks: clickCount 
        });
        console.log("Ответ на клики:", response.data);
        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
}

// Получение текущего количества монет
export async function getUserCoins(tg_id) {
    try {
        console.log(`Получение монет для пользователя ${tg_id}`);
        const response = await api.get(`/users/${tg_id}/coins`);
        console.log("Ответ с монетами:", response.data);
        
        // Проверка правильности формата ответа
        if (response.data && typeof response.data.coins === 'number') {
            return response.data.coins;
        } else {
            console.error("Неверный формат ответа для монет:", response.data);
            return 0; // Защитное значение по умолчанию
        }
    } catch (error) {
        handleApiError(error);
        return 0; // Возвращаем 0 в случае ошибки вместо генерации исключения
    }
}

// Улучшение клика
export async function upgradeClick(tg_id) {
    try {
        const response = await api.put(`/users/${tg_id}/upgrade_click`);
        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
}

// Улучшение почасового дохода
export async function upgradeHourly(tg_id) {
    try {
        const response = await api.put(`/users/${tg_id}/upgrade_hourly`);
        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
}

// Улучшенная обработка ошибок API
export function handleApiError(error) {
    if (error.response) {
        console.error('API Error:', {
            status: error.response.status,
            url: error.config?.url,
            method: error.config?.method,
            data: error.config?.data,
            message: error.response.data?.detail || 'Unknown error'
        });
    } else if (error.request) {
        console.error('Network Error - No Response:', {
            url: error.config?.url,
            method: error.config?.method
        });
    } else {
        console.error('Request Configuration Error:', error.message);
    }
}