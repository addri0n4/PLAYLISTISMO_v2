import wixData from 'wix-data';

$w.onReady(async function () {
    let allItems = await wixData.query('playlist1').limit(1000).find().then(r => r.items);
    let showTimeout, hideTimeout;

$w("#videoPlayerAdvanced1").onPlaybackStarted((event) => {
        if(!$w("#boxHolder").hidden)$w("#boxHolder").hide('roll', { duration:500,direction: "left" });
        if (showTimeout) clearTimeout(showTimeout);
        showTimeout = setTimeout(() => {
            let filtered = allItems.filter(x => x.title === event.data);
            if (filtered.length === 0) return;
            $w("#artist").text = filtered[0].artist;
            $w("#songTitle").text = filtered[0].songTitle;
            $w("#album").text = filtered[0].album;
            $w("#releaseYear").text = filtered[0].releaseYear;
            $w("#director").text = filtered[0].director;
            $w("#boxHolder").show('roll', { duration:500,direction: "left" });
            if (hideTimeout) clearTimeout(hideTimeout);
            hideTimeout = setTimeout(() => {
                $w("#boxHolder").hide('roll', { duration:500,direction: "left" });
            }, 15000);
        }, 15000);
        console.log('onPlaybackStarted', event.data);
    })

    $w("#videoPlayerAdvanced1").onThirtySecondsLeft((event) => {
        if(!$w("#boxHolder").hidden)$w("#boxHolder").hide('roll', { duration:500,direction: "left" });
        console.log('onThirtySecondsLeft', event.data);
        if (showTimeout) clearTimeout(showTimeout);
        showTimeout = setTimeout(() => {
            let filtered = allItems.filter(x => x.title === event.data);
            if (filtered.length === 0) return;
            $w("#artist").text = filtered[0].artist;
            $w("#songTitle").text = filtered[0].songTitle;
            $w("#album").text = filtered[0].album;
            $w("#releaseYear").text = filtered[0].releaseYear;
            $w("#director").text = filtered[0].director;
            $w("#boxHolder").show('roll', { duration:500,direction: "left" });
            if (hideTimeout) clearTimeout(hideTimeout);
            hideTimeout = setTimeout(() => {
                $w("#boxHolder").hide('roll', { duration:500,direction: "left" });
            }, 10000);

        }, 0);
        console.log('onPlaybackStarted', event.data);
    })

});
