const fs = require('fs');

// Wait for Vault credentials to be available
function waitForVaultCredentials() {
    return new Promise((resolve) => {
        const checkCredentials = () => {
            if (fs.existsSync('/vault/data/vault-creds.txt') && fs.existsSync('/vault/data/vault-ready.txt')) {
                resolve();
            } else {
                console.log('Waiting for Vault to be ready...');
                setTimeout(checkCredentials, 2000);
            }
        };
        checkCredentials();
    });
}

// Initialize vault client
let vault = null;

async function initializeVaultClient() {
    try {
        await waitForVaultCredentials();
        
        const credentials = fs.readFileSync('/vault/data/vault-creds.txt', 'utf8');
        const tokenMatch = credentials.match(/ROOT_TOKEN=(.+)/);
        
        let vaultToken = 'myroot'; // fallback
        if (tokenMatch) {
            vaultToken = tokenMatch[1].trim();
            console.log('✅ Using production Vault token');
        } else {
            console.log('⚠️ Using fallback token for Vault connection');
        }

        vault = require('node-vault')({
            apiVersion: 'v1',
            endpoint: 'http://vault:8200',
            token: vaultToken
        });

        return vault;
    } catch (error) {
        console.log('⚠️ Failed to initialize Vault client:', error.message);
        throw error;
    }
}

class VaultClient {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000;
        this.vaultClient = null;
        this.initPromise = this.initialize();
    }

    async initialize() {
        try {
            this.vaultClient = await initializeVaultClient();
            
            // Test the connection
            await this.vaultClient.read('sys/health');
            console.log('✅ Vault client initialized and tested successfully');
        } catch (error) {
            console.error('❌ Failed to initialize Vault client:', error.message);
            throw error;
        }
    }

    async ensureInitialized() {
        if (!this.vaultClient) {
            try {
                await this.initPromise;
            } catch (error) {
                // If initialization failed, retry once
                console.log('🔄 Retrying Vault initialization...');
                this.initPromise = this.initialize();
                await this.initPromise;
            }
        }
        return this.vaultClient;
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
            const vault = await this.ensureInitialized();
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
        const vault = await this.ensureInitialized();
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
