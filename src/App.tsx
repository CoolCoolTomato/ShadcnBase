import { BrowserRouter as Router } from 'react-router-dom'
import { AppRouter } from '@/router'
import { ThemeProvider } from '@/components/custom/theme-provider'

function App() {
  const basename = import.meta.env.BASE_URL || '/'

  return (
    <div className="font-sans antialiased" style={{ fontFamily: 'var(--font-inter)' }}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Router basename={basename}>
          <AppRouter />
        </Router>
      </ThemeProvider>
    </div>
  )
}

export default App
