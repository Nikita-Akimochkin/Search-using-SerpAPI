/* This code processes the submission of the search form, preventing the page from reloading, 
   retrieves the query entered by the user and passes it to the function that performs the search. */
   document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    let query = document.getElementById('searchQuery').value;
    fetchResults(query);
});

/* This function sends a request to the SerpAPI with the passed search
   query, retrieves the results in JSON format, and passes them to be displayed. */
function fetchResults(query) {
    const apiKey = '447619c0f4d5f671170aff8ffd5b974411d3e8468fcf129e95b370d8284ea3ba'; // Your API key
    const url = `https://serpapi.com/search.json?api_key=${apiKey}&q=${encodeURIComponent(query)}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            displayResults(data.organic_results);
        })
        .catch(error => console.error('Data retrieval error:', error));
}

/* This function displays search results on the page, creates elements with headings, 
   links and descriptions, and saves the results in JSON format if found. */
function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (results && results.length > 0) {
        results.forEach(result => {
            const div = document.createElement('div');
            const title = result.title || "Untitled";
            const link = result.link || "#";
            const snippet = result.snippet || "No description.";

            div.innerHTML = `<h3><a href="${link}" target="_blank">${title}</a></h3><p>${snippet}</p>`;
            resultsDiv.appendChild(div)
        });
        saveResultsAsJSON(results);
    } else {
        resultsDiv.innerHTML = '<p>No results found.</p>';
    }
}

/* This function converts search results to JSON format,
   creates a results.json file and starts downloading it to the user's computer. */
function saveResultsAsJSON(results) {
    const dataStr = JSON.stringify(results, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Create <a> element to download the file
    const a = document.createElement("a");
    a.href = url;
    a.download = "results.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}