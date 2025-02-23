self.addEventListener('message', async function (e) {
    const { backendURL, startKey, stopKey, mode } = e.data;

    function getRandomKeyInRange(startKey, stopKey) {
        const range = stopKey - startKey;
        const randomOffset = BigInt(Math.floor(Math.random() * Number(range)));
        return startKey + randomOffset;
    }

    async function scanKey(key) {
        const keyHex = key.toString(16).padStart(64, '0');
        const url = `${backendURL}?privateKey=${keyHex}`;

        try {
            console.log(`Fetching: ${url}`); // Log the URL

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                    // Add other headers if needed (e.g., 'Authorization')
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`HTTP error! status: ${response.status}, text: ${errorText}`);
                self.postMessage({ error: `HTTP error! status: ${response.status}, text: ${errorText}` }); // Send detailed error
                return null;
            }

            const data = await response.json();
            return { ...data, privateKey: keyHex }; // Return the privateKey also

        } catch (error) {
            console.error("Failed to scan key:", error);
            self.postMessage({ error: `Failed to scan key ${keyHex}: ${error.message}` }); // Send error to main thread
            return null; // Indicate failure
        }
    }

    let currentKey = mode === 'random' ? getRandomKeyInRange(startKey, stopKey) : startKey;
    let scannedCount = 0;
    const maxScans = 10000; // Limit the number of scans per worker

    while (scannedCount < maxScans) {
        if (mode === 'sequential') {
            if (currentKey > stopKey) break;
        }
        const result = await scanKey(currentKey);

        if (result === null) { // Check for null to handle errors
            break; // Exit the loop if scanKey failed
        }

        if (result.error) {
            self.postMessage({ error: result.error });
        } else {
            self.postMessage(result);
        }

        if (mode === 'sequential') {
            currentKey = currentKey + 1n;
        } else {
            currentKey = getRandomKeyInRange(startKey, stopKey);
        }
        scannedCount++;
    }
    self.close();
});