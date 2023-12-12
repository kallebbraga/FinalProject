const apiKey = ' U3EOXMULW4IQ93VO';
const stockSymbol = 'GAME';

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

            const globalQuote = data['Global Quote'];
            const stockPriceValue = globalQuote && globalQuote['05. price'];

            if (stockPriceValue !== undefined) {
                const stockPrice = parseFloat(stockPriceValue);
                stockPriceElement.textContent = `Stock Price: $${stockPrice.toFixed(2)}`;

                if (stockPrice > 2) {
                    hideNotification();
                } else {
                    showNotification('Go buy more stock!');
                }

                updateCounter++;
                updateCounterDisplay();

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
    notificationElement.style.display = 'block';
    setTimeout(() => {
        hideNotification();
    }, 5000);
}

function hideNotification() {
    notificationElement.style.display = 'none';
}

yahooButton.addEventListener('click', () => {
    window.open('https://finance.yahoo.com/quote/GAME', '_blank');
});

fetchStockPrice();

// Fetch stock price every 10 seconds
setInterval(fetchStockPrice, 10000);
