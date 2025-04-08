import React from 'react'
import { useNavigate } from 'react-router-dom';
import MineIco from '/maine.svg'
import UserIco from '/profile.svg'
import ShopIco from '/friends.svg'
import './Lower.css'

export default function Lower(){
    const navigate = useNavigate()

    const goToMine = () => {
        navigate('/')
    }

    const goToShop = () => {
        navigate('/shop')
    }

    const goToProfile = () => {
        navigate('/user')
    }

    return(
        <div className='lmain'>
            <button onClick={goToMine} className='button-translator1'>
                <img src={MineIco} width='37' height='37'/>
                <p className='treanslator-text'>майн</p>
            </button>
            <button onClick={goToShop} className='button-translator2'>
                <img src={ShopIco} width='37' height='37' />
                <p className='treanslator-text'>магазин</p>
            </button>
            <button onClick={goToProfile} className='button-translator3'>
                <img className='profile-button-ico' src={UserIco} width='37' height='37' background='none' />
                <p className='treanslator-text'>профиль</p>
            </button>
        </div>
    )
}