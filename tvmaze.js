"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $episodesList = $("#episodesList");
const $searchForm = $("#searchForm");

const missing_url_image = "https://tinyurl.com/tv-missing";


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const response = await axios.get("http://api.tvmaze.com/search/shows", {params: {q: term}}); // retrieves shows based on search input

  return response.data.map(info => { // array method that goes through every array and retrieves id, name, summary, and image. If no image, missing_url_image is inputted
    const show = info.show
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image ? show.image.medium : missing_url_image
    }
  })
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) { // adds HTML elements based on the information that we are retrieving from the API
  $showsList.empty(); // clears the list of shows in the beginning

  for (let show of shows) { // iterates through all of the shows that populate based on the show
    const $show = $( // adds class of Show and id of the show.id to div element. Episodes button has class of Show-getEpisodes
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${show.image}"
              alt="${show.name}"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes"> 
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show); // appends the shows searched to the show list to be displayed
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() { // executes function to search for shows based on the search input value
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) { // exectutes functions when search button is clicked
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {  // retrieves episodes in each show
  const response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);

  return response.data.map(info => { // iterates through all of episodes in array and retrieves id, name, season, and number of episode
    return {
      id: info.id,
      name: info.name,
      season: info.season,
      number: info.number,
    }
  })
}

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) { // displays list of episodes of each show
  $episodesList.empty();
  for (let episode of episodes) {
    const $eachEpisode = $(
      `<li>${episode.name}(season ${episode.season}, episode ${episode.number})</li>`
    )
    $episodesList.append($eachEpisode);
  }
  $episodesArea.show(); // allows the div of episodeArea to display the content within
}

async function getEpisodesAndDisplay(evt) {
  const showId = $(evt.target).closest(".Show").data("show-id"); // retrives the div associated with the show that has been populated with the specific ID

  const episodes = await getEpisodesOfShow(showId); // retrieves episodes for each show from API
  populateEpisodes(episodes);
}

$showsList.on("click", ".Show-getEpisodes", getEpisodesAndDisplay); // this is run when the episode button is clicked  

