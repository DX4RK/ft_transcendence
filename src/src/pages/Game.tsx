import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import BabylonScene from "../../Game/Game";
import { useEffect } from "react";



function Game() {

	  // Fonction appelée à la fois par le bouton et la touche Échap
  const handleEscape = () => {
    alert("- Game paused -");
    // Ici, tu peux mettre ton code pour mettre le jeu en pause, etc.
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleEscape();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Nettoyage à la fin du cycle de vie du composant
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

	return (
	<div className="bg-gradient-to-r from-cyan-500/50 to-blue-500/50">

	<Link to="/" className="text-base text-xl font-arcade">ft_transcendence</Link>

	<div className="absolute top-10 right-20 z-10">PAUSE
		<Button onClick={() => alert("- Game paused -")} />
	</div>

	<BabylonScene />

		  <Link to="/" className="flex p-1 mx-1 text-orange-300/80 font-arcade text-xl justify-center hover:scale-110 hover:shadow-xl transition">Home</Link>
	</div>
  )
}

export default Game
