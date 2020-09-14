const main = document.getElementById('root');
let allEpisodes;
let allShows;

window.onload = setup;

// ====== Page building parts ======

// Header

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

// Shows page elements

function makeShowSelector(shows) {
  const showsDiv = document.createElement('div');
  const showsSelect = document.createElement('select');

  showsDiv.classList.add('shows');
  showsSelect.classList.add('shows-select');

  showsDiv.appendChild(showsSelect);
  document.querySelector('.inputs').appendChild(showsDiv);

  populateShowsSelector(shows);

  showsSelect.addEventListener('input', handleShowSelect);
}

function makeShowSearchBar() {
  const searchBar = document.createElement('div');
  const searchInput = document.createElement('input');

  document.querySelector('.inputs').appendChild(searchBar);
  searchBar.appendChild(searchInput);

  searchBar.classList.add('show-search');
  searchInput.classList.add('show-search-input');
  searchInput.placeholder = 'Filter for...';
  searchInput.type = 'search';

  searchInput.addEventListener('input', handleShowSearch);
}

function makePageForShows(showList) {
  // remove previous show elements (if exists) before adding again to avoid duplication
  document.querySelector('.showsList')?.remove();
  document.querySelector('.shows-info')?.remove();


  const showsContainer = document.createElement('article');
  const showsCounterInfo = document.createElement('p');

  showsContainer.classList.add('showsList');
  showsCounterInfo.classList.add('shows-info');

  main.appendChild(showsCounterInfo);
  main.appendChild(showsContainer);

  let displayMessage = getDisplayMessage(showList, allShows, 'shows');
  showsCounterInfo.textContent = displayMessage;

  showList.forEach(
    ({ name, status, image, summary, genres, runtime, rating, id }) => {
      const showSection = document.createElement('section');
      const showTitle = document.createElement('h2');
      const showInfo = document.createElement('div');
      const showRuntime = document.createElement('p');
      const showStatus = document.createElement('p');
      const showRating = document.createElement('p');
      const showGenres = document.createElement('p');
      const showContent = document.createElement('div');
      const showImage = document.createElement('img');
      const showSummary = document.createElement('p');
      const showWrapper = document.createElement('div');
      const showInfoAndTitleWrapper = document.createElement('div');

      showsContainer.appendChild(showSection);
      showInfo.appendChild(showRuntime);
      showInfo.appendChild(showStatus);
      showInfo.appendChild(showRating);
      showInfo.appendChild(showGenres);

      showInfoAndTitleWrapper.appendChild(showTitle);
      showInfoAndTitleWrapper.appendChild(showInfo);
      showWrapper.appendChild(showInfoAndTitleWrapper);
      showWrapper.appendChild(showImage);
      showSection.appendChild(showWrapper);
      showSection.appendChild(showSummary);

      showSection.classList.add('show');
      showTitle.classList.add('show-title');
      showTitle.id = id;
      showTitle.tabIndex = 0; // enable selection with TAB key, good for a11y
      showInfo.classList.add('show-info');
      showImage.classList.add('show-image');
      showSummary.classList.add('show-summary');
      showWrapper.classList.add('show-wrapper');
      showInfoAndTitleWrapper.classList.add('show-info-wrapper');

      showTitle.textContent = name;
      showRuntime.textContent = `Runtime: ${runtime} minutes`;
      showStatus.textContent = `Status: ${status}`;
      showRating.textContent = `Rating: ${rating.average}`;
      showGenres.textContent = `Genre: ${genres.join(' | ')}`;

      showImage.src = image?.medium || 'images/fallback-image.jpg';
      showImage.alt = name;

      showSummary.innerHTML = summary || 'No summary for this show.';

      showTitle.addEventListener('click', handleShowLink);
      showTitle.addEventListener('keydown', handleShowLink);
    }
  );
}

// Episodes page elements

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

  episodeSelect.addEventListener('input', handleEpisodeSelect);
}

function makeEpisodesSearchBar() {
  const searchBar = document.createElement('div');
  const searchInput = document.createElement('input');

  document.querySelector('.inputs').appendChild(searchBar);
  searchBar.appendChild(searchInput);

  searchBar.classList.add('search');
  searchInput.classList.add('search-input');
  searchInput.placeholder = 'Search...';
  searchInput.type = 'search';

  searchInput.addEventListener('input', handleEpisodeSearch);
}

function makePageForEpisodes(episodeList) {
  // remove current episodes info (if not null) before adding again to avoid duplication
  document.querySelector('.episodes')?.remove();
  document.querySelector('.episodes-info')?.remove();

  const episodesContainer = document.createElement('article');
  const episodesCounterInfo = document.createElement('p');

  episodesContainer.classList.add('episodes');
  episodesCounterInfo.classList.add('episodes-info');

  main.appendChild(episodesCounterInfo);
  main.appendChild(episodesContainer);

  let displayMessage = getDisplayMessage(episodeList, allEpisodes, "episodes");
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

// Footer

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

// Page building helpers

function populateShowsSelector(shows) {
  const showsSelect = document.querySelector('.shows-select');
  // clear before adding new
  showsSelect.textContent = '';

  // add default option to see all shows
  const option = document.createElement('option');
  option.value = 'default';
  option.textContent = 'All Shows';
  showsSelect.appendChild(option);

  shows
    // sort by name
    .sort((a, b) => a.name.localeCompare(b.name))
    // add select option for each show
    .forEach(({ name, id }) => {
      const option = document.createElement('option');
      option.textContent = name;
      option.value = id;
      showsSelect.appendChild(option);
    });

  // select first show from filtered shows to be visible instead of "Show All"
  if (shows.length > 0) {
    showsSelect.firstChild.nextSibling.selected = true;
  }
}

function addButtonToShowsPage() {
  const button = document.createElement('button');
  const inputs = document.querySelector('.inputs');

  button.textContent = 'Browse Shows';
  button.classList.add('shows-page-btn');
  inputs.appendChild(button);

  button.addEventListener('click', homepageHandler);
}

function clearPage() {
  const headerInputs = document.querySelector('.inputs');
  main.textContent = '';
  headerInputs.textContent = '';
}

function makeShowsPage() {
  makeShowSelector(allShows);
  makeShowSearchBar(allShows);
  makePageForShows(allShows);
}

function makeEpisodesPage(id) {
  makeEpisodesSearchBar();

  const loadInfo = makeLoader();
  const title = getShowTitleFromId(id);

  loadInfo.textContent = `Loading episodes for ${title}...`;

  fetchEpisodesForShow(id)
    .then((data) => {
      if (data) {
        loadInfo.remove();
        makeEpisodeSelector();
        makePageForEpisodes(data);
        addButtonToShowsPage();
      } else {
        throw new Error("Data didn't come from API");
      }
    })
    .catch((err) => {
      loadInfo.textContent =
        'Error while fetching data, please try again. You will be redirected to shows page after 3 seconds.';
      setTimeout(() => {
        clearPage();
        makeShowsPage();
      }, 3000);
    });
}

// ====== End of Page building parts ======

// Event Listeners

function handleShowSelect(event) {
  const showId = event.target.value;
  const info = document.querySelector('.shows-info');

  // Show All selected
  if (showId === 'default') {
    // clear search term
    document.querySelector('.show-search-input').value = '';

    // show all shows
    clearPage();
    makeShowsPage();

    // scroll to top
    window.scroll({
      top: 0,
      behavior: 'smooth',
    });
  } else {
    // specific show selected
    const selectedShow = document.getElementById(showId);
    // scroll to selected show
    selectedShow.scrollIntoView({ behavior: 'smooth' });
  }
}

function handleShowSearch(event) {
  const searchValue = event.target.value.toLowerCase();

  const filteredShows = allShows.filter(({ name, summary, genres }) => {
    return (
      name.toLowerCase().includes(searchValue) ||
      summary?.toLowerCase().includes(searchValue) ||
      genres.map((name) => name.toLowerCase()).includes(searchValue)
    );
  });

  // construct shows view with search input applied
  makePageForShows(filteredShows);

  // make shows selector only of filtered shows
  populateShowsSelector(filteredShows);
}

function handleEpisodeSelect(event) {
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

  // clear search term
  document.querySelector('.search-input').value = '';

  // construct episodes view with search input applied
  makePageForEpisodes(selectedEpisode);
}

function handleEpisodeSearch(event) {
  const searchValue = event.target.value.toLowerCase();

  const filteredShows = allEpisodes.filter(({ name, summary }) => {
    return (
      name.toLowerCase().includes(searchValue) ||
      summary?.toLowerCase().includes(searchValue)
    );
  });

  // select 'All episodes' from selection list after typing in the search box as it's searching in all episodes
  document.querySelector('.episode-select').firstChild.selected = true;

  // construct episodes view with search input applied
  makePageForEpisodes(filteredShows);
}

function handleShowLink(event) {
  if (event.type !== 'click' && event.key !== 'Enter') {
    return;
  }
  const showTitle = event.target.textContent;
  const showId = getShowIdFromTitle(showTitle);

  clearPage();
  makeEpisodesPage(showId);
}

function homepageHandler() {
  clearPage();

  // add shows related elements. No need to fetch - it's already in global variable
  makeShowsPage();
}

// Helpers

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

function getShowIdFromTitle(title) {
  return allShows.filter(
    (show) => show.name.toLowerCase() === title.toLowerCase()
  )[0].id;
}

function getShowTitleFromId(showId) {
  return allShows.filter((show) => show.id == showId)[0].name;
}

function setup() {
  makeHeader();
  makeFooter();
  fetchAllShows()
    .then(() => {
      // construct shows page only when data arrives
      makeShowsPage();
    })
    .catch((error) => {
      main.textContent = 'Error while fetching shows, please try again.';
    });
}

function makeLoader() {
  const loader = document.createElement('p');

  loader.classList.add('loader');
  main.appendChild(loader);

  return loader;
}

function getDisplayMessage(selected, all, type) {
  if (selected.length > 0) {
    return `Displaying ${selected.length}/${all.length} ${type}.`;
  } else {
    return 'Sorry, no match was found.';
  }
}

// Data fetching

function fetchEpisodesForShow(showId) {
  return fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
    .then((response) => response.json())
    .then((data) => {
      allEpisodes = data;
      return data;
    })
    .catch((error) => console.log(error));
}

function fetchAllShows() {
  const loadInfo = makeLoader();
  loadInfo.textContent = 'Fetching shows...';

  return fetch(`https://api.tvmaze.com/shows`)
    .then((response) => response.json())
    .then((data) => {
      loadInfo.remove();
      allShows = data;
      return data;
    })
    .catch((error) => console.log(error));
}
