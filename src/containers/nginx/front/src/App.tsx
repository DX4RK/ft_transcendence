import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";

import { SocketProvider } from "./context/SocketContext";
import { NotificationProvider } from "./context/NotificationContext";
import { TournamentProvider } from "./context/TournamentContext";

import "./i18n";
import LanguageSelector from "@/components/language-selector";

import Home from "@/pages/Home";
import Profile from "@/pages/Profile";
import Game from "@/pages/Game";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Tournament from "@/pages/Tournament";
import Tournament_recap from "@/pages/Tournament_recap";
import LiveChat from "@/pages/LiveChat";
import TFA from "@/pages/TFA";
import Settings from "@/pages/Settings";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {/* ✅ ajoute ton sélecteur de langue ici, visible sur toutes les pages */}
      <LanguageSelector />

      <BrowserRouter>
        <NotificationProvider>
          <SocketProvider>
            <TournamentProvider>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/game" element={<Game />} />
                <Route path="/tournament" element={<Tournament />} />
                <Route path="/tournament_recap" element={<Tournament_recap />} />
                <Route path="/liveChat" element={<LiveChat />} />
                <Route path="/tfa" element={<TFA />} />
                <Route path="/settings" element={<Settings />} />

                {/* <Route path="/testlog" element={<Testlog />} /> */}


              </Routes>
            </TournamentProvider>
          </SocketProvider>
        </NotificationProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
