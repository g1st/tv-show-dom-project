const main = document.getElementById('root');

function setup() {
  makeHeader();
  makeFooter();

  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makeHeader() {
  const header = document.createElement('header');
  const title = document.createElement('h1');

  title.textContent = 'Your best TV shows';
  header.appendChild(title);
  main.parentElement.insertBefore(header, main);

  title.classList.add('title');
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
  const episodesContainer = document.createElement('article');

  episodesContainer.classList.add('episodes');

  main.appendChild(episodesContainer);

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
