import { useState } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import MainPage from 'pages/MainPage/MainPage'
import Header from 'components/Header'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='app'>
      <Header/>
      <HashRouter>
        <Routes>
          <Route path='/' element={<MainPage/>} />
        </Routes>
      </HashRouter>
    </div>
  )
}

export default App
