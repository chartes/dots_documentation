/**
 * Custom JS for the MKdocs documentation.
 */

// Listen for the DOMContentLoaded event and hide all card-body elements.
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('.card-body').forEach(function (body) {
        body.style.display = 'none';
    });
    document.querySelectorAll('.collapse-card').forEach(function (collapse) {
        fetchDataForCollapse(collapse);
    });
});


// Functions

/**
 * Toggle collapse for the card element.
 * @param headerElement
 * @returns {Promise<void>}
 */
function toggleCollapse(headerElement) {
    const cardBody = headerElement.nextElementSibling;
    const chevron = headerElement.querySelector('.chevron');
    if (cardBody.style.display === "none" || cardBody.style.display === '') {
        cardBody.style.display = "block";
        chevron.classList.add('rotated');
    } else {
        cardBody.style.display = "none";
        chevron.classList.remove('rotated');
    }
}

/**
 * Fetch data for the collapse element and highlight response from API.
 * @param collapse
 * @returns {Promise<void>}
 */
function fetchDataForCollapse(collapse) {
    const url = collapse.getAttribute('data-url');
    const cardBody = collapse.querySelector('.card-body');
    if (url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                cardBody.innerHTML = `<pre><code class="json">${JSON.stringify(data, null, 2)}</code></pre>`;
                hljs.highlightBlock(cardBody.firstChild, {language: 'json'});
                //hljs.highlightAll();
            })
            .catch(error => {
                // fetch xml data
                fetch(url)
                    .then(response => response.text())
                    .then(data => {
                        // parse xml data
                        xml = new DOMParser().parseFromString(data, 'text/xml').documentElement.outerHTML;
                        // highlight xml data
                        cardBody.innerHTML = `<pre><textarea>${xml}</textarea></pre>`;
                        hljs.highlightBlock(cardBody.firstChild, {language: 'xml'});
                    })
                    .catch(error => {
                        console.log(error);
                        cardBody.innerHTML = `<p>Failed to fetch data, retry later.</p>`;
                    });
            });

    }
}



