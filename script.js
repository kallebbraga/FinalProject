const apiKey = '3GSYUIH0HFVSLJGF';
const stockSymbol = 'GAME'; // GameSquare stock symbol

const stockPriceElement = document.getElementById('stock-price');
const updateCounterElement = document.getElementById('update-counter');
const notificationElement = document.getElementById('notification');
const yahooButton = document.getElementById('yahoo-button');

let updateCounter = 0;
const maxUpdatesPerDay = 25;

function updateCounterDisplay() {
    updateCounterElement.textContent = `Updates today: ${updateCounter}`;
}

function fetchStockPrice() {
    // Check if the maximum number of updates per day is reached
    if (updateCounter >= maxUpdatesPerDay) {
        console.log('Maximum updates per day reached. Stopping updates.');
        return;
    }

    fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${apiKey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('API Response:', data);

            if (data['Global Quote'] && data['Global Quote']['05. price']) {
                const stockPrice = parseFloat(data['Global Quote']['05. price']);
                stockPriceElement.textContent = `Stock Price: $${stockPrice.toFixed(2)}`;

                // Check if the stock price is over $2 or under $2
                if (stockPrice > 2) {
                    hideNotification();
                } else {
                    showNotification('Go buy more stock!');
                }

                // Increment the update counter
                updateCounter++;

                // Update the counter display
                updateCounterDisplay();

                // Check if the maximum updates per day is reached after the increment
                if (updateCounter >= maxUpdatesPerDay) {
                    console.log('Maximum updates per day reached. Stopping updates.');
                }
            } else {
                throw new Error('Invalid response format from API');
            }
        })
        .catch(error => {
            console.error('Error fetching stock price:', error);
            stockPriceElement.textContent = 'Error loading stock price';
        });
}

function showNotification(message) {
    notificationElement.textContent = message;
    notificationElement.style.backgroundColor = '#FF5733'; // orange color
    notificationElement.style.display = 'block';
    setTimeout(() => {
        hideNotification();
    }, 5000); // Hide after 5 seconds
}

function hideNotification() {
    notificationElement.style.display = 'none';
}

// Open Yahoo Finance when the button is clicked
yahooButton.addEventListener('click', () => {
    window.open('https://finance.yahoo.com/quote/GAME', '_blank');
});

// Initial fetch
fetchStockPrice();

// Fetch stock price every 5 seconds
//setInterval(fetchStockPrice, 5000);
