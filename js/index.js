/* eslint-env jquery */
let page = 0;

(function () {
    $('.loader').hide();
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;
        getData();
        /* $.ajax({
             url: `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=61d4085b01144e2194ac5866d2c36210`,
         }).done(addArticles)
             .fail(function (err) {
                 requestError(err, 'articles');
             });*/
    });

    function getData() {
        page++;
        var url = 'https://newsapi.org/v2/everything?sources=hacker-news&q=' + `${searchedForText}` + '&apiKey=816734caecd74eb08f84b8c38cf27f6c&page=' + page;

        $.ajax({
            url: url,
            method: 'GET',
        }).done(addArticles).fail(function (err) {
            throw err;
        });
    }

    function addArticles(data) {
        let htmlContent = '';

        if (data && data.articles && data.articles.length > 1) {
            const results = data.articles;

            htmlContent = '<ul>' + results.map(news => `<li class="article"> <h2><a href="${news.url}">${news.title}</a></h2><sub>Published on: ${(new Date(news.publishedAt)).toUTCString()}</sub><br><p>${news.description}</p>
            <p align="right">Source: ${news[0]} </p></li>`
            ).join('') + '</ul>';
        } else {
            htmlContent = `<div class="error-no-articles">No articles available</div>`;
        }
        responseContainer.insertAdjacentHTML('beforeend', htmlContent);
    }
    function requestError(e, part) {
        console.log(e);
        responseContainer.insertAdjacentHTML('beforeend', `<p class="network-warning error-${part}">Oh no! There was an error making a request for the ${part}.</p>`);
    }

    $(window).scroll(function () {
        $('.loader').delay(5000).fadeIn(500);
        if ($(window).scrollTop() + $(window).height() === $(document).height()) {
            $('.loader').delay(5000).fadeIn(500);
           // var new_div = '<div class="new_block"><h2>Page ' + page + '</h2></div>';
            //$('#response-container').delay(5000).append(new_div);
            $('#response-container').append(getData());
    }
    });
})();
