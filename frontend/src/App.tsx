import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import FileUploader from './components/FileUploader'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <FileUploader></FileUploader>
      </div>
      
    </>
  )
}

export default App
