import { React, useState, useEffect } from 'react'
import './Home.css'
import Jagermester from '/Jagermester.png'
import CoinIco from '../../public/coin.svg'
import { addClickCoins, getUserCoins, createOrGetUser, getTgID } from '../data/backend.js'

export default function Home() {
    const [coins, setCoins] = useState(0)
    const [tgId] = useState(getTgID)

    // Загрузка начального количества монет
    useEffect(() => {
        const initUser = async () => {
            try {
                // 1. Создаем пользователя если его нет
                await createOrGetUser(tgId, "Новый игрок")
                
                // 2. Загружаем актуальные монеты
                const currentCoins = await getUserCoins(tgId)
                setCoins(currentCoins)
            } catch (error) {
                console.error('Ошибка инициализации:', error)
            }
        }
        initUser()
    }, [tgId])

    const handleClick = async () => {
        try {
            // Отправляем клик на бэкенд
            await addClickCoins(tgId)
            // Получаем обновленные монеты с сервера
            const updatedCoins = await getUserCoins(tgId)
            setCoins(updatedCoins)
        } catch (error) {
            console.error('Ошибка при клике:', error)
        }
    }

    return(
        <div className='main'>
            <div className='fdata-out'>
                <div className="data">
                    <p className='pdata'>Монеты за клик: 1</p>
                </div>
                <div className="data">
                    <p className='pdata'>Монеты для апа: 1м </p>
                </div>
                <div className="data">
                    <p className='pdata'>Прибыль в час: 10</p>
                </div>
            </div>
            <div>
                <div className='money'>
                    <img className='money-icon' src={CoinIco} width='36' height='34' alt="Монеты"/>
                    <p className='counter'>{coins}</p>
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