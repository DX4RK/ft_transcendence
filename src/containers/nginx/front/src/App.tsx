import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import { io } from "socket.io-client";

import Home from "@/pages/Home"
import LiveChat from "@/pages/LiveChat"
import SignIn from "@/pages/login/page"
import SignUp from "@/pages/signup/page"

const socket = io("http://localhost:3000", {
    withCredentials: true
});

socket.on('message', () => {
	console.log("hello");
});

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/live" element={<LiveChat />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
