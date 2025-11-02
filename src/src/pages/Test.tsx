import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

function Test() {
  return (
	<div className="bg-black">

		<Link to="/" className="text-base text-xl text-cyan-300/70 font-arcade">ft_transcendence</Link>

	  <div className="flex flex-col items-center justify-center">
        <Button onClick={() => alert("Hello !")}>Test Button</Button>
      </div>

      {/* <link to="/" className="mt-10 px-6 py-3 rounded-full bg-pink-200 dark:bg-black-950 text-2xl text-white font-bold shadow-xl hover:bg-yellow-500 hover:scale-110 hover:italic hover:shadow-inner hover:outline hover:outline-4 hover:outline-cyan-500 transition">
        ⬅ Retour </link> */}
	<div>
		  <Link to="/" className="flex p-1 mx-1 text-orange-300/80 font-arcade text-xl justify-center hover:scale-110 hover:shadow-xl transition">Home</Link>
	</div>

	</div>
  )
}

export default Test
