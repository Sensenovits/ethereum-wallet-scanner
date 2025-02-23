# Ethereum Wallet Scanner

## Introduction
The Ethereum Wallet Scanner is a web application designed to scan Ethereum private keys within a specified range and check their balances. It uses a backend server to interact with the Ethereum blockchain via the ethers.js library and a web worker to handle the scanning process in parallel.

## Features
- Sequential and random scanning of Ethereum private keys.
- Check wallet balances using ethers.js.
- Display results in a user-friendly interface.
- Error handling and progress tracking.
- Backend server integration for balance checking.

## Prerequisites
- Node.js (v14 or later)
- npm (v6 or later)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/ethereum-wallet-scanner.git
cd ethereum-wallet-scanner
```

### 2. Install Dependencies
Navigate to the project directory and install the necessary dependencies for both the frontend and backend.
```bash
# Install backend dependencies
cd backend
npm install
```

### 3. Configure the Backend
Open the `backend/server.js` file and replace the placeholder with your Alchemy API key or any other Ethereum provider API key.
```javascript
const provider = new ethers.providers.JsonRpcProvider('https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY');
```

### 4. Start the Backend Server
Run the backend server using the following command:
```bash
node server.js
```
The backend server will start on port 3000 by default.

### 5. Configure the Frontend
Ensure the `backendURL` in the `index.html` file is set to the correct URL of your backend server.
```javascript
const config = {
    useMockAPI: false,
    backendURL: 'http://localhost:3000/scan'
};
```

### 6. Run the Frontend
Simply open the `index.html` file in a web browser to start using the Ethereum Wallet Scanner.

## Folder Structure
```
ethereum-wallet-scanner/
├── backend/
│   ├── node_modules/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── index.html
│   └── worker.js
└── README.md
```

## Backend Details
The backend server is built using Express.js and ethers.js. It exposes a single endpoint `/scan` that accepts a private key and returns the associated Ethereum address and balance.

### Endpoint
- `GET /scan?privateKey=YOUR_PRIVATE_KEY`
  - **Parameters**: `privateKey` - The Ethereum private key to scan.
  - **Response**: JSON object containing the address and balance.

### Example Request
```bash
curl "http://localhost:3000/scan?privateKey=YOUR_PRIVATE_KEY"
```

## Frontend Details
The frontend consists of an HTML file (`index.html`) and a web worker (`worker.js`). The frontend initializes the scanning process and displays the results.

### Scanning Modes
- **Sequential Scan**: Scans keys sequentially from the start key to the stop key.
- **Random Scan**: Scans keys randomly within the specified range.

### Error Handling
Errors encountered during the scanning process are displayed in the UI.

## License
This project is licensed under the MIT License.

## Acknowledgements
- [ethers.js](https://github.com/ethers-io/ethers.js/)
- [Bootstrap](https://getbootstrap.com/)
- [Alchemy](https://www.alchemy.com/)

## Contributing
Contributions are welcome! Please submit a pull request or open an issue to discuss any changes.

## Contact
For any questions or support, please contact Sensenovits at sensenovits@example.com.
