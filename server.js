const express = require('express');
const cors = require('cors');
const { ethers } = require("ethers"); // npm install ethers
const app = express();
const port = 3000;

app.use(cors()); // Enable CORS for all origins (for testing - REMOVE FOR PRODUCTION)
app.use(express.json()); // Enable parsing of JSON bodies

app.get('/scan', async (req, res) => {
    const privateKey = req.query.privateKey;

    if (!privateKey) {
        return res.status(400).json({ error: 'Private key is required' });
    }

    try {
        // 1. Derive the address from the private key
        const wallet = new ethers.Wallet(privateKey);
        const address = wallet.address;

        // 2. Connect to an Ethereum provider (e.g., Infura, Alchemy)
        const provider = new ethers.providers.JsonRpcProvider('https://eth-mainnet.g.alchemy.com/v2/8UTd4jIsSuaSFJJzizsQBrS7wG1JiSDE'); // Replace with your API key

        // 3. Get the balance
        const balance = await provider.getBalance(address);
        const balanceInEth = ethers.utils.formatEther(balance);

        // 4. Send the response
        res.json({ address: address, balance: balanceInEth });

    } catch (error) {
        console.error("Error scanning key:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});