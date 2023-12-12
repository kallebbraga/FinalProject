// script.js
const apiKey = 'OXLFREL48LCJ4HK6'; // Replace with your actual Alpha Vantage API key
const stockSymbol = 'GAME';

const stockPriceElement = document.getElementById('stock-price');
const notificationElement = document.getElementById('notification');
const notificationMessageElement = document.getElementById('notification-message');
const closeNotificationButton = document.getElementById('close-notification');
const yahooButton = document.getElementById('yahoo-button');
const updateButton = document.getElementById('update-button');

function fetchStockPrice() {
    fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${apiKey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error fetching stock price. Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const stockQuote = data['Global Quote'];
            const stockPriceValue = parseFloat(stockQuote?.['05. price']);

            if (!isNaN(stockPriceValue) && stockPriceValue !== null) {
                stockPriceElement.textContent = `Stock Price: $${stockPriceValue.toFixed(2)}`;

                if (stockPriceValue > 2) {
                    hideNotification();
                } else {
                    showNotification('Go buy more stock!');
                }
            } else {
                throw new Error('Invalid or missing stock price value from API');
            }
        })
        .catch(error => {
            console.error(error);
            showDefaultPrice();
        });
}

function showNotification(message) {
    notificationMessageElement.textContent = message;
    notificationElement.classList.remove('hidden-notification');
    setTimeout(() => {
        hideNotification();
    }, 5000);
}

function hideNotification() {
    notificationElement.classList.add('hidden-notification');
}

function showDefaultPrice() {
    stockPriceElement.textContent = 'Stock Price: $1.67';
    showNotification('Buy more stock!');
}

function showDefaultPrice() {
    stockPriceElement.textContent = 'Stock Price: $1.67';
    showNotification('Stock price not available. Buy more stock!');
}

yahooButton.addEventListener('click', () => {
    window.open(`https://finance.yahoo.com/quote/${stockSymbol}`, '_blank');
});

updateButton.addEventListener('click', fetchStockPrice);

closeNotificationButton.addEventListener('click', hideNotification);

// Initial fetch
fetchStockPrice();
