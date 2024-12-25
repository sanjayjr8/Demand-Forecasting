let globalData;
const socket = io(); // New: Connect to the WebSocket

document.getElementById('uploadForm').onsubmit = async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('fileInput');
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    const response = await fetch('/upload', {
        method: 'POST',
        body: formData
    });
    const data = await response.json();
    displayResults(data);
};

function displayResults(data) {
    globalData = data; // Store the data globally
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `<h2>Total Stock: ${data.totalStock}</h2>
                            <h3>Average Stock: ${data.averageStock}</h3>`;
    
    if (data.lowStockItems.length > 0) {
        resultsDiv.innerHTML += `<h3>Low Stock Items:</h3><ul>`;
        data.lowStockItems.forEach(item => {
            resultsDiv.innerHTML += `<li>${item.item}: ${item.stock}</li>`;
        });
        resultsDiv.innerHTML += `</ul>`;
    } else {
        resultsDiv.innerHTML += `<h3>No low stock items.</h3>`;
    }

    const ctx = document.getElementById('stockChart').getContext('2d');
    const chartData = {
        labels: data.stockLevels.map(item => item.item),
        datasets: [{
            label: 'Stock Levels',
            data: data.stockLevels.map(item => item.stock),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


function downloadCSV(data) {
    const csvContent = "data:text/csv;charset=utf-8," 
        + data.map(e => e.item + "," + e.stock).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "analytics.csv");
    document.body.appendChild(link);
    link.click();
}

document.getElementById('downloadBtn').onclick = () => {
    const dataToDownload = data.stockLevels.map(item => ({
        item: item.item,
        stock: item.stock,
    }));
    downloadCSV(dataToDownload);
};


// New: Listen for real-time low-stock alerts from the server
socket.on('lowStockAlert', (lowStockItems) => {
    alert('Low stock alert! Check your inventory.');
    displayLowStockItems(lowStockItems); // Show the low stock items in the UI
});

// New: Function to display the low stock items dynamically
function displayLowStockItems(lowStockItems) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML += `<h3>Real-time Low Stock Items:</h3><ul>`;
    lowStockItems.forEach(item => {
        resultsDiv.innerHTML += `<li>${item.item}: ${item.stock}</li>`;
    });
    resultsDiv.innerHTML += `</ul>`;
}
