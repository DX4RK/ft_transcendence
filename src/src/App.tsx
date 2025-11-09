import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";

import { SocketProvider } from "./context/SocketContext";
import { NotificationProvider } from "./context/NotificationContext";
import { TournamentProvider } from "./context/TournamentContext";

import "./i18n";
import LanguageSelector from "@/components/language-selector";
import { useTranslation } from "react-i18next";

import Home from "@/pages/Home";
import Profile from "@/pages/Profile";
import Ladder from "@/pages/Ladder";
import Game from "@/pages/Game";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Tournoi from "@/pages/Tournoi";
import LiveChat from "@/pages/LiveChat";
import TFA from "@/pages/TFA";
import Settings from "@/pages/Settings";

function App() {
	const changeLang = (lang: string) => {
		i18n.changeLanguage(lang);
		localStorage.setItem('lang', lang);
	};

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
                <Route path="/ladder" element={<Ladder />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/game" element={<Game />} />
                <Route path="/tournoi" element={<Tournoi />} />
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
