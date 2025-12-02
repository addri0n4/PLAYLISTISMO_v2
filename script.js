// --- BANCO DE DADOS (Extraído e Consolidado) ---
const PLAYLIST_DATA = {
    'folkzone': {
        youtubePlaylistId: 'PL_FolkZone', 
        videos: {
            'TTBDfpPHsak': { artist: 'Rozi Plain', song: 'Help', album: 'Prize', year: '2022', director: 'Noriko Okaku' },
            'gFdUFVz5Z6M': { artist: 'Field Music', song: 'Orion From The Street', album: 'Flat White Moon', year: '2021', director: 'Kevin Dosdale' },
            'qFxhHFD2LBE': { artist: 'Gengahr', song: 'Carrion', album: 'Where Wildness Grows', year: '2017', director: 'Dan Jacobs' },
            'QRGqsPBu73I': { artist: 'The Besnard Lakes', song: 'Feuds With Guns', album: 'The Last of the Great Thunderstorm...', year: '2020', director: 'Jordan "Dr.Cool" Minkoff' },
            'zUCtZNoj_ww': { artist: 'Suuns', song: 'Watch You, Watch Me', album: 'Felt', year: '2018', director: 'RUFFMERCY' },
            'xmKEd8E9QY0': { artist: 'Cráneo', song: 'NASA', album: 'single', year: '2018', director: 'Cráneo' },
            'MCPfywB_lVs': { artist: 'Nathy Peluso', song: 'Esmeralda', album: 'single', year: '2017', director: 'Cráneo' },
            'TOy95MU2a80': { artist: 'Angelo De Augustine', song: 'Another Universe', album: 'Toil and Trouble', year: '2023', director: 'Angelo De Augustine' }
        },
        defaultList: ['TTBDfpPHsak', 'gFdUFVz5Z6M', 'qFxhHFD2LBE', 'QRGqsPBu73I']
    },
    'trip_hop': {
        videos: {}, 
        defaultList: ['zUCtZNoj_ww', 'xmKEd8E9QY0'] 
    },
    'mid_pop': {
        videos: {},
        defaultList: ['MCPfywB_lVs']
    },
    'sepia': {
        videos: {},
        defaultList: ['TOy95MU2a80']
    }
};

// --- CONFIGURAÇÃO ---
let player;
let currentTimers = []; 
let currentPlaylist = 'folkzone';

// --- INICIALIZAÇÃO DO YOUTUBE API ---
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

window.onYouTubeIframeAPIReady = function() {
    const initialList = PLAYLIST_DATA[currentPlaylist].defaultList;
    
    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        playerVars: {
            'playsinline': 1,
            'autoplay': 1,
            'controls': 1, // Mantido 1 para UX, mas o design incentiva "assistir"
            'modestbranding': 1,
            'rel': 0
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
};

function onPlayerReady(event) {
    loadPlaylist(currentPlaylist);
}

// --- CONTROLE DE PLAYLIST ---
document.getElementById('playlist-selector').addEventListener('change', (e) => {
    currentPlaylist = e.target.value;
    loadPlaylist(currentPlaylist);
});

function loadPlaylist(playlistKey) {
    const playlistData = PLAYLIST_DATA[playlistKey];
    if (playlistData && playlistData.defaultList.length > 0) {
        player.loadPlaylist(playlistData.defaultList);
    }
}

// --- LÓGICA DE CRÉDITOS ---
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        const videoId = player.getVideoData().video_id;
        const duration = player.getDuration();
        handleCreditsForVideo(videoId, duration);
    } else {
        if (event.data == YT.PlayerState.ENDED || event.data == YT.PlayerState.PAUSED) {
            // Opcional: limpar créditos ao pausar
        }
    }
}

function handleCreditsForVideo(videoId, duration) {
    clearAllTimers();
    hideCredits(); 

    const data = findVideoData(videoId);
    
    if (!data) return;

    updateCreditsDOM(data);

    // Timings Estilo MTV:
    // Começo: Aparece aos 5s, some aos 15s (para deixar ver o clipe iniciar)
    const showAtStart = 5 * 1000;
    const hideAtStart = 15 * 1000;
    
    // Fim: Aparece 20s antes do fim, some 5s antes do fim
    const showAtEnd = (duration - 20) * 1000;
    const hideAtEnd = (duration - 5) * 1000;

    currentTimers.push(setTimeout(() => showCredits(), showAtStart));
    currentTimers.push(setTimeout(() => hideCredits(), hideAtStart));

    if (duration > 40) {
        currentTimers.push(setTimeout(() => showCredits(), showAtEnd));
        currentTimers.push(setTimeout(() => hideCredits(), hideAtEnd));
    }
}

function findVideoData(videoId) {
    if (PLAYLIST_DATA[currentPlaylist].videos[videoId]) {
        return PLAYLIST_DATA[currentPlaylist].videos[videoId];
    }
    
    for (const key in PLAYLIST_DATA) {
        if (PLAYLIST_DATA[key].videos[videoId]) {
            return PLAYLIST_DATA[key].videos[videoId];
        }
    }
    
    return {
        artist: "Artist Unknown",
        song: "Track ID Pending",
        album: "---",
        year: "199X",
        director: "---"
    };
}

// --- MANIPULAÇÃO DO DOM (ATUALIZADO PARA NOVO DESIGN) ---
function updateCreditsDOM(data) {
    const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text || '';
    };

    setText('artist-name', data.artist);
    setText('song-name', data.song);
    setText('album-name', data.album);
    
    // Campos opcionais: Se não houver diretor, colocamos um placeholder ou escondemos
    setText('release-year', data.year || '----');
    setText('director-name', data.director ? `DIR: ${data.director}` : '');
}

function showCredits() {
    document.getElementById('video-credits').classList.add('visible');
}

function hideCredits() {
    document.getElementById('video-credits').classList.remove('visible');
}

function clearAllTimers() {
    currentTimers.forEach(timerId => clearTimeout(timerId));
    currentTimers = [];
}
