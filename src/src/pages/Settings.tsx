// import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom";
import { SquarePen } from 'lucide-react';

function Settings() {

	const email = 'email@example.com';
	const username = 'username';
	const phone = 'none';
	const toptoStatus = 'unlinked';

	return (
		<div className="min-h-screen w-full bg-gradient-to-r from-cyan-500/50 to-blue-500/50">
			<Link to="/" className="flex-grow text-base text-cyan-300/70 text-xl font-arcade z-30">ft_transcendence</Link>
			<div className="min-h-screen flex items-center justify-center p-8">
				<div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
					<div className="flex items-center gap-3">
						<span className="text-2xl font-arcade text-gray-300">Settings</span>
					</div>
					<h1 className="font-bold pt-3 pb-2">Account Info</h1>
					<div className="max-w-4xl w-full">
						<div className="flex">
							<div className="flex-1">
								<span className="font-bold">Username:</span>
								<span className="pl-2">{username}</span>
							</div>
						</div>
						<div className="flex">
							<div className="flex-1">
								<span className="font-bold">Email:</span>
								<span className="pl-2">{email}</span>
							</div>
						</div>
						<div className="flex">
							<div className="flex-1">
								<span className="font-bold">Phone Number:</span>
								<span className="pl-2">{phone}</span>
							</div>
							<button>
								<SquarePen />
							</button>
						</div>
						<div className="flex">
							<div className="flex-1">
								<span className="font-bold">Totp 2FA Status:</span>
								<span className="pl-2">{toptoStatus}</span>
							</div>
							<button>
								<SquarePen />
							</button>
						</div>
					</div>
					<h1 className="font-bold pt-3 pb-2">2-Step Verification</h1>
					<div className="grid gap-2">
						<div className="flex border-2 p-3 rounded-lg max-w-175">
							<div className="grid mr-4 flex-1">
								<span className="font-bold">Email</span>
								<span>Receive unique security codes at your specified email.</span>
							</div>
							<div>
								<input className="w-5 h-5" type="radio"></input>
							</div>
						</div>
						<div className="flex border-2 p-3 rounded-lg max-w-175">
							<div className="grid mr-4 flex-1">
								<span className="font-bold">Phone Number</span>
								<span>Receive unique security codes at your specified phone number.</span>
							</div>
							<div>
								<input className="w-5 h-5" type="radio"></input>
							</div>
						</div>
						<div className="flex border-2 p-3 rounded-lg max-w-175">
							<div className="grid mr-4">
								<span className="font-bold">Authenticator App (Very Secure)</span>
								<span>Download an app on your phone to generate unique security codes. Suggested apps include Google Authenticator, Microsoft Authenticator, and Twilio's Authy.</span>
							</div>
							<div>
								<input className="w-5 h-5" type="radio"></input>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
export default Settings
