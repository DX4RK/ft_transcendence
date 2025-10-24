import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import { SocketProvider } from "@/contexts/SocketContext"

import Home from "@/pages/Home"
import LiveChat from "@/pages/LiveChat"
import SignIn from "@/pages/login/page"
import SignUp from "@/pages/signup/page"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SocketProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/live" element={<LiveChat />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </ThemeProvider>
  )
}

export default App
