const vault = require('node-vault')({
    apiVersion: 'v1',
    endpoint: 'http://vault:8200',
    token: 'myroot'
});

class VaultClient {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000;
    }

    async getSecret(path) {
        const cacheKey = `secret/data/${path}`;

        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        try {
            const response = await vault.read(cacheKey);
            const secretData = response.data.data;

            this.cache.set(cacheKey, {
                data: secretData,
                timestamp: Date.now()
            });

            return secretData;
        } catch (error) {
            throw new Error(`Failed to fetch secret: ${path}`);
        }
    }

    async getSecrets(paths) {
        const promises = paths.map(async (path) => {
            const data = await this.getSecret(path);
            return { [path]: data };
        });

        const results = await Promise.all(promises);
        return Object.assign({}, ...results);
    }

    clearCache() {
        this.cache.clear();
    }
}

module.exports = new VaultClient();
