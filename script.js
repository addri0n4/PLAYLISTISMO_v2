// --- BANCO DE DADOS (Simulação) ---
const PLAYLIST_DATA = {
    'folkzone': {
        videos: {
            'TTBDfpPHsak': { artist: 'Rozi Plain', song: 'Help', album: 'Prize', year: '2022', director: 'Noriko Okaku' },
            'gFdUFVz5Z6M': { artist: 'Field Music', song: 'Orion From The Street', album: 'Flat White Moon', year: '2021', director: 'Kevin Dosdale' },
            'qFxhHFD2LBE': { artist: 'Gengahr', song: 'Carrion', album: 'Where Wildness Grows', year: '2017', director: 'Dan Jacobs' },
            'QRGqsPBu73I': { artist: 'The Besnard Lakes', song: 'Feuds With Guns', album: 'The Last of the Great Thunderstorm...', year: '2020', director: 'Jordan Minkoff' },
            'zUCtZNoj_ww': { artist: 'Suuns', song: 'Watch You, Watch Me', album: 'Felt', year: '2018', director: 'RUFFMERCY' }
        },
        defaultList: ['TTBDfpPHsak', 'gFdUFVz5Z6M', 'qFxhHFD2LBE', 'QRGqsPBu73I']
    },
    'trip_hop': {
        videos: {
            'xmKEd8E9QY0': { artist: 'Cráneo', song: 'NASA', album: 'Single', year: '2018', director: 'Cráneo' }
        }, 
        defaultList: ['zUCtZNoj_ww', 'xmKEd8E9QY0'] 
    },
    'mid_pop': {
        videos: {
            'MCPfywB_lVs': { artist: 'Nathy Peluso', song: 'Esmeralda', album: 'Single', year: '2017', director: 'Cráneo' }
        },
        defaultList: ['MCPfywB_lVs']
    },
    'sepia': {
        videos: {
            'TOy95MU2a80': { artist: 'Angelo De Augustine', song: 'Another Universe', album: 'Toil and Trouble', year: '2023', director: 'Self' }
        },
        defaultList: ['TOy95MU2a80']
    }
};

// --- CONFIGURAÇÃO GLOBAL ---
let player;
let currentTimers = []; 
let currentPlaylist = 'folkzone';

// --- INICIALIZAÇÃO API YOUTUBE ---
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        playerVars: {
            'playsinline': 1,
            'autoplay': 1,
            'controls': 1, // Exibe controles nativos caso o usuário precise
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

// --- CONTROLE DE PLAYLIST (Controle Remoto) ---
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

// --- SISTEMA DE CRÉDITOS (MTV STYLE) ---

function onPlayerStateChange(event) {
    // Estado 1 = Playing
    if (event.data == YT.PlayerState.PLAYING) {
        const videoId = player.getVideoData().video_id;
        const duration = player.getDuration();
        
        // Ativar o LED da TV
        document.querySelector('.power-led').classList.add('active');
        
        handleCreditsForVideo(videoId, duration);
    } else {
        // Pausado ou Terminado
        if (event.data == YT.PlayerState.ENDED || event.data == YT.PlayerState.PAUSED) {
             // Opcional: Desligar LED ou esconder créditos
        }
    }
}

function handleCreditsForVideo(videoId, duration) {
    // 1. Resetar estados anteriores
    clearAllTimers();
    hideCredits(); 

    // 2. Buscar dados
    const data = findVideoData(videoId);
    if (!data) return;

    // 3. Atualizar Texto na Tela
    updateCreditsDOM(data);

    // 4. Agendar Animações (Timings clássicos da MTV)
    // Início: Mostra aos 5s, some aos 15s
    const showAtStart = 5000;
    const hideAtStart = 15000;
    
    // Fim: Mostra 20s antes do fim, some 5s antes do fim
    const showAtEnd = (duration - 20) * 1000;
    const hideAtEnd = (duration - 5) * 1000;

    currentTimers.push(setTimeout(() => showCredits(), showAtStart));
    currentTimers.push(setTimeout(() => hideCredits(), hideAtStart));

    // Só agenda o final se o vídeo for longo o suficiente (>45s)
    if (duration > 45) {
        currentTimers.push(setTimeout(() => showCredits(), showAtEnd));
        currentTimers.push(setTimeout(() => hideCredits(), hideAtEnd));
    }
}

function findVideoData(videoId) {
    // Tenta na playlist atual
    if (PLAYLIST_DATA[currentPlaylist].videos[videoId]) {
        return PLAYLIST_DATA[currentPlaylist].videos[videoId];
    }
    // Tenta em todas (fallback)
    for (const key in PLAYLIST_DATA) {
        if (PLAYLIST_DATA[key].videos[videoId]) {
            return PLAYLIST_DATA[key].videos[videoId];
        }
    }
    // Dados genéricos se não encontrar
    return {
        artist: "Unknown Artist",
        song: "Track Loading...",
        album: "---",
        year: "199X",
        director: ""
    };
}

function updateCreditsDOM(data) {
    const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text || '';
    };

    setText('artist-name', data.artist);
    setText('song-name', data.song);
    setText('album-name', data.album);
    setText('release-year', data.year);
    
    // Formatação condicional para o Diretor
    if (data.director) {
        setText('director-name', data.director);
        document.querySelector('.separator').style.display = 'inline';
    } else {
        setText('director-name', '');
        document.querySelector('.separator').style.display = 'none';
    }
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
