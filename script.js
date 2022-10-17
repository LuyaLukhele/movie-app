
const APIURL = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SERIESAPI = "https://api.themoviedb.org/3/tv/popular?api_key=04c35731a5ee918f014970082a0088b1&page=1"
const TrendAPI = "https://api.themoviedb.org/3/trending/all/week?api_key=04c35731a5ee918f014970082a0088b1"

window.addEventListener('load', () => {
    const app = $('#main');
  
    const defaultTemplate = Handlebars.compile($('#trending-template').html());
    const moviesTemplate = Handlebars.compile($('#movies-template').html());
    const tvTemplate = Handlebars.compile($('#tv-template').html());


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

    trending.forEach((tv) => {
        let {poster_path, name, vote_average, overview, title} = tv;

        const tvEl = document.createElement("div");
        tvEl.classList.add("movie");
        
        if (name == undefined){
            name = title
        }
        vote_average = Math.round(vote_average * 10) / 10

        tvEl.innerHTML = `
            <img src="${IMGPATH + poster_path}" alt="${name}"/>
            <div class="movie-info">
                
                <h3>${name}</h3>
                <span class="${getClassByRate(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
            <h3>${name}: </h3>
                ${overview}
            </div>
            `;

        main.appendChild(tvEl);
    });
};


function showTV(tvShows) {
    main.innerHTML = "";

    tvShows.forEach((tv) => {
        const {poster_path, name, vote_average, overview} = tv;

        const tvEl = document.createElement("div");
        tvEl.classList.add("movie");

        tvEl.innerHTML = `
            <img src="${IMGPATH + poster_path}" alt="${name}"/>
            <div class="movie-info">
                <h3>${name}</h3>
                <span class="${getClassByRate(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
            <h3>${name}: </h3>
                ${overview}
            </div>
            `;

        main.appendChild(tvEl);
    });
};

  
function showMovies(movies) {
    main.innerHTML = "";

    movies.forEach((movie) => {
        const {poster_path, title, vote_average, overview} = movie;

        const movieEl = document.createElement("div");
        movieEl.classList.add("movie");

        movieEl.innerHTML = `
            <img src="${IMGPATH + poster_path}" alt="${title}"/>
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
            <h3>${title}: </h3>
                ${overview}
            </div>
            `;

        main.appendChild(movieEl);
    });
};




function showMovies(movies) {
    main.innerHTML = "";

    movies.forEach((movie) => {
        const {poster_path, title, vote_average, overview} = movie;

        const movieEl = document.createElement("div");
        movieEl.classList.add("movie");

        movieEl.innerHTML = `
            <img src="${IMGPATH + poster_path}" alt="${title}"/>
            <div class="movie-info">
                <h3><a href='#'>${title}</a></h3>
                <span class="${getClassByRate(vote_average)}">${vote_average}</span>
            </div>
            `;

        main.appendChild(movieEl);
    });
};