import { Routes, Route } from 'react-router'
import './App.css'
import WidgetGrid from './WidgetGrid'

function App() {

  return (
    <>
      <Routes>
        {/* <Route path='' element={<Home/>} /> */}
        <Route path='' element={<WidgetGrid/>} />
      </Routes>
    </>
  )
}

export default App
