$w.onReady(() => {
  let player;

  // Load the YouTube IFrame API
  function loadYouTubeAPI() {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  // Initialize YouTube player
  window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('playerLIST', {
      events: {
        'onStateChange': onPlayerStateChange
      }
    });
  };

  // Handle player state changes
  function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
      const videoId = player.getVideoData().video_id;
      updateTextForVideo(videoId);
    }
  }

  // Update text based on the current video
  function updateTextForVideo(videoId) {
    const creditBOXContent = {
      'TTBDfpPHsak': '🎤   Rozi Plain\n🎶   Help\n💿   Prize\n📅   2022\n🎬︎   Noriko Okaku',
      'gFdUFVz5Z6M': '🎤   Field Music\n🎶   Orion From The Street\n💿   Flat White Moon\n📅   2021\n🎬︎   Kevin Dosdale',
      'qFxhHFD2LBE': '🎤   Gengahr\n🎶   Carrion\n💿   Where Wildness Grows\n📅   2017\n🎬︎   Dan Jacobs',
      'QRGqsPBu73I': '🎤   The Besnard Lakes\n🎶   Feuds With Guns\n💿   The Besnard Lakes Are the Last of the Great Thunderstorm Warnings\n📅   2020\n🎬︎   Jordan "Dr.Cool" Minkoff',
      'zUCtZNoj_ww': '🎤   Suuns\n🎶   Watch You, Watch Me\n💿   Felt\n📅   2018\n🎬︎   RUFFMERCY',
      'xmKEd8E9QY0': '🎤   Cráneo\n🎶   NASA\n💿   single\n📅   2018\n🎬︎   Cráneo',
      'MCPfywB_lVs': '🎤   Nathy Peluso\n🎶   Esmeralda\n💿   single\n📅   2017\n🎬︎   Cráneo',
      'TOy95MU2a80': '🎤   Angelo De Augustine\n🎶   Another Universe\n💿   Toil and Trouble\n📅   2023\n🎬︎   Angelo De Augustine',
      // Add more video IDs and corresponding text elements
    };

    // Hide all text elements first
    $w('#creditBOX').hide();

    // Show the relevant text element
    if (creditBOXContent[videoId]) {
      $w('#creditBOX').text = creditBOXContent[videoId];
      $w('#creditBOX').show();
    }
  }

  loadYouTubeAPI();
});
