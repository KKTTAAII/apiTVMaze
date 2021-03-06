/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  const response = await axios.get(
    `https://api.tvmaze.com/search/shows?q=${query}`
  );
  const allSearchedShows = response.data;
  return allSearchedShows;
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let showImage = "";
    if (show.show.image !== null) {
      showImage = show.show.image.original;
    } else {
      showImage =
        "https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300";
    }

    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.show.id}">
         <div class="card" data-show-id="${show.show.id}">
           <div class="card-body">
             <img class="card-img-top" src="${showImage}">
             <h5 class="card-title">${show.show.name}</h5>
             <p class="card-text">${show.show.summary}</p>
             <button type="button" class="btn btn-outline-info epButton">Episodes</button>
           </div>
         </div>
       </div>
      `
    );

    $showsList.append($item);
  }
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let input = document.querySelector("input");
  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);
  populateShows(shows);

  input.value = "";
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
  // TODO: return array-of-episode-info, as described in docstring above
  const response = await axios.get(
    `https://api.tvmaze.com/shows/${id}/episodes`
  );
  const allEpisodes = response.data;
  return allEpisodes;
}

function populateEpisodes(allEps) {
  const $episodeList = $("#episodes-list");
  $episodeList.empty();

  for (let episode of allEps) {
    let $episode = $(
      `<list class="list-group-item">${episode.name}(season ${episode.season}, number ${episode.number})</list>`
    );

    $episodeList.append($episode);
  }
}

$("#shows-list").on("click", ".epButton", async function (evt) {
  $("#episodes-area").show();

  let parentOfParentEleOfEpBtn = evt.target.parentElement.parentElement;
  let id = parentOfParentEleOfEpBtn.dataset.showId;

  let episodes = await getEpisodes(id);
  populateEpisodes(episodes);
});
