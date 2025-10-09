import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"

import Home from "@/pages/Home"
import Test from "@/pages/Test"
import Profile from "@/pages/Profile"
import Ladder from "@/pages/Ladder"
import Game from "@/pages/Game"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<Test />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/ladder" element={<Ladder />} />
		  <Route path="/game" element={<Game />} />

        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
