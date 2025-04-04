// Wait for the HTML page to finish loading before running the code
document.addEventListener("DOMContentLoaded", async function () {

    // Get the elements from the HTML page
    const quoteText = document.getElementById("quote");           // The element that displays the quote
    const newQuoteBtn = document.getElementById("new-quote");     // The "Get New Quote" button
    const toggleThemeBtn = document.getElementById("toggle-theme"); // The button to toggle dark/light mode

    // Function to fetch and display a daily quote
    async function fetchQuotes() {
        // Fetch the quotes from the local quotes.json file
        const response = await fetch("quotes.json");
        const quotes = await response.json(); // Convert to JSON format (array of quotes)

        // Get today’s date as a string (e.g., "Thu Apr 4 2025")
        const today = new Date().toDateString();

        // Get the date and quote saved from previous use (if any)
        const savedDate = localStorage.getItem("dailyMuseDate");      // Previously saved date
        const savedQuote = localStorage.getItem("dailyMuseQuote");    // Previously saved quote

        let quote; // This will hold the quote we’ll display

        // If the saved date is today and there’s a saved quote, reuse it
        if (savedDate === today && savedQuote) {
            quote = savedQuote; // Use the quote saved earlier today
        } else {
            // If it's a new day or no quote is saved, calculate the day of the year
            const dayOfYear = Math.floor(
                (new Date() - new Date(new Date().getFullYear(), 0, 0)) / 
                (1000 * 60 * 60 * 24) // Convert milliseconds to days
            );

            // Get a quote based on the day of the year (loops if less than 365 quotes)
            const quoteIndex = dayOfYear % quotes.length;
            quote = quotes[quoteIndex]; // Pick the quote

            // Save today’s date and quote in localStorage so we reuse it during the day
            localStorage.setItem("dailyMuseDate", today);
            localStorage.setItem("dailyMuseQuote", quote);
        }

        // Show the quote on the page
        quoteText.innerText = quote;
    }

    // When the "Get New Quote" button is clicked, try to get quote again
    // (But our logic above won’t allow it to change on the same day)
    newQuoteBtn.addEventListener("click", fetchQuotes);

    // Toggle dark/light mode when the theme button is clicked
    toggleThemeBtn.addEventListener("click", function () {
        // Add or remove the dark mode class on the body
        document.body.classList.toggle("dark-mode");

        // Change the button emoji depending on current mode
        toggleThemeBtn.innerText = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
    });

    // Automatically show the quote when the page first loads
    fetchQuotes();
});
