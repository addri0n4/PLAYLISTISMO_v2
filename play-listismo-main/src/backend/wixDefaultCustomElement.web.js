const API_KEY = 'AIzaSyAWTwX3VdYzDOW_kgx1qtEinqdoV37N3CY';
const PLAYLIST_ID = 'PLEsPxCgw-KMdCvpxB9mUQB7hZvxo15odc';

// Função para aplicar os estilos necessários
const createStyle = () => {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Jost:wght@300;700&display=swap');

    #video-credits {
      position: fixed;
      bottom: 10px;
      left: 10px;
      color: white;
      text-shadow: 2px 2px 4px #000000;
      font-size: 16px;
      line-height: 1.5;
      opacity: 0;
      transition: opacity 1s;
      font-family: 'Jost', sans-serif;
    }

    #video-credits span {
      font-weight: 700; /* Por padrão, usa Jost em negrito */
    }

    #video-credits span.light {
      font-weight: 300; /* Para exceções, usa Jost Light */
    }
  `;
  document.head.appendChild(styleElement);
};

// Função para criar o contêiner de créditos do vídeo
const createVideoCredits = () => {
  const creditsElement = document.createElement('div');
  creditsElement.id = 'video-credits';
  creditsElement.style.display = 'none';

  creditsElement.innerHTML = `
    <p id="artist-name"></p>
    <p id="song-name"></p>
    <p id="album-name"></p>
    <p id="release-year"></p>
    <p id="director-name"></p>
  `;

  document.body.appendChild(creditsElement);
};

// Função para formatar as linhas de crédito
const formatCreditLine = (text, emoji) => {
  const exceptions = ["ft.", "&", "Original Soundtrack", "OST"];
  for (let i = 0; i < exceptions.length; i++) {
    if (text.includes(exceptions[i])) {
      return `<span class="light">${emoji} ${text}</span>`;
    }
  }
  if (text.startsWith("[") && text.endsWith("]")) {
    return `<span class="light">${emoji} ${text}</span>`;
  }
  return `<span>${emoji} ${text}</span>`;
};

// Função para atualizar os créditos do vídeo
const updateVideoCredits = (artist, song, album, year, director) => {
  document.getElementById('artist-name').innerHTML = formatCreditLine(artist, '​@');
  document.getElementById('song-name').innerHTML = formatCreditLine(song, '🎶');
  document.getElementById('album-name').innerHTML = formatCreditLine(album, '💿');
  document.getElementById('release-year').innerHTML = formatCreditLine(year, '📅');
  document.getElementById('director-name').innerHTML = formatCreditLine(director, '🎬︎');
};

// Função para mostrar os créditos
const showCredits = () => {
  const credits = document.getElementById('video-credits');
  credits.style.display = 'block';
  setTimeout(() => {
    credits.style.opacity = 1;
  }, 10);
};

// Função para esconder os créditos
const hideCredits = () => {
  const credits = document.getElementById('video-credits');
  credits.style.opacity = 0;
  setTimeout(() => {
    credits.style.display = 'none';
  }, 1000);
};

// Função para buscar os créditos dos vídeos
const fetchVideoCredits = async () => {
  const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${PLAYLIST_ID}&key=${API_KEY}`);
  const data = await response.json();
  const videoCreditsMap = {};

  data.items.forEach(item => {
    const videoId = item.snippet.resourceId.videoId;
    const title = item.snippet.title.split(' - ');

    videoCreditsMap[videoId] = {
      artist: title[0] || 'Artista',
      song: title[1] || 'Música',
      album: 'Álbum',
      year: 'Ano',
      director: 'Diretor'
    };
  });

  return videoCreditsMap;
};

// Em vez de usar custom elements, vamos usar uma abordagem compatível com Wix
$w.onReady(async function () {
  createStyle();
  createVideoCredits();

  const videoCreditsMap = await fetchVideoCredits();

  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  document.body.appendChild(tag);

  window.onYouTubeIframeAPIReady = () => {
    window.player = new YT.Player('player', {
      height: '360',
      width: '640',
      playerVars: {
        'listType': 'playlist',
        'list': PLAYLIST_ID,
        'autoplay': 1,
        'controls': 1,
        'showinfo': 0,
        'modestbranding': 1
      },
      events: {
        'onStateChange': (event) => {
          if (event.data == YT.PlayerState.PLAYING) {
            const videoId = window.player.getVideoData().video_id;
            const credit = videoCreditsMap[videoId];
            if (credit) {
              updateVideoCredits(credit.artist, credit.song, credit.album, credit.year, credit.director);

              setTimeout(showCredits, 10000);  // Mostrar créditos 10 segundos após o início do vídeo
              setTimeout(hideCredits, 25000);  // Esconder créditos após 15 segundos
              const duration = window.player.getDuration();
              setTimeout(showCredits, (duration - 25) * 1000);  // Mostrar créditos 25 segundos antes do vídeo acabar
              setTimeout(hideCredits, (duration - 5) * 1000);  // Esconder créditos 5 segundos antes do vídeo acabar
            }
          }
        }
      }
    });
  };
});
