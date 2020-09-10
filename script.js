const main = document.getElementById('root');
let allEpisodes;

function setup() {
  // construct the page only when data arrives (not optimal); 82 - game of thrones
  fetchEpisodesForShow(82).then((data) => {
    allEpisodes = data;

    makeHeader();
    makeFooter();
    makeShowSelector();
    makeSearchBar();
    makeEpisodeSelector();

    makePageForEpisodes(data);
  });
}

function makeHeader() {
  const header = document.createElement('header');
  const title = document.createElement('h1');
  const headerContainer = document.createElement('div');
  const inputs = document.createElement('div');

  title.textContent = 'Your best TV shows';
  header.appendChild(headerContainer);
  headerContainer.appendChild(title);
  headerContainer.appendChild(inputs);
  main.parentElement.insertBefore(header, main);

  title.classList.add('title');
  headerContainer.classList.add('container');
  inputs.classList.add('inputs');
}

function makeShowSelector() {
  let shows;
  fetchAllShows()
    .then((data) => {
      shows = data;
      populateShowsSelector();
    })
    .catch((err) => console.log(err));

  const showsDiv = document.createElement('div');
  const showsSelect = document.createElement('select');
  const option = document.createElement('option');

  showsDiv.classList.add('shows');
  showsSelect.classList.add('shows-select');

  showsDiv.appendChild(showsSelect);
  document.querySelector('.inputs').appendChild(showsDiv);

  // this will be called only when data will arrive
  function populateShowsSelector() {
    shows
      // sort by name
      .sort((a, b) => a.name.localeCompare(b.name))
      // add select option for each show
      .forEach(({ name, id }) => {
        const option = document.createElement('option');
        showsSelect.appendChild(option);

        option.textContent = name;
        option.value = id;

        // select Game Of Thrones (82) on page load / by default
        if (id === 82) {
          option.selected = true;
        }
      });
  }

  showsSelect.addEventListener('input', handleShowSelect);

  function handleShowSelect(event) {
    const showId = event.target.value;
    const info = document.querySelector('.episodes-info');

    // remove data before adding again to avoid duplication
    document.querySelector('.episodes').remove();

    // clear search term
    document.querySelector('.search-input').value = '';

    // display message, that episodes are being fetched
    info.textContent = `Loading episodes for ${
      // get show name by its id
      shows.filter(({ id }) => Number(showId) === id)[0].name
    }`;

    fetchEpisodesForShow(showId)
      .then((data) => {
        // allEpisodes now changes to selected show's episodes
        allEpisodes = data;
        // remove loading info as data was fetched successfully
        info.remove();
        // remove current show's episode selector
        document.querySelector('.select').remove();
        // make episode selector for new show
        makeEpisodeSelector();
        // construct episodes for selected show
        makePageForEpisodes(data);
      })
      .catch((error) => {
        console.log(error);

        // display error message to the user
        info.textContent = "Sorry, can't find any episodes for this show...";
      });
  }
}

function makeSearchBar() {
  const searchBar = document.createElement('div');
  const searchInput = document.createElement('input');

  document.querySelector('.inputs').appendChild(searchBar);
  searchBar.appendChild(searchInput);

  searchBar.classList.add('search');
  searchInput.classList.add('search-input');
  searchInput.placeholder = 'Search...';
  searchInput.type = 'search';

  searchInput.addEventListener('input', handleSearch);

  function handleSearch(event) {
    const searchValue = event.target.value.toLowerCase();

    const filteredShows = allEpisodes.filter(({ name, summary }) => {
      return (
        name.toLowerCase().includes(searchValue) ||
        summary?.toLowerCase().includes(searchValue)
      );
    });

    // remove data before adding again to avoid duplication
    document.querySelector('.episodes').remove();
    document.querySelector('.episodes-info').remove();

    // select 'All episodes' from selection list after typing in the search box as it's searching in all episodes
    document.querySelector('.episode-select').firstChild.selected = true;

    // construct episodes view with search input applied
    makePageForEpisodes(filteredShows);
  }
}

function makeEpisodeSelector() {
  const selectDiv = document.createElement('div');
  const episodeSelect = document.createElement('select');
  const option = document.createElement('option');

  selectDiv.appendChild(episodeSelect);
  episodeSelect.appendChild(option);
  document
    .querySelector('.inputs')
    .insertBefore(selectDiv, document.querySelector('.search'));

  selectDiv.classList.add('select');
  episodeSelect.classList.add('episode-select');
  option.value = '';
  option.textContent = 'All episodes';

  allEpisodes.forEach(({ name, season, number }) => {
    const option = document.createElement('option');
    episodeSelect.appendChild(option);

    const seasonAndEpisode = formatEpisodeTitle(season, number);
    option.textContent = `${seasonAndEpisode} – ${name}`;
    option.value = name;
  });

  episodeSelect.addEventListener('input', handleSelect);

  function handleSelect(event) {
    const episode = event.target.value;
    const selectedEpisode = allEpisodes.filter(({ name }) => {
      if (episode) {
        // check for selected episode
        return name === episode;
      } else {
        // no specific episode selected - return all episodes
        return true;
      }
    });

    // remove data before adding again to avoid duplication
    document.querySelector('.episodes').remove();
    document.querySelector('.episodes-info').remove();

    // clear search term
    document.querySelector('.search-input').value = '';

    // construct episodes view with search input applied
    makePageForEpisodes(selectedEpisode);
  }
}

function makeFooter() {
  const footer = document.createElement('footer');
  const footerInfoElement = document.createElement('p');
  const footerInfoTextNodeBefore = document.createTextNode('Data from ');
  const footerInfoTextNodeAfter = document.createTextNode('.');
  const footerAnchorElement = document.createElement('a');

  footer.appendChild(footerInfoElement);
  footerInfoElement.appendChild(footerInfoTextNodeBefore);
  footerInfoElement.appendChild(footerAnchorElement);
  footerInfoElement.appendChild(footerInfoTextNodeAfter);

  main.parentElement.insertBefore(footer, main.nextSibling);

  footerAnchorElement.href = 'https://tvmaze.com';
  footerAnchorElement.textContent = 'TVMaze.com';
}

function makePageForEpisodes(episodeList) {
  const totalEpisodeNumber = allEpisodes.length;

  const episodesContainer = document.createElement('article');
  const episodesCounterInfo = document.createElement('p');

  episodesContainer.classList.add('episodes');
  episodesCounterInfo.classList.add('episodes-info');

  main.appendChild(episodesCounterInfo);
  main.appendChild(episodesContainer);

  let displayMessage;
  if (episodeList.length > 0) {
    displayMessage = `Displaying ${episodeList.length}/${totalEpisodeNumber} episodes.`;
  } else {
    displayMessage = `Sorry, no match was found.`;
  }
  episodesCounterInfo.textContent = displayMessage;
  episodeList.forEach(
    ({ name, season, number, image, summary, airstamp, runtime }) => {
      const episodeSection = document.createElement('section');
      const episodeTitle = document.createElement('h2');
      const episodeInfo = document.createElement('div');
      const episodeAirdate = document.createElement('p');
      const episodeRuntime = document.createElement('p');
      const episodeContent = document.createElement('div');
      const episodeImage = document.createElement('img');
      const episodeSummary = document.createElement('p');

      episodesContainer.appendChild(episodeSection);
      episodeSection.appendChild(episodeTitle);
      episodeSection.appendChild(episodeInfo);
      episodeInfo.appendChild(episodeAirdate);
      episodeInfo.appendChild(episodeRuntime);
      episodeSection.appendChild(episodeImage);
      episodeSection.appendChild(episodeSummary);

      episodeSection.classList.add('episode');
      episodeTitle.classList.add('episode-title');
      episodeInfo.classList.add('episode-info');
      episodeAirdate.classList.add('episode-airdate');
      episodeRuntime.classList.add('episode-runtime');
      episodeImage.classList.add('episode-image');
      episodeSummary.classList.add('episode-summary');

      const seasonAndEpisode = formatEpisodeTitle(season, number);
      episodeTitle.textContent = `${name} – ${seasonAndEpisode}`;
      episodeAirdate.textContent = `Airdate: ${formatAirdate(airstamp)}`;
      episodeRuntime.textContent = `Runtime: ${runtime} minutes`;

      episodeImage.src = image?.medium || 'images/fallback-image.jpg';
      episodeImage.alt = name;

      episodeSummary.innerHTML = summary || 'No summary for this episode.';
    }
  );
}

function formatAirdate(date) {
  var options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const dateObject = new Date(Date.parse(date));
  const displayDate = dateObject.toLocaleString('en-GB', options);
  return displayDate;
}

function formatEpisodeTitle(season, episode) {
  const seasonStr = season.toString();
  const episodeStr = episode.toString();
  const seasonWithPad = seasonStr.padStart(2, '0');
  const episodeWithPad = episodeStr.padStart(2, '0');

  return `S${seasonWithPad}E${episodeWithPad}`;
}

function fetchEpisodesForShow(showId) {
  return fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
    .then((response) => response.json())
    .then((data) => data);
}

function fetchAllShows() {
  return fetch(`https://api.tvmaze.com/shows`)
    .then((response) => response.json())
    .then((data) => data);
}

window.onload = setup;
