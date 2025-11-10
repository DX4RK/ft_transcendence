// import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom";
import { SquarePen } from 'lucide-react';
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';

interface Settings {
	notifications_enabled?: boolean,
	language?: string,
	user?: string,
	email?: string,
	phone?: string,
	totp?: string,
	twofa_method?: string
}

function Settings() {
	const navigate = useNavigate();
	const [errorMessage, setErrorMessage] = useState('');
	const [settings, setSettings] = useState<Settings | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [qrcodeImage, setQrcodeImage] = useState('');
	const { t } = useTranslation();

	function isValidE164(phone: string): boolean {
		const e164Regex = /^\+[1-9]\d{1,14}$/;
		return e164Regex.test(phone);
	}

	const isValidTwofa = (option: string) => {
		return typeof option === 'string' && (option === 'email' || option === 'phone' || option === 'totp');
	};

	const handleEditTotp = () => {
		const api = axios.create({
			headers: {
				"Content-Type": 'application/json',
			},
			withCredentials: true
		});
		api.post('http://localhost:3000/twofa/generate-totp')
		.then(res => {
			console.log(res);
			setErrorMessage("success");
			setQrcodeImage(res.data.qrCode);
			setSettings(prev => {
				if (!prev) return prev;
				return {
					...prev,
					totp: 'linked',
				};
			});
		})
		.catch(err => {
			console.error(err);
			setErrorMessage(err.message);
		});
	}

	const handleEditPhone = () => {
		const newPhone = window.prompt('Enter your new phone number:', settings?.phone || '');

		if (!newPhone) {
			setErrorMessage('Case is empty');
			return;
		}

		if (!isValidE164(newPhone))
			setErrorMessage('Invalid phone format');

		const api = axios.create({
			headers: {
				"Content-Type": 'application/json',
			},
			withCredentials: true
		});
		api.post('http://localhost:3000/my/change-phone', JSON.stringify({'phoneNumber': newPhone}))
		.then(res => {
			console.log(res);
			setSettings(prev => {
				if (!prev) return prev;
				return {
					...prev,
					phone: newPhone,
				};
			});
			setErrorMessage("success");
		})
		.catch(err => {
			console.error(err);
			setErrorMessage(err.message);
		});
	}

	const setSelectedOption = (option: string) => {
		if (!isValidTwofa(option)) return;
		if (option === 'phone' && settings?.phone === 'none')
			return;
		else if (option === 'totp' && settings?.totp === 'unlinked')
			return;

		const api = axios.create({
			headers: {
				"Content-Type": 'application/json',
			},
			withCredentials: true
		});
		api.post('http://localhost:3000/my/change-twofa', JSON.stringify({'option': option}))
		.then(res => {
			console.log(res);
			setSettings(prev => {
				if (!prev) return prev;
				return {
					...prev,
					twofa_method: option,
				};
			});
			setErrorMessage("success");
		})
		.catch(err => {
			console.error(err);
			setErrorMessage(err.message);
		});
	}

	const disconnect = () => {
		const api = axios.create({
			headers: {
				"Content-Type": 'application/json',
			},
			withCredentials: true
		});
		api.post('http://localhost:3000/my/disconnect')
		.then(res => {
			console.log(res);
			navigate('/login');
		})
		.catch(err => {
			console.error(err);
			setErrorMessage(err.message);
		});
	}

	useEffect(() => {
		if (errorMessage && errorMessage.length > 0)
			window.alert(errorMessage);
		setErrorMessage('');
	}, [errorMessage]);

	useEffect(() => {
		const api = axios.create({
			withCredentials: true
		});
		api.get('http://localhost:3000/my/settings')
		.then(res => {
			setSettings(res.data.data);
			setLoading(false);
		})
		.catch(err => {
			setError(err);
			setLoading(false);
		});
	}, []);

	if (loading) return <p>{t("settings.loadSettings")}</p>;
	if (error) return <p>{t("settings.failLoadSettings")}</p>;
	if (!settings) return <p>{t("settings.failLoadSettings")}</p>;

	return (
		<div className="min-h-screen w-full bg-gradient-to-r from-cyan-500/50 to-blue-500/50">
			<AnimatePresence>
				{qrcodeImage && (
					<motion.div
						key="qr-popup"
						initial={{ opacity: 0, scale: 1, y: -30 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.8, y: 50 }}
						transition={{ duration: 0.2, ease: "easeOut" }}
						className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
							flex z-20 min-h-screen items-center justify-center p-8"
						>
						<div className="grid bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
							<span className="text-2xl font-arcade text-gray-300 text-center">QRCODE</span>
							<span className="opacity-75">Scan this qrcode with your authenticator app</span>
							<div className="flex w-full justify-center">
								<div className="w-42 mt-4 aspect-square p-2 border-2 rounded-lg border-dashed">
									<img className="rounded-md" src={qrcodeImage} />
								</div>
							</div>
							<button onClick={() => setQrcodeImage('')} className="bg-blue-500 mt-4 p-3 rounded-lg">I scanned</button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
			<Link to="/" className="flex-grow text-base text-cyan-300/70 text-xl font-arcade z-30">ft_transcendence</Link>
			<div className="min-h-screen flex items-center justify-center p-8">
				<div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
					<div className="flex items-center gap-3">
						<span className="text-2xl font-arcade text-gray-300">{t("settings.settings")}</span>
					</div>
					<h1 className="font-bold pt-3 pb-2">{t("settings.accountInfo")}</h1>
					<div className="max-w-4xl w-full">
						<div className="flex">
							<div className="flex-1">
								<span className="font-bold">{t("settings.username")}</span>
								<span className="pl-2">
									{settings?.user || 'undefined'}
								</span>
							</div>
						</div>
						<div className="flex">
							<div className="flex-1">
								<span className="font-bold">{t("settings.email")}</span>
								<span className="pl-2">
									{settings?.email || 'undefined'}
								</span>
							</div>
						</div>
						<div className="flex">
							<div className="flex-1">
								<span className="font-bold">{t("settings.phoneNumber")}</span>
								<span className="pl-2">
									{settings?.phone || 'undefined'}
								</span>
							</div>
							<button onClick={handleEditPhone}>
								<SquarePen />
							</button>
						</div>
						<div className="flex">
							<div className="flex-1">
								<span className="font-bold">Totp 2FA Status:</span>
								<span className="pl-2">
									{settings?.totp || 'undefined'}
								</span>
							</div>
							<button onClick={handleEditTotp}>
								<SquarePen />
							</button>
						</div>
					</div>
					<h1 className="font-bold pt-3 pb-2">2-Step Verification</h1>
					<div className="grid gap-2">
						<div className="flex border-2 p-3 rounded-lg max-w-175">
							<div className="grid mr-4 flex-1">
								<span className="font-bold">{t("settings.email")}</span>
								<span>{t("settings.uniqueSecurityCodeEmail")}</span>
							</div>
							<div>
								<input
									className="w-5 h-5"
									type="radio"
									checked={settings.twofa_method === 'email'}
									onChange={() => setSelectedOption('email')}
								/>
							</div>
						</div>
						<div className="flex border-2 p-3 rounded-lg max-w-175">
							<div className="grid mr-4 flex-1">
								<span className="font-bold">{t("settings.phoneNumber")}</span>
								<span>{t("settings.uniqueSecurityCodeNumber")}</span>
							</div>
							<div>
								<input
									className="w-5 h-5"
									type="radio"
									checked={settings.twofa_method === 'phone'}
									onChange={() => setSelectedOption('phone')}
								/>
							</div>
						</div>
						<div className="flex border-2 p-3 rounded-lg max-w-175">
							<div className="grid mr-4">
								<span className="font-bold">Authenticator App {t("settings.verySecure")}</span>
								<span>{t("settings.downloadApp")}</span>
							</div>
							<div>
								<input
									className="w-5 h-5"
									type="radio"
									checked={settings.twofa_method === 'totp'}
									onChange={() => setSelectedOption('totp')}
								/>
							</div>
						</div>
					</div>
					<button onClick={disconnect} className="bg-red-500/80 w-full mt-4 p-3 rounded-lg">{t("settings.disconnect")}</button>
				</div>
			</div>
		</div>
	);
}
export default Settings
