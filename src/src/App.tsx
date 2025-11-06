import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"

import { SocketProvider } from "./context/SocketContext";
import { NotificationProvider } from "./context/NotificationContext";

import Home from "@/pages/Home"
import Test from "@/pages/Test"
import Profile from "@/pages/Profile"
import Ladder from "@/pages/Ladder"
import Game from "@/pages/Game"
import Login from "@/pages/login"
import SignIn from "@/pages/Register"
import Tournoi from "@/pages/tournoi"
import LiveChat from "@/pages/liveChat"
import TFA from "@/pages/tfa"

// import Testlog from "@/pages/testlog"


function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <NotificationProvider>
          <SocketProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/test" element={<Test />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/ladder" element={<Ladder />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signIn" element={<SignIn />} />
              <Route path="/game" element={<Game />} />
              <Route path="/tournoi" element={<Tournoi />} />
              <Route path="/liveChat" element={<LiveChat />} />
              <Route path="/tfa" element={<TFA />} />
            </Routes>
          </SocketProvider>
        </NotificationProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
