const main = document.getElementById('root');

function setup() {
  makeHeader();
  makeFooter();
  makeSearchBar();
  makeEpisodeSelector();

  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makeHeader() {
  const header = document.createElement('header');
  const title = document.createElement('h1');
  const headerContainer = document.createElement('div');

  title.textContent = 'Your best TV shows';
  header.appendChild(headerContainer);
  headerContainer.appendChild(title);
  main.parentElement.insertBefore(header, main);

  title.classList.add('title');
  headerContainer.classList.add('container');
}

function makeSearchBar() {
  const searchBar = document.createElement('div');
  const searchInput = document.createElement('input');

  document.querySelector('header .container').appendChild(searchBar);
  searchBar.appendChild(searchInput);

  searchBar.classList.add('search');
  searchInput.classList.add('search-input');
  searchInput.placeholder = 'Search...';

  searchInput.addEventListener('input', handleSearch);

  function handleSearch(event) {
    const searchValue = event.target.value.toLowerCase();

    const allEpisodes = getAllEpisodes();
    const filteredShows = allEpisodes.filter(({ name, summary }) => {
      return (
        name.toLowerCase().includes(searchValue) ||
        summary.toLowerCase().includes(searchValue)
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
  document.querySelector('header .container').appendChild(selectDiv);

  selectDiv.classList.add('select');
  episodeSelect.classList.add('episode-select');
  option.value = '';
  option.textContent = 'All episodes';

  const allEpisodes = getAllEpisodes();
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
    const allEpisodes = getAllEpisodes();
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
  const totalEpisodeNumber = getAllEpisodes().length;

  const episodesContainer = document.createElement('article');
  const episodesCounterInfo = document.createElement('p');

  episodesContainer.classList.add('episodes');
  episodesCounterInfo.classList.add('episodes-info');

  main.appendChild(episodesCounterInfo);
  main.appendChild(episodesContainer);

  episodesCounterInfo.textContent = `Displaying ${episodeList.length}/${totalEpisodeNumber} episodes.`;

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

      episodeImage.src = image.medium;
      episodeImage.alt = name;

      // gets rid of <p> and </p>
      const cleanSummary = summary.slice(3, -4);

      episodeSummary.textContent = cleanSummary;
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

window.onload = setup;
