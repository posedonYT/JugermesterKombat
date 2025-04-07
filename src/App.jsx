import React from 'react'
import { Routes, Route, Link, Outlet} from 'react-router-dom';
import Lower from './forms/Lower';
import './App.css'

function App() {
  return (
    <div className='main'>
        <header>
          <div className='header'>
            <h1>Jagermester kombat </h1>
          </div>
        </header>
        <div className="outlet-container">
          <Outlet />
        </div>

        <footer>
          <dov className='lower'>
            <Lower/>
          </dov>
        </footer>
    </div>
  );
}
export default App;