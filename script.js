const main = document.getElementById('root');
let allEpisodes;
let allShows;

window.onload = setup;

// ====== Page building parts ======

// Header

function makeHeader() {
  const header = document.createElement('header');
  const headerContainer = addElement('div', header, 'container');
  const title = addElement('h1', headerContainer, 'title');
  const inputs = addElement('div', headerContainer, 'inputs');

  title.textContent = 'Your best TV shows';
  main.parentElement.insertBefore(header, main);
}

// Shows page elements

function makeShowSelector(shows) {
  const inputs = document.querySelector('.inputs');
  const showsDiv = addElement('div', inputs, 'shows');
  const showsSelect = addElement('select', showsDiv, 'shows-select');

  populateShowsSelector(shows);

  showsSelect.addEventListener('input', handleShowSelect);
}

function makeShowSearchBar() {
  const inputs = document.querySelector('.inputs');
  const searchBar = addElement('div', inputs, 'show-search');
  const searchInput = addElement('input', searchBar, 'show-search-input');

  searchInput.placeholder = 'Filter for...';
  searchInput.type = 'search';

  searchInput.addEventListener('input', handleShowSearch);
}

function makePageForShows(showList) {
  // remove previous show elements (if exists) before adding again to avoid duplication
  document.querySelector('.showsList')?.remove();
  document.querySelector('.shows-info')?.remove();

  const showsCounterInfo = addElement('p', main, 'shows-info');
  const showsContainer = addElement('article', main, 'showsList');

  let displayMessage = getDisplayMessage(showList, allShows, 'shows');
  showsCounterInfo.textContent = displayMessage;

  showList.forEach(
    ({ name, status, image, summary, genres, runtime, rating, id }) => {
      const showSection = addElement('section', showsContainer, 'show');
      const showWrapper = addElement('div', showSection, 'show-wrapper');
      const showInfoAndTitleWrapper = addElement('div', showWrapper, 'show-info-wrapper');
      const showTitle = addElement('h2', showInfoAndTitleWrapper, 'show-title');
      const showInfo = addElement('div', showInfoAndTitleWrapper, 'show-info');
      const showRuntime = addElement('p', showInfo);
      const showStatus = addElement('p', showInfo);
      const showRating = addElement('p', showInfo);
      const showGenres = addElement('p', showInfo);
      const showImage = addElement('img', showWrapper, 'show-image');
      const showSummary = addElement('p', showSection, 'show-summary');

      showTitle.id = id;
      showTitle.tabIndex = 0; // enable selection with TAB key, good for a11y
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
  const selectDiv = addElement('div', null, 'select');
  const episodeSelect = addElement('select', selectDiv, 'episode-select');
  const option = addElement('option', episodeSelect);
  option.value = '';
  option.textContent = 'All episodes';

  // selectro comes before search box
  document
    .querySelector('.inputs')
    .insertBefore(selectDiv, document.querySelector('.search'));

  allEpisodes.forEach(({ name, season, number }) => {
    const option = addElement('option', episodeSelect);
    const seasonAndEpisode = formatEpisodeTitle(season, number);

    option.value = name;
    option.textContent = `${seasonAndEpisode} – ${name}`;
  });

  episodeSelect.addEventListener('input', handleEpisodeSelect);
}

function makeEpisodesSearchBar() {
  const inputs = document.querySelector('.inputs');
  const searchBar = addElement('div', inputs, 'search');
  const searchInput = addElement('input', searchBar, 'search-input');

  searchInput.placeholder = 'Search...';
  searchInput.type = 'search';

  searchInput.addEventListener('input', handleEpisodeSearch);
}

function makePageForEpisodes(episodeList) {
  // remove current episodes info (if not null) before adding again to avoid duplication
  document.querySelector('.episodes')?.remove();
  document.querySelector('.episodes-info')?.remove();

  const episodesContainer = addElement('article', main, 'episodes');
  const episodesCounterInfo = addElement('p', main, 'episodes-info');

  let displayMessage = getDisplayMessage(episodeList, allEpisodes, "episodes");
  episodesCounterInfo.textContent = displayMessage;

  episodeList.forEach(
    ({ name, season, number, image, summary, airstamp, runtime }) => {
      const episodeSection = addElement('section', episodesContainer, 'episode');
      const episodeTitle = addElement('h2', episodeSection, 'episode-title');
      const episodeInfo = addElement('div', episodeSection, 'episode-info');
      const episodeAirdate = addElement('p', episodeInfo, 'episode-airdate');
      const episodeRuntime = addElement('p', episodeInfo, 'episode-runtime');
      const episodeImage = addElement('img', episodeSection, 'episode-image');
      const episodeSummary = addElement('p', episodeSection, 'episode-summary');
      
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
  const footerInfoElement = addElement('p', footer); 
  const footerInfoTextNodeBefore = document.createTextNode('Data from ');
  const footerInfoTextNodeAfter = document.createTextNode('.');
  const footerAnchorElement = document.createElement('a');

  footerAnchorElement.href = 'https://tvmaze.com';
  footerAnchorElement.textContent = 'TVMaze.com';

  footerInfoElement.appendChild(footerInfoTextNodeBefore);
  footerInfoElement.appendChild(footerAnchorElement);
  footerInfoElement.appendChild(footerInfoTextNodeAfter);

  main.parentElement.insertBefore(footer, main.nextSibling);
}

// Page building helpers

function populateShowsSelector(shows) {
  const showsSelect = document.querySelector('.shows-select');
  // clear before adding new
  showsSelect.textContent = '';

  // add default option to see all shows
  const option = addElement('option', showsSelect);
  option.value = 'default';
  option.textContent = 'All Shows';

  shows
    // sort by name
    .sort((a, b) => a.name.localeCompare(b.name))
    // add select option for each show
    .forEach(({ name, id }) => {
      const option = addElement('option', showsSelect);
      option.value = id;
      option.textContent = name;
    });

  // select first show from filtered shows to be visible instead of "Show All"
  if (shows.length > 0) {
    showsSelect.firstChild.nextSibling.selected = true;
  }
}

function addButtonToShowsPage() {
  const inputs = document.querySelector('.inputs');
  const buttonToShowsView = addElement('button', inputs, 'shows-page-btn');
  buttonToShowsView.textContent = 'Browse Shows';

  buttonToShowsView.addEventListener('click', homepageHandler);
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

function addElement(element, parent, classNames) {
  const el = document.createElement(element);
  if (parent) {
    parent.appendChild(el);
  }
  if (classNames) {
    classNames.split(' ').forEach(name => {
      el.classList.add(name);
    })
  }

  return el;
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
