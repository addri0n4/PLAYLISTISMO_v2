import Papa from 'papaparse';

$w.onReady(function () {
    // URL do arquivo CSV carregado no Wix CMS
    const csvUrl = 'creditos'; // Substitua com a URL real do CSV no Wix

    // Carregar dados do CSV
    fetch(csvUrl)
        .then(response => response.text())
        .then(csvText => {
            Papa.parse(csvText, {
                header: true,
                complete: function(results) {
                    const videoData = results.data;
                    setupVideoHandlers(videoData);
                }
            });
        });
});

function setupVideoHandlers(videoData) {
    const iframe = document.querySelector('iframe'); // Seletor do iframe do YouTube
    let player;

    iframe.onload = function () {
        player = new YT.Player(iframe, {
            events: {
                'onStateChange': onPlayerStateChange
            }
        });
    };

    function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING) {
            const videoId = player.getVideoData().video_id;
            const videoInfo = videoData.find(video => video.youtube_id === videoId);

            if (videoInfo) {
                const videoDuration = player.getDuration();
                const showIdAtStart = 10; // segundos após o início
                const hideIdAfterStart = 25; // showIdAtStart + 15 segundos
                const showIdBeforeEnd = videoDuration - 30; // 30 segundos antes do fim
                const hideIdBeforeEnd = showIdBeforeEnd + 15; // showIdBeforeEnd + 15 segundos

                setTimeout(() => showVideoId(videoInfo.id), showIdAtStart * 1000);
                setTimeout(() => hideVideoId(), hideIdAfterStart * 1000);
                setTimeout(() => showVideoId(videoInfo.id), showIdBeforeEnd * 1000);
                setTimeout(() => hideVideoId(), hideIdBeforeEnd * 1000);
            }
        }
    }

    function showVideoId(id) {
        const idElement = document.createElement('div');
        idElement.id = 'video-id-display';
        idElement.textContent = `ID: ${id}`;
        idElement.style.position = 'absolute';
        idElement.style.top = '10px';
        idElement.style.right = '10px';
        idElement.style.backgroundColor = 'rgba(0,0,0,0.5)';
        idElement.style.color = 'white';
        idElement.style.padding = '5px';
        document.body.appendChild(idElement);
    }

    function hideVideoId() {
        const idElement = document.getElementById('video-id-display');
        if (idElement) {
            idElement.remove();
        }
    }
}
