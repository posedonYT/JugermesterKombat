import { React, useState, useEffect, useRef } from 'react'
import './Home.css'
import Jagermester from '/Jagermester.png'
import CoinIco from '../../public/coin.svg'
import { addClickCoins, getUserCoins, createOrGetUser, getUserData, getTgID } from '../data/backend.js'

export default function Home() {
    const [coins, setCoins] = useState(0)
    const [tgId, setTGId] = useState(null)
    const [coinsPerClick, setCoinsPerClick] = useState(1)
    const [hourlyCoins, setHourlyCoins] = useState(10)
    const [isLoading, setIsLoading] = useState(true)
    const pendingClicksRef = useRef(0)
    const syncTimerRef = useRef(null)
    const isInitializedRef = useRef(false)
    const lastSyncTimeRef = useRef(0)

    // Инициализация пользователя и загрузка данных
    useEffect(() => {
        const init = async () => {
            try {
                setIsLoading(true);
                console.log("Начало инициализации...");
                
                // 1. Получаем TG ID
                const id = getTgID();
                console.log("Получен TG ID:", id);
                setTGId(id);

                // 2. Создаем/получаем пользователя
                const userData = await createOrGetUser(id, "Новый игрок");
                console.log("Данные пользователя:", userData);
                
                // 3. Устанавливаем данные пользователя из полного ответа
                const initialCoins = userData.coins ?? 0;
                console.log("Начальное количество монет:", initialCoins);
                
                setCoins(initialCoins);
                setCoinsPerClick(userData.coins_click ?? 1);
                setHourlyCoins(userData.coins_hours ?? 10);
                
                isInitializedRef.current = true;
                lastSyncTimeRef.current = Date.now();
                console.log("Инициализация завершена");
            } catch (error) {
                console.error('Ошибка инициализации:', error);
                // Установка значений по умолчанию при ошибке
                setCoins(0);
                setCoinsPerClick(1);
                setHourlyCoins(10);
            } finally {
                setIsLoading(false);
            }
        }
        
        init();

        // Настройка периодической синхронизации
        syncTimerRef.current = setInterval(() => {
            syncWithServer();
        }, 10000);

        // Очистка при размонтировании
        return () => {
            if (syncTimerRef.current) {
                clearInterval(syncTimerRef.current);
            }
            // Финальная синхронизация при выходе
            if (pendingClicksRef.current > 0) {
                syncWithServer(true);
            }
        };
    }, []);

    // Функция для синхронизации с сервером
    const syncWithServer = async (isFinal = false) => {
        if (!isInitializedRef.current || !tgId) return;
        
        // Предотвращаем слишком частую синхронизацию, кроме финальной
        if (!isFinal && Date.now() - lastSyncTimeRef.current < 5000) {
            console.log("Слишком рано для синхронизации");
            return;
        }
        
        console.log("Начало синхронизации с сервером");
        lastSyncTimeRef.current = Date.now();
        
        try {
            if (pendingClicksRef.current > 0) {
                console.log(`Синхронизация: отправка ${pendingClicksRef.current} кликов`);
                const clicksToSync = pendingClicksRef.current;
                
                // Важно: сбрасываем счетчик только если запрос успешен
                try {
                    // Отправляем накопленные клики на сервер и получаем обновленное значение
                    const response = await addClickCoins(tgId, clicksToSync);
                    
                    // Сбрасываем счетчик только после успешной отправки
                    pendingClicksRef.current -= clicksToSync;
                    
                    // Устанавливаем монеты из ответа сервера
                    if (response && response.coins !== undefined) {
                        console.log(`Обновление монет из ответа: ${response.coins}`);
                        setCoins(response.coins);
                        return; // Завершаем синхронизацию если получили данные
                    }
                } catch (clickError) {
                    console.error("Ошибка при отправке кликов:", clickError);
                    // Не сбрасываем pendingClicksRef при ошибке
                }
            }
            
            // Если не удалось получить данные из addClickCoins или нет ожидающих кликов
            // Получаем текущее количество монет
            try {
                const currentCoins = await getUserCoins(tgId);
                console.log(`Получено текущее количество монет: ${currentCoins}`);
                setCoins(currentCoins);
                
                // Заодно обновляем данные о пользователе раз в 30 секунд
                if (Date.now() % 30000 < 10000) {
                    const userData = await getUserData(tgId);
                    if (userData) {
                        setCoinsPerClick(userData.coins_click ?? coinsPerClick);
                        setHourlyCoins(userData.coins_hours ?? hourlyCoins);
                        console.log("Обновлены данные пользователя");
                    }
                }
            } catch (coinsError) {
                console.error("Ошибка при получении текущих монет:", coinsError);
            }
        } catch (error) {
            console.error('Общая ошибка синхронизации:', error);
        }
    };

    const handleClick = () => {
        if (!isInitializedRef.current) {
            console.log("Клик проигнорирован: приложение еще не инициализировано");
            return;
        }
        
        // Мгновенно обновляем счетчик на фронтенде
        setCoins(prevCoins => {
            const actualPrevCoins = isNaN(prevCoins) ? 0 : prevCoins;
            const clickValue = isNaN(coinsPerClick) ? 1 : coinsPerClick;
            const newValue = actualPrevCoins + clickValue;
            console.log(`Клик: ${actualPrevCoins} + ${clickValue} = ${newValue}`);
            return newValue;
        });
        
        // Увеличиваем счетчик ожидающих синхронизации кликов
        pendingClicksRef.current += 1;
        console.log(`Ожидающие клики: ${pendingClicksRef.current}`);
    }

    return(
        <div className='main'>
            <div className='fdata-out'>
                <div className="data">
                    <p className='pdata'>Монеты за клик: {isNaN(coinsPerClick) ? 1 : coinsPerClick}</p>
                </div>
                <div className="data">
                    <p className='pdata'>Монеты для апа: {isNaN(coinsPerClick) ? 10 : coinsPerClick * 10}</p>
                </div>
                <div className="data">
                    <p className='pdata'>Прибыль в час: {isNaN(hourlyCoins) ? 10 : hourlyCoins}</p>
                </div>
            </div>
            <div>
                <div className='money'>
                    <img className='money-icon' src={CoinIco} width='36' height='34' alt="Монеты"/>
                    <p className='counter'>{isNaN(coins) ? 0 : coins}</p>
                </div>
                <div className='button'>
                    <button className='clicker-button' onClick={handleClick} disabled={isLoading}>
                        <img className='button-image' src={Jagermester} alt="Кликер"/>
                    </button>
                </div>
            </div>
        </div>
    )
}