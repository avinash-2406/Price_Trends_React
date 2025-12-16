
import './App.css'
import Pricetrend from './components/Pricetrend';
import Testentry from './components/Testentry'
import Uploadexcel from './components/Uploadexcel'
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  

  return (
    <BrowserRouter>
      <Routes>

        <Route path='/' element={<Uploadexcel/>}></Route>

        <Route path='/pricetrend' element={<Pricetrend/>}></Route>
        <Route path='/testentry' element={<Testentry/>}></Route>
      </Routes>
    </BrowserRouter>
    
  )
}


export default App
