import {React, useState} from 'react'
import './Home.css'
import Jagermester from '/Jagermester.png'
import CoinIco from '../../public/coin.svg'

export default function Home(){
    const [coins, setCoins] = useState(0)

    const handleClick = (e) => {
        setCoins(coins+1)
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
                    <img src={CoinIco} width='36' height='34'/>
                    <h1 className='counter'>{coins}</h1>
                </div>
                <div className='button'>
                    <button className='clicker-button' onClick={handleClick}>
                        <img className='button-image' src={Jagermester}/>
                    </button>
                </div>
            </div>
        </div>
    )
}