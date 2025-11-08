const vaultClient = require('../service/vault');

class ConfigManager {
	constructor() {
		this.config = null;
	}

	async initialize() {
		if (this.config) return this.config;

		try {
			const secrets = await vaultClient.getSecrets([
				'app/server', 'app/jwt', 'app/gmail', 'app/vonage', 'app/cookie', 'app/database'
			]);

			this.config = {
				port: parseInt(secrets['app/server'].port) || 3000,
				jwtSecret: secrets['app/jwt'].secret,
				gmailUser: secrets['app/gmail'].user,
				gmailPass: secrets['app/gmail'].pass,
				vonageKey: secrets['app/vonage'].key,
				vonageSecret: secrets['app/vonage'].secret,
				cookieSecret: secrets['app/cookie'].secret,
				database: {
					host: secrets['app/database'].host,
					user: secrets['app/database'].user,
					password: secrets['app/database'].password,
					database: secrets['app/database'].database
				}
			};

			return this.config;
		} catch (error) {
			console.error('Vault unavailable - application cannot start');
			throw new Error('Configuration failed: Vault required');
		}
	}

	async getConfig() {
		return await this.initialize();
	}

	async get(key) {
		const config = await this.getConfig();
		return key.split('.').reduce((obj, k) => obj && obj[k], config);
	}

	async reload() {
		this.config = null;
		vaultClient.clearCache();
		return await this.initialize();
	}
}

const configManager = new ConfigManager();

module.exports = {
	getConfig: () => configManager.getConfig(),
	get: (key) => configManager.get(key),
	reload: () => configManager.reload()
};
