


async function searchShows(query) {
  //get data from api
  const APIdata = await axios.get(`http://api.tvmaze.com/search/shows?q=<${query}>`);
  // emtpty array to store objects
  const resultArray = [];
  // loop through and transform data pulled from the api to needed object structure
  for (let data of APIdata.data) {
    resultArray.push({
      id: data.show.id,
      name: data.show.name,
      summary: data.show.summary,
      image: data.show.image
    });
  };
  // check if obj contians an image url. If not, display a default image
  for (let obj of resultArray) {
    if (obj.image === null) {
      obj.image = 'https://static.tvmaze.com/images/no-img/no-img-portrait-text.png';
    }
  }
  // return the array of show objects
  return resultArray;
}






function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
        <div class="card" data-show-id="${show.id}">
          <img class="card-img-top" src="${show.image.original}">
          <div class="card-body">
          <h5 class="card-title">${show.name}</h5>
          <p class="card-text">${show.summary}</p>
          <button type="button" class="btn btn-primary btn-sm epiBtn">Episodes</button>
        </div>
      </div>
    </div>
      `);

    $showsList.append($item);

  }
};

//handle episodes button click
$("#shows-list").on("click", ".epiBtn", async function (e) {
  e.preventDefault();
  let episodesArr = await getEpisodes(e.target.offsetParent.attributes[1].value);
  populateEpisodes(episodesArr);
  $("#episodes-area").show();
})

//handle query submit
$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  //grab episode info from api
  let response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  //using .map to transform data from api to object structre
  let episodes = response.data.map(episode => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number,
  }));
  return episodes;
}




function populateEpisodes(episodeArr) {
  //grabbing episode list element
  const ul = document.getElementById("episodes-list");
  //loop through the provided array of episode projects
  for (let i = 0; i < episodeArr.length; i++) {
    // create ne li element
    const newLi = document.createElement("li");
    //set inner text by pulling data from each object in the provided array of objects.
    newLi.innerText = `${episodeArr[i].name} - Season: ${episodeArr[i].season}, Number: ${episodeArr[i].number}`;
    // append new li to the episodes list
    ul.append(newLi);
  }
}


