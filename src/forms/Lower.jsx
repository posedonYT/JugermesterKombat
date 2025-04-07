import React from 'react'
import { Routes, Route, Link, Outlet} from 'react-router-dom';
import MineIco from '/maine.svg'
import UserIco from '/user.svg'
import ShopIco from '/friends.svg'
import './Lower.css'

export default function Lower(){

    return(
        <div className='lmain'>
            <button className='button-translator1'>
                <img src={MineIco} width='37' height='37'/>
                <p className='treanslator-text'>майн</p>
            </button>
            <button className='button-translator2'>
                <img src={ShopIco} width='37' height='37' />
                <p className='treanslator-text'>магазин</p>
            </button>
            <button className='button-translator3'>
                <img src={UserIco} width='37' height='37' background='none' />
                <p className='treanslator-text'>профиль</p>
            </button>
        </div>
    )
}