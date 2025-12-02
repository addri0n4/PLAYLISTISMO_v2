// --- BANCO DE DADOS (Extraído e Consolidado dos arquivos originais) ---
// Em um app real, isso poderia vir de um JSON externo ou API.

const PLAYLIST_DATA = {
    'folkzone': {
        youtubePlaylistId: 'PL_FolkZone_Playlist_ID_Here', // Se houver um ID real de playlist
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
        // Fallback playlist para iniciar
        defaultList: ['TTBDfpPHsak', 'gFdUFVz5Z6M', 'qFxhHFD2LBE', 'QRGqsPBu73I']
    },
    'trip_hop': {
        videos: {}, // Preencher com dados reais futuramente
        defaultList: ['zUCtZNoj_ww', 'xmKEd8E9QY0'] // Exemplo
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
let currentTimers = []; // Para armazenar os IDs dos setTimeouts e limpar quando necessário
let currentPlaylist = 'folkzone';

// --- INICIALIZAÇÃO DO YOUTUBE API ---
// Carrega o script da API do YouTube de forma assíncrona
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
            'autoplay': 1, // Tenta autoplay (pode ser bloqueado pelo browser)
            'controls': 1,
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
        // Carrega a lista de vídeos
        player.loadPlaylist(playlistData.defaultList);
    }
}

// --- LÓGICA DE CRÉDITOS ---

function onPlayerStateChange(event) {
    // YT.PlayerState.PLAYING = 1
    if (event.data == YT.PlayerState.PLAYING) {
        const videoId = player.getVideoData().video_id;
        const duration = player.getDuration();
        
        handleCreditsForVideo(videoId, duration);
    } else {
        // Se pausar ou terminar, podemos querer limpar os timers ou esconder os créditos
        if (event.data == YT.PlayerState.ENDED || event.data == YT.PlayerState.PAUSED) {
            // Opcional: Esconder créditos imediatamente se pausar?
            // hideCredits(); 
        }
    }
}

function handleCreditsForVideo(videoId, duration) {
    // 1. Limpar timers anteriores (se o usuário pulou o vídeo rápido)
    clearAllTimers();
    hideCredits(); // Garante que começa escondido

    // 2. Buscar metadados
    const data = findVideoData(videoId);
    
    if (!data) {
        console.log("Sem dados para este vídeo:", videoId);
        return;
    }

    // 3. Atualizar o DOM
    updateCreditsDOM(data);

    // 4. Configurar agendamentos (Timings baseados no código original)
    // Mostrar 10s após o início, esconder 15s depois (Total 25s)
    const showAtStart = 10 * 1000;
    const hideAtStart = 25 * 1000;
    
    // Mostrar 30s antes do fim, esconder 5s antes do fim
    // Verificação de segurança para vídeos muito curtos
    const showAtEnd = (duration - 30) * 1000;
    const hideAtEnd = (duration - 5) * 1000;

    // Agenda: Mostrar Início
    currentTimers.push(setTimeout(() => showCredits(), showAtStart));
    
    // Agenda: Esconder Início
    currentTimers.push(setTimeout(() => hideCredits(), hideAtStart));

    // Se o vídeo for longo o suficiente, agenda o final
    if (duration > 40) {
        currentTimers.push(setTimeout(() => showCredits(), showAtEnd));
        currentTimers.push(setTimeout(() => hideCredits(), hideAtEnd));
    }
}

function findVideoData(videoId) {
    // Procura em todas as playlists se necessário, ou foca na atual
    // Aqui vamos procurar na playlist atual primeiro
    if (PLAYLIST_DATA[currentPlaylist].videos[videoId]) {
        return PLAYLIST_DATA[currentPlaylist].videos[videoId];
    }
    
    // Fallback: Procura em todas
    for (const key in PLAYLIST_DATA) {
        if (PLAYLIST_DATA[key].videos[videoId]) {
            return PLAYLIST_DATA[key].videos[videoId];
        }
    }
    
    // Fallback Genérico para demonstração se não encontrar dados
    return {
        artist: "Desconhecido",
        song: "Faixa Desconhecida",
        album: "-",
        year: "-",
        director: "-"
    };
}

function updateCreditsDOM(data) {
    const setText = (id, text) => {
        const el = document.getElementById(id);
        // Lógica de exceção para "feat" ou "ost" ficarem com fonte mais leve (do código original)
        if (text && (text.includes('ft.') || text.includes('&') || text.includes('OST'))) {
             el.className = 'light';
        } else {
             el.className = '';
        }
        el.textContent = text || '';
    };

    setText('artist-name', data.artist);
    setText('song-name', data.song);
    setText('album-name', data.album);
    setText('release-year', data.year);
    setText('director-name', data.director);
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
