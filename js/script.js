
const APIURL = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SERIESAPI = "https://api.themoviedb.org/3/discover/tv?api_key=04c35731a5ee918f014970082a0088b1&language=en-US&sort_by=popularity.desc&page=1&vote_average.gte=7&include_null_first_air_dates=false&with_original_language=en"
const TrendAPI = "https://api.themoviedb.org/3/trending/all/week?api_key=04c35731a5ee918f014970082a0088b1"
const SEARCHAPI = "https://api.themoviedb.org/3/search/multi?api_key=04c35731a5ee918f014970082a0088b1&language=en-US&query=";
let i;
// 04c35731a5ee918f014970082a0088b1

window.addEventListener('load', () => {
    const app = $('#main');
  
    const defaultTemplate = Handlebars.compile($('#trending-template').html());
    const moviesTemplate = Handlebars.compile($('#movies-template').html());
    const tvTemplate = Handlebars.compile($('#tv-template').html());

    const form = document.getElementById("form");
    const search = document.getElementById("search");

    const router = new Router({
      mode:'hash',
      root:'index.html',
      page404: (path) => {
        const html = defaultTemplate();
        app.html(html);
        getTrending(TrendAPI)
      }
    });
  
    router.add('/Movies', async () => {
        html = moviesTemplate();
        app.html(html);
        getMovies(APIURL);
    });

    router.add('/TV', async () => {
        html = tvTemplate();
        app.html(html);
        getTV(SERIESAPI);
      });

    router.add('/home', async () => {
        html = defaultTemplate();
        app.html(html);
        getTrending(TrendAPI);
    });
  
    router.addUriListener();
  
    $('a').on('click', (event) => {
      event.preventDefault();
      const target = $(event.target);
      const href = target.attr('href');
      const path = href.substring(href.lastIndexOf('/'));
      router.navigateTo(path);
    });
  
    router.navigateTo('/home');
  });
  

async function getMovies(url) {
    const resp = await fetch(url);
    const respData = await resp.json();

    showMovies(respData.results);
};

async function getReviews(url, movieId) {
    const resp = await fetch(url);
    const respData = await resp.json();

    Reviews(respData.results, movieId);
};

async function getVideos(url, movieId) {
    
    let resp = await fetch(url);

    if (!resp.ok){
        resp = await fetch(`https://api.themoviedb.org/3/tv/${movieId}/videos?api_key=04c35731a5ee918f014970082a0088b1&language=en-US`);
    }

    const respData = await resp.json();

    Videos(respData.results, movieId);

};

async function getTV(url) {
    const resp = await fetch(url);
    const respData = await resp.json();

    showTV(respData.results);
};

async function getTrending(url) {
    const resp = await fetch(url);
    const respData = await resp.json();

    showTrending(respData.results);
};

function getClassByRate(vote) {
    if (vote >= 7.5) {
        return "green";
    }else if (vote >=5) {
        return "orange";
    }else {
        return "red";
    }
};

function showTrending(trending) {
    main.innerHTML = "";

    se.innerHTML = "";

    const searchItems = document.createElement("div");
        searchItems.classList.add("searching");

        searchItems.innerHTML = `
        <form id="form">
            <input type="text" id="search" placeholder="search" class="search" />
        </form>
        `;
        se.appendChild(searchItems);

    trending.forEach((tv) => {
        let {poster_path, name, vote_average, overview, title, id} = tv;

        if(poster_path != undefined){
            const tvEl = document.createElement("div");
        tvEl.classList.add("search-movie");
        
        if (name == undefined){
            name = title
        }
        vote_average = Math.round(vote_average * 10) / 10

        tvEl.innerHTML = `

        <div class="searchImage">
            <img src="${IMGPATH + poster_path}" alt="${name}"/>
        </div>

        <div class="overview-side">
        <div class="search-movie-info">
                <h3>${name}</h3>
                <span class="${getClassByRate(vote_average)}">${vote_average}</span>
            </div>
            <button type="button" class="collapsible">Description</button>
            <div class="content">
                ${overview}
            </div>
            <button type="button" class="collapsible" id="videos" data-Bid="${id}">Trailers & Clips</button>
            
            <div id="videoContent" class="content"> 
                <div id="videoContent-${id}"> 
                    <p> Coming soon </p>
                </div>
            </div>
            
           
        </div>
            `;

        main.appendChild(tvEl);
        }
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const searchTerms = search.value;
        if(searchTerms) {
            getTrending(SEARCHAPI + searchTerms);
            search.value = "";
        }
    });

    var coll = document.getElementsByClassName("collapsible");
    var c;
    var content
    for (c = 0; c < coll.length; c++) {
      coll[c].addEventListener("click", function() {
        this.classList.toggle("active");
        content = this.nextElementSibling;
        if (content.style.maxHeight){
          content.style.maxHeight = null;
        } else {
          content.style.maxHeight = "280px";
        } 
      });
    }

    $(document).on('click','#videos',function(){
        if (content.style.maxHeight){
            i = this.dataset.bid;
            getVideos(`https://api.themoviedb.org/3/movie/${i}/videos?api_key=04c35731a5ee918f014970082a0088b1&language=en-US`, i);    
        }        
    })

};

function showTV(tvShows) {
    main.innerHTML = "";
    se.innerHTML = "<h1>Trending TV </h1>";

    tvShows.forEach((tv) => {
        const {poster_path, name, vote_average, overview, id} = tv;

        const tvEl = document.createElement("div");
        tvEl.classList.add("movie");

        tvEl.innerHTML = `
        <div class="myImage">
            <img src="${IMGPATH + poster_path}" alt="${name}"/>
            <div class="overview">
                <h3>${name}: </h3>
                    ${overview}
            </div>
            </div>
            <div class="movie-info">
                <a id="myBtn" data-Bid="${id}"> <h3>${name}</h3> </a> 
                    <span class="${getClassByRate(vote_average)}">${vote_average}</span>

            </div>
            <div class="review-details">
            <!-- The Modal -->
                <div id="myModal" data-Mid="${id}" class="modal">
                <div id= "comments">
                </div> 
        </div>
            `;

        main.appendChild(tvEl);
    });

    // Get the modal
    var tvModal;
            
    // When the user clicks the button, open the modal 

    $(document).on('click','#myBtn',function(){
        i = this.dataset.bid;
        getReviews(`https://api.themoviedb.org/3/tv/${i}/reviews?api_key=04c35731a5ee918f014970082a0088b1&page=1`, i)
        tvModal = document.querySelector(`[data-Mid='${i}']`);
        tvModal.style.display = "block";
        
    })
};

function showMovies(movies) {
    main.innerHTML = "";
    se.innerHTML = "<h1> Trending Movies </h1>";
    btnId = 0;

    movies.forEach((movie) => {
        const {poster_path, title, vote_average, overview, id} = movie;
        // getReviews(`https://api.themoviedb.org/3/movie/${id}/reviews?api_key=04c35731a5ee918f014970082a0088b1&page=1`)
        const movieEl = document.createElement("div");
        movieEl.classList.add("movie");

        movieEl.innerHTML = `
        <div class="myImage">
            <img src="${IMGPATH + poster_path}" alt="${title}"/>
            <div class="overview">
            <h3>${title}: </h3>
                ${overview}
            </div>
            </div>
            <div class="movie-info">
            <a id="myBtn" data-Bid="${id}"> <h3>${title}</h3> </a> 
                <span class="${getClassByRate(vote_average)}">${vote_average}</span>
    
            </div>
            <div class="review-details">
            <!-- The Modal -->
                <div id="myModal" data-Mid="${id}" class="modal">
                <div id= "comments">
                </div> 
            </div>
            `;
        main.appendChild(movieEl);
    });

        // Get the modal
        var modal;
            
        // When the user clicks the button, open the modal 

        $(document).on('click','#myBtn',function(){
            i = this.dataset.bid;
            getReviews(`https://api.themoviedb.org/3/movie/${i}/reviews?api_key=04c35731a5ee918f014970082a0088b1&page=1`, i)
            modal = document.querySelector(`[data-Mid='${i}']`);
            modal.style.display = "block";
            
        })
};

function Reviews(moviesReviews, movieId) {
    comments.innerHTML = "";
    const movieRl = document.querySelector(`[data-Mid='${i}']`);
    if (moviesReviews.length == 0){
        
        movieRl.innerHTML = `
        <!-- Modal content -->
                <div class="modal-content">
                <div class="modal-header">
                <p> No Reviews yet <span class="close">&times;</span></p>
        </div>                    
            `;
    }
    else{
        moviesReviews.forEach((review) => {
            const {author, content} = review;
            movieRl.innerHTML = `
            <!-- Modal content -->
                    <div class="modal-content">
                    <div class="modal-header">
                    <p> Author: ${author} <span class="close">&times;</span></p>
                        </div>
                        <div class="modal-body">
                        <p>${content}</p>
                        </div>
                    </div> 
                `;
        // comments.appendChild(movieRl);        
        });
    }
    
    
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];


    var modal = document.querySelector(`[data-Mid='${movieId}']`);
    modal.style.display = "block";

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
};


function Videos(moviesClips, movieId) {
    videoContent.innerHTML = "";
    console.log(moviesClips);
    const videoEL = document.querySelector(`#videoContent-${movieId}`);
    if (moviesClips == undefined){
        videoEL.innerHTML = `
        <div>
            <p>No Clips available </p>
        </div>                    
            `;
    }
    else{
        moviesClips.forEach((review) => {
            const {name, key} = review;
            videoEL.innerHTML = `
            <iframe width="250" height="250" src="https://www.youtube.com/embed/${key}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            
            <div>
                ${name}
            </div>
                `;
            // videoContent.appendChild(videoEL);        
        });
    }
};