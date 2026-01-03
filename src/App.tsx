import { BrowserRouter as Router } from 'react-router-dom'
import { AppRouter } from '@/router'
import './App.css'

function App() {
  const basename = import.meta.env.BASE_URL || '/'

  return (
    <Router basename={basename}>
      <AppRouter />
    </Router>
  )
}

export default App
