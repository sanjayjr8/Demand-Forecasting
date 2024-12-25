const { Server } = require('socket.io'); // For WebSocket integration
const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const http = require('http'); // For Socket.io

// Initialize express app
const app = express();

// Path to store historical data
const historicalDataPath = path.join(__dirname, 'historicalData.json');

// Create server for Socket.io
const server = http.createServer(app);

// Initialize WebSocket
const io = new Server(server);

const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));
app.use(express.json());

// Route for uploading CSV
app.post('/upload', upload.single('file'), (req, res) => {
    const filePath = req.file.path;
    const results = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            const analytics = generateAnalytics(results);
            const lowStockItems = checkLowStock(results, 100);

             // Emit low stock alert to all connected clients if low stock items are found
             if (lowStockItems.length > 0) {
                io.emit('lowStockAlert', lowStockItems); // Emit low stock alert
            }

            saveHistoricalData(analytics.stockLevels); // Save stock data to JSON

            saveHistoricalData(analytics.stockLevels); // Save stock data to JSON

            res.json({ ...analytics, lowStockItems });
            fs.unlinkSync(filePath);
        });
});

// Function to save stock data to historicalData.json
function saveHistoricalData(stockLevels) {
    let historicalData = [];

    // Check if the file already exists, and load previous data
    if (fs.existsSync(historicalDataPath)) {
        const rawData = fs.readFileSync(historicalDataPath);
        historicalData = JSON.parse(rawData); // Parse the existing data
    }

    // Get current date and time for each entry
    const currentDate = new Date().toISOString();

    // Create a new entry with the current stock levels and the timestamp
    const newEntry = {
        date: currentDate,
        stockLevels
    };

    // Add the new entry to the historical data
    historicalData.push(newEntry);

    // Write the updated historical data back to the file
    fs.writeFileSync(historicalDataPath, JSON.stringify(historicalData, null, 2)); // Pretty-print the JSON
}

// Function to generate analytics
function generateAnalytics(data) {
    const totalStock = data.reduce((sum, item) => sum + parseInt(item.stock, 10), 0);
    const averageStock = totalStock / data.length;

    const stockLevels = data.map(item => ({
        item: item.item,
        stock: parseInt(item.stock, 10),
    }));

    const stockTurnover = calculateTurnover(data);

    return {
        totalStock,
        averageStock,
        stockLevels,
        stockTurnover,
    };
}

// Mock function to calculate stock turnover
function calculateTurnover(data) {
    return data.map(item => ({
        item: item.item,
        turnover: Math.random() * 100, // Mock turnover data
    }));
}

// Function to check low stock items
function checkLowStock(data, threshold) {
    return data.filter(item => parseInt(item.stock, 10) < threshold);
}

// Route to serve historical data
app.get('/historicalData', (req, res) => {
    // Check if historicalData.json exists
    if (fs.existsSync(historicalDataPath)) {
        const rawData = fs.readFileSync(historicalDataPath); // Read the file
        const historicalData = JSON.parse(rawData); // Parse the JSON data
        res.json(historicalData); // Send the data back to the client
    } else {
        res.json([]); // If no data, return an empty array
    }
});

// Start the server on port 3000
const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
