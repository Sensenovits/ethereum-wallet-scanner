require('dotenv').config();
const express = require('express');
const Web3 = require('web3');
const cors = require('cors');

const app = express();
const web3 = new Web3(`https://eth-mainnet.g.alchemy.com/v2/${process.env.8UTd4jIsSuaSFJJzizsQBrS7wG1JiSDE}`);

app.use(cors());
app.use(express.json());

class EthereumScanner {
    constructor(web3) {
        this.web3 = web3;
        this.isScanning = false;
        this.totalScanned = 0;
        this.foundWallets = [];
    }

    async initialize(startKey, stopKey) {
        this.startKey = BigInt('0x' + startKey);
        this.stopKey = BigInt('0x' + stopKey);
        this.isScanning = true;
        this.totalScanned = 0;
        this.foundWallets = [];
        this.currentKey = this.startKey;

        while (this.isScanning && this.currentKey <= this.stopKey) {
            const key = this.currentKey.toString(16).padStart(64, '0');
            try {
                const account = this.web3.eth.accounts.privateKeyToAccount('0x' + key);
                const balance = await this.web3.eth.getBalance(account.address);
                if (parseInt(balance) > 0) {
                    this.foundWallets.push({
                        address: account.address,
                        balance: this.web3.utils.fromWei(balance, 'ether'),
                        privateKey: key
                    });
                }
            } catch (error) {
                console.error('Error processing key:', key, error);
            }
            this.currentKey++;
            this.totalScanned++;
        }

        return this.foundWallets;
    }
}

app.post('/scan', async (req, res) => {
    const { startKey, stopKey } = req.body;
    const scanner = new EthereumScanner(web3);
    const results = await scanner.initialize(startKey, stopKey);
    res.json({ results });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));