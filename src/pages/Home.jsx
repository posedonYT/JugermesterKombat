import { React, useState, useEffect, useRef } from 'react'
import './Home.css'
import Jagermester from '/Jagermester.png'
import CoinIco from '../../public/coin.svg'
import { addClickCoins, getUserCoins, createOrGetUser, getTgID } from '../data/backend.js'

export default function Home() {
    const [coins, setCoins] = useState(0)
    const [tgId, setTGId] = useState(12345678)
    const [coinsPerClick, setCoinsPerClick] = useState(1)
    const [hourlyCoins, setHourlyCoins] = useState(10)
    const pendingClicksRef = useRef(0)
    const syncTimerRef = useRef(null)
    const isInitializedRef = useRef(false)

    // Инициализация пользователя и загрузка данных
    useEffect(() => {
        const init = async () => {
            try {
                // 1. Получаем TG ID
                const id = getTgID();
                if (!id && id !== 0) throw new Error("TG ID не найден");
                setTGId(id);

                // 2. Создаем/получаем пользователя
                const userData = await createOrGetUser(id, "Новый игрок");
                
                // 3. Устанавливаем данные пользователя
                setCoins(userData.coins || 0);
                setCoinsPerClick(userData.coins_click || 1);
                setHourlyCoins(userData.coins_hours || 10);
                
                isInitializedRef.current = true;
            } catch (error) {
                console.error('Ошибка инициализации:', error);
            }
        }
        init();

        // Настройка периодической синхронизации
        syncTimerRef.current = setInterval(syncWithServer, 10000);

        // Очистка при размонтировании
        return () => {
            if (syncTimerRef.current) {
                clearInterval(syncTimerRef.current);
            }
            // Финальная синхронизация при выходе
            if (pendingClicksRef.current > 0) {
                syncWithServer();
            }
        };
    }, []);

    // Функция для синхронизации с сервером
    const syncWithServer = async () => {
        if (!isInitializedRef.current) return;
        
        try {
            if (pendingClicksRef.current > 0) {
                const clicksToSync = pendingClicksRef.current;
                pendingClicksRef.current = 0;
                
                // Отправляем накопленные клики на сервер
                await addClickCoins(tgId, clicksToSync);
            }
            
            // Получаем актуальное количество монет с сервера
            const serverCoins = await getUserCoins(tgId);
            setCoins(serverCoins);
        } catch (error) {
            console.error('Ошибка синхронизации с сервером:', error);
            // Не сбрасываем счетчик кликов, если произошла ошибка
        }
    };

    const handleClick = () => {
        // Мгновенно обновляем счетчик на фронтенде
        setCoins(prevCoins => {
            const newValue = prevCoins + coinsPerClick;
            return isNaN(newValue) ? coinsPerClick : newValue;
        });
        
        // Увеличиваем счетчик ожидающих синхронизации кликов
        pendingClicksRef.current += 1;
    }

    return(
        <div className='main'>
            <div className='fdata-out'>
                <div className="data">
                    <p className='pdata'>Монеты за клик: {coinsPerClick}</p>
                </div>
                <div className="data">
                    <p className='pdata'>Монеты для апа: {coinsPerClick * 10}</p>
                </div>
                <div className="data">
                    <p className='pdata'>Прибыль в час: {hourlyCoins}</p>
                </div>
            </div>
            <div>
                <div className='money'>
                    <img className='money-icon' src={CoinIco} width='36' height='34' alt="Монеты"/>
                    <p className='counter'>{isNaN(coins) ? 0 : coins}</p>
                </div>
                <div className='button'>
                    <button className='clicker-button' onClick={handleClick}>
                        <img className='button-image' src={Jagermester} alt="Кликер"/>
                    </button>
                </div>
            </div>
        </div>
    )
}