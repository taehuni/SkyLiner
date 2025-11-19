
import react from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './page/MainPage/';
import TrendPlacePage from './page/TrendPlacePage/';
import './styles/App.css'

function App() {
  return(
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<MainPage/>} /> {/* 각 페이지 단위를 route로 다룸*/}
      <Route path='/TrendPlace' element={<TrendPlacePage/>} />
    </Routes>
    </BrowserRouter>
  );
}
export default App
