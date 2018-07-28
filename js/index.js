let page = 0;  //page is set to Zero
let count = 0; // count is set to Zer0

(function () { // On windows load this function is called.
    $('.loader').hide(); // div used as spinning loader icon is hidden on page load
    const form = document.querySelector('#search-form'); // form element used for the search input is saved as 'form'
    const searchField = document.querySelector('#search-keyword'); // input field element that will contain the search keyword is saved as 'searchField'
    let searchedForText; //a variable is declared
    const responseContainer = document.querySelector('#response-container'); // div where results from the ajax call will be displayed is declared

    form.addEventListener('submit', function (e) { // click event on the submit button calls this function
        page = 0; // page number is reset back to zero
        count = 0; // count number is reset back to zero
        e.preventDefault(); // click buton's default action is blocked
        responseContainer.innerHTML = '';
        searchedForText = searchField.value; // input value which is the search keyword is saved in the variable declared at line 8
        getData(); // function containing the ajax call (starting at line 20) is called when button is clicked
    });

    function getData() { //function containing the ajax
        ++page; // page is increased by 1
        var url = 'https://newsapi.org/v2/everything?sources=hacker-news&q=' + `${searchedForText}` + '&apiKey=816734caecd74eb08f84b8c38cf27f6c&page=' + page; //keyword value from  line 16 and increased page number from line 21 is added to the ajax url string.
            $.ajax({        // Ajax request call is made to HackerNews REST API
                url: url,
                method: 'GET',
            }).done(addArticles).fail(requestError);
        }

    function addArticles(data) { // function that manipulates response fron Ajax call
        let htmlContent = '';  // varable declared and value saved as empty string

        if (data && data.articles && data.articles.length > 1) { // if data is recieved from the ajax call and the response is more than 1
            const results = data.articles; // save the data array in a variable 'results'

            htmlContent = '<ul>' + results.map(news => `<li class="article"> <h2><a href="${news.url}">${news.title}</a></h2><sub>Published on: ${(new Date(news.publishedAt)).toUTCString()}</sub><br><p>${news.description}</p><p align="right">Source: ${news.source.name} </p></li>`).join('') + '</ul>'; // Ajax response maps 'results' and it is formatted to a readable thumbnail format and stored in the variable 'htmlContent'.
            count++; // count is increased each time formated response is captured and saved in the variable 'htmlContent'
        } else { // else if no more data is recieved
            htmlContent = `<div class="error-no-articles">No more articles available</div>`; // error message is saved in the variable 'htmlContent'
        }
        responseContainer.insertAdjacentHTML('beforeend', '<h3>Page: <span  id="count">' + count + '</Span></h3>'); //count is added to the DOM as the result's page number
        responseContainer.insertAdjacentHTML('beforeend', htmlContent); // formated ajax response from line 37 is added to the DOM
    }
    function requestError(e, part) { //function that handles error when there is no response from the REST API
        console.log(e);
        responseContainer.insertAdjacentHTML('beforeend', `<p class="network-warning error-${part}">Oh no! There was an error making a request from HackerNews,  Please check you internet connection.</p>`);
    }

    $(window).scroll(function () { // funstion that handles "Infinite Scroll"
        console.log(count);
        console.log(page);
        if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {// checks is the user has scrolled to the bottom of the page
            $('.loader').delay(1000).fadeIn(500); //spinning loader is displayed below the page
            if (count === page) { // checks is the page number is the same as the number of request that has been made so far from the HackerNews REST API
                $('#response-container').append(getData());// if yes, another Ajax request is made again and the formatted result is appended to the DOM and user can continue scrolling
            }
        }
    });
})();
