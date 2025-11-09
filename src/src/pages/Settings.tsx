// import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom";
import { SquarePen } from 'lucide-react';
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
	const [errorMessage, setErrorMessage] = useState('');
	const [settings, setSettings] = useState<Settings | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const { t } = useTranslation();

	function isValidE164(phone: string): boolean {
		const e164Regex = /^\+[1-9]\d{1,14}$/;
		return e164Regex.test(phone);
	}

	const isValidTwofa = (option) => {
		return typeof option === 'string' && (option === 'email' || option === 'phone' || option === 'totp');
	};

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
				"Authorization": `Bearer ${localStorage.getItem('token')}`,
			},
		});
		api.post('http://localhost:3000/my/change-phone', JSON.stringify({'phoneNumber': newPhone}))
		.then(res => {
			// setSettings(prev => {
			// 	const updated = [...prev];
			// 	updated[2] = { ...updated[2], phone: newPhone };
			// 	return updated;
			//   });
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

	}

	useEffect(() => {
		if (errorMessage && errorMessage.length > 0)
			window.alert(errorMessage);
		setErrorMessage('');
	}, [errorMessage]);

	useEffect(() => {
		const api = axios.create({
			headers: {
			  Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		});
		api.get('http://localhost:3000/my/settings')
		.then(res => {
			setSettings(res.data.data);
			setLoading(false);
		})
		.catch(err => {
			console.error(err);
			setError(err);
			setLoading(false);
		});
	}, []);

	if (loading) return <p>{t("settings.loadSettings")}</p>;
	if (error) return <p>{t("settings.failLoadSettings")}</p>;
	if (!settings) return <p>{t("settings.failLoadSettings")}</p>;

	return (
		<div className="min-h-screen w-full bg-gradient-to-r from-cyan-500/50 to-blue-500/50">
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
							<button>
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
									onChange={() => setSelectedOption('email')}
								/>
							</div>
						</div>
						<div className="flex border-2 p-3 rounded-lg max-w-175">
							<div className="grid mr-4">
								<span className="font-bold">Authenticator App (Very Secure)</span>
								<span>{t("settings.downloadApp")}</span>
							</div>
							<div>
								<input
									className="w-5 h-5"
									type="radio"
									checked={settings.twofa_method === 'totp'}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
export default Settings
