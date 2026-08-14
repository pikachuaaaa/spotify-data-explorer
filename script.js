const readline = require('readline')
const path = require('path');
const fs = require('fs');

let n = 5;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

rl.question('Ile piosenek w topkach wyświetlić?', (answer) => {
    console.log(`Wybrałeś: ${answer}`);
    n = Number(answer)

    run(n)

    rl.close()
})

function run(n) {

    const dir = 'Spotify Extended Streaming History';
    const files = fs.readdirSync(dir).sort()

    let totalByYear = {}

    let totalSongsTime = 0;
    let totalVideoTime = 0;

    let totalSongsCount = 0;
    let totalVideoCount = 0;

    let yearlySongsTimeAverage = 0
    let yearlyVideoTimeAverage = 0

    let ipAddressesList = []

    const songs = new Map()
    const artists = new Map()
    const albums = new Map()

    let totalUniqueSongsCount = 0

    let yearsCount = 0;

    const listeningByDay = Array(7).fill(0);
    const listeningByHour = Array(24).fill(0);
    const listeningByMonth = Array(12).fill(0);
    const listeningByPlatform = new Map()

    const labels = {
        years: [],
        days: ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"],
        months: ["Styczeń", "Luteń", "Marzeń", "Kwiecień", "Majeń", "Czerwień", "Lipień", "Sierpień", "Wrzesień", "Październień", "Listopadzień", "Grudzień"],
        hours: []
    }
    for (let i = 0; i < 24; i++) {
        labels.hours.push(`${String(i).padStart(2, "0")}:00`);
    }

    const yearlySongs = new Map()
    const yearlyArtists = new Map()
    const yearlyAlbums = new Map()

    const dailyMusic = new Map()

    function formatTime(minutes) {
        const days = Math.floor(minutes / 1440);
        minutes %= 1440;

        const hours = Math.floor(minutes / 60);
        minutes = Math.round(minutes % 60);

        let output = ``
        if (days > 0) {
            output += `${days} dni, `;
        }
        if (hours > 0) {
            output += `${hours} godz. `;
        }
        if (minutes > 0) {
            output += `${minutes} min`;
        }
        return output;
    }

    function progressBar(
        elementsNumber,
        charActive,
        charNonActive,
        currentValue,
        maxValue,
    ) {
        if (elementsNumber > 10) {
            elementsNumber = 10;
        }

        const filledElements =
            currentValue > 0
                ? Math.max(
                    1,
                    Math.floor((currentValue / maxValue) * elementsNumber),
                )
                : 0;

        let chars = "";

        for (let i = 0; i < elementsNumber; i++) {
            if (i < filledElements) {
                chars += charActive;
            } else {
                chars += charNonActive;
            }
        }

        return chars;
    }

    function printBarChart(labels, values, unit = "") {
        const maxValue = Math.max(...values);

        for (let i = 0; i < values.length; i++) {
            const bar = progressBar(
                10,
                "█",
                "░",
                values[i],
                maxValue
            );

            console.log(
                `${String(labels[i]).padEnd(12)} ${bar} ${values[i].toFixed(0)}${unit}`
            );
        }
    }

    function normalizePlatform(platform) {
        if (!platform) return "unknown";

        const lower = platform.toLowerCase();

        if (lower.startsWith("android")) {
            return "android";
        }

        if (lower.startsWith("windows")) {
            return "windows";
        }

        if (lower.startsWith("linux")) {
            return "linux";
        }

        if (lower.startsWith("ios")) {
            return "ios";
        }

        if (lower.startsWith("tizen")) {
            return "tizen";
        }

        if (lower.startsWith("web_player")) {
            return "web player";
        }

        return platform;
    }

    function getTop(map, n) {
        return [...map.entries()]
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, n);
    }

    for (const file of files) {
        if (!file.endsWith(".json")) continue;

        const filePath = path.join(dir, file);
        const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

        const yearMatch = file.match(/\d{4}/);
        if (!yearMatch) continue;
        const year = yearMatch[0];
        const type = file.includes("_Audio_") ? "audio" : "video";

        if (!yearlySongs.has(year)) {
            yearlySongs.set(year, new Map());
        }

        if (!yearlyArtists.has(year)) {
            yearlyArtists.set(year, new Map());
        }

        if (!yearlyAlbums.has(year)) {
            yearlyAlbums.set(year, new Map());
        }

        if (!totalByYear[year]) {
            totalByYear[year] = {
                audio: {time: 0, count: 0},
                video: {time: 0, count: 0}
            };
        }

        for (const entry of data) {
            const platform = normalizePlatform(entry.platform);

            if (!listeningByPlatform.has(platform)) {
                listeningByPlatform.set(platform, 0);
            }

            if (type === "audio") {
                const day = entry.ts.split("T")[0];

                if (!dailyMusic.has(day)) {
                    dailyMusic.set(day, {
                        time: 0,
                        count: 0
                    });
                }

                const dayData = dailyMusic.get(day);

                dayData.time += entry.ms_played;
                dayData.count++;
            }

            totalByYear[year][type].time += entry.ms_played;
            totalByYear[year][type].count++;

            if (!ipAddressesList.includes(entry.ip_addr)) {
                ipAddressesList.push(entry.ip_addr);
            }

            const song = entry.master_metadata_track_name;
            const artist = entry.master_metadata_album_artist_name;
            const album = entry.master_metadata_album_album_name;


            if (!songs.has(song)) {
                songs.set(song, {
                    count: 0,
                    time: 0,
                    artist: artist,
                });
            }

            const songData = songs.get(song);

            songData.count++;
            songData.time += entry.ms_played;

            if (!artists.has(artist)) {
                artists.set(artist, {
                    count: 0,
                    time: 0
                });
            }

            const artistData = artists.get(artist);

            artistData.count++;
            artistData.time += entry.ms_played;

            if (!albums.has(album)) {
                albums.set(album, {
                    count: 0,
                    time: 0
                })
            }

            const albumData = albums.get(album);

            albumData.count++;
            albumData.time += entry.ms_played;

            const songsThisYear = yearlySongs.get(year);
            const artistsThisYear = yearlyArtists.get(year)
            const albumsThisYear = yearlyAlbums.get(year);

            if (!songsThisYear.has(song)) {
                songsThisYear.set(song, {
                    count: 0,
                    time: 0,
                    artist: artist
                });
            }

            const yearlySongData = songsThisYear.get(song);

            yearlySongData.count++;
            yearlySongData.time += entry.ms_played;

            if (!artistsThisYear.has(artist)) {
                artistsThisYear.set(artist, {
                    count: 0,
                    time: 0
                });
            }

            const yearlyArtistData = artistsThisYear.get(artist);

            yearlyArtistData.count++;
            yearlyArtistData.time += entry.ms_played;

            if (!albumsThisYear.has(album)) {
                albumsThisYear.set(album, {
                    count: 0,
                    time: 0
                })
            }

            const yearlyAlbumData = albumsThisYear.get(album);

            yearlyAlbumData.count++;
            yearlyAlbumData.time += entry.ms_played;

            listeningByPlatform.set(
                platform,
                listeningByPlatform.get(platform) + entry.ms_played
            );

            const date = new Date(entry.ts);
            const time = entry.ms_played;

            listeningByDay[date.getDay()] += time;
            listeningByHour[date.getHours()] += time;
            listeningByMonth[date.getMonth()] += time;
        }
    }

    for (const entry of Object.values(totalByYear)) {
        totalSongsTime += entry.audio.time / (1000 * 60);
        totalSongsCount += entry.audio.count;

        totalVideoTime += entry.video.time / (1000 * 60);
        totalVideoCount += entry.video.count;
    }

    yearsCount = Object.keys(totalByYear).length

    yearlySongsTimeAverage = (totalSongsTime / yearsCount);
    yearlyVideoTimeAverage = (totalVideoTime / yearsCount);

    totalUniqueSongsCount = songs.size

    const sortedSongs = getTop(songs, n)
    const sortedArtists = getTop(artists, n)
    const sortedAlbums = getTop(albums, n)

    const sortedDays = [...dailyMusic.entries()]
        .sort((a, b) => b[1].time - a[1].time)
        .slice(0, n);
    const [mostMusicDate, mostMusicData] = sortedDays[0]

    const years = Object.keys(totalByYear)


    const platformEntries = [...listeningByPlatform.entries()];

    const platformLabels = platformEntries.map(
        ([platform]) => platform
    );

    labels.years = Object.keys(totalByYear)


    const minutesByDay = listeningByDay.map(
        time => time / 1000 / 60
    );
    const minutesByHour = listeningByHour.map(
        time => time / 1000 / 60
    );
    const minutesByMonth = listeningByMonth.map(
        time => time / 1000 / 60
    );
    const minutesByPlatform = platformEntries.map(
        ([, time]) => time / 1000 / 60
    );
    const minutesByYear = Object.values(totalByYear).map(
        year => year.audio.time / 1000 / 60
    )

    console.log("\n========================================");
    console.log("           SPOTIFY STATISTICS");
    console.log("========================================\n");


    console.log("TOP SONGS");
    console.log("----------------------------------------");

    for (let i = 0; i < n && i < sortedSongs.length; i++) {
        const [song, songData] = sortedSongs[i];

        console.log(
            `${String(i + 1).padStart(2)}. ${song.padEnd(40)} ${songData.count} odtworzeń`
        );
    }


    console.log("\nTOP ARTISTS");
    console.log("----------------------------------------");

    for (let i = 0; i < n && i < sortedArtists.length; i++) {
        const [artist, artistData] = sortedArtists[i];

        console.log(
            `${String(i + 1).padStart(2)}. ${artist.padEnd(40)} ${artistData.count} odtworzeń`
        );
    }


    console.log("\nTOP ALBUMS");
    console.log("----------------------------------------");

    for (let i = 0; i < n && i < sortedAlbums.length; i++) {
        const [album, albumData] = sortedAlbums[i];

        console.log(
            `${String(i + 1).padStart(2)}. ${album.padEnd(40)} ${albumData.count} odtworzeń`
        );
    }

    console.log("\nTOP MUSIC DAYS");
    console.log("----------------------------------------");

    for (let i = 0; i < 5 && i < sortedDays.length; i++) {
        const [date, dayData] = sortedDays[i];

        console.log(
            `${i + 1}. ${date} — ${formatTime(dayData.time / 60000)}`
        );
    }


    console.log("\nGENERAL STATISTICS");
    console.log("----------------------------------------");

    console.log(`Czas słuchania muzyki                : ${totalSongsTime.toFixed(2)} min`);
    console.log(`Czyli w ciągu ${yearsCount} lat                  : ${formatTime(totalSongsTime)}`);
    console.log(`Czas oglądania podcastów             : ${totalVideoTime.toFixed(2)} min`);
    console.log(`Całkowita liczba odtworzeń muzyki    : ${totalSongsCount}`);
    console.log(`Całkowita liczba odtworzeń podcastów : ${totalVideoCount}`);

    console.log(
        `Średnio muzyki / rok                 : ${yearlySongsTimeAverage.toFixed(2)} min`
    );

    console.log(
        `Średnio podcastów / rok              : ${yearlyVideoTimeAverage.toFixed(2)} min`
    );
    console.log(`Średnio muzyki / dzień               : ${(totalSongsTime / dailyMusic.size).toFixed(2)} min`);

    console.log(`Unikalne IP                          : ${ipAddressesList.length}`);
    console.log(`Najbardziej muzyczny dzień           : ${mostMusicDate} - ${formatTime(mostMusicData.time / 60000)}`);


    console.log("\n========================================\n");

    console.log("\nCHARTS")
    console.log("----------------------------------------");

    console.log(`\nWysłuchane minuty według lat\n`)
    printBarChart(labels.years, minutesByYear, " min")
    console.log(`\nWysłuchane minuty według miesiecy\n`)
    printBarChart(labels.months, minutesByMonth, " min")
    console.log(`\nWysłuchane minuty według dni tygodnia\n`)
    printBarChart(labels.days, minutesByDay, " min")
    console.log(`\nWysłuchane minuty według godzin\n`)
    printBarChart(labels.hours, minutesByHour, " min")
    console.log(`\nWysłuchane minuty według platformy\n`)
    printBarChart(platformLabels, minutesByPlatform, " min")

    console.log("\n========================================\n");

    console.log(`\nYEARLY TOPS`);
    console.log("----------------------------------------");

    for (const year of years) {
        const yearData = totalByYear[year];

        const songTop = getTop(yearlySongs.get(year), n);
        const artistsTop = getTop(yearlyArtists.get(year), n);
        const albumsTop = getTop(yearlyAlbums.get(year), n);

        const minutes = yearData.audio.time / (1000 * 60);
        const count = yearData.audio.count;

        console.log(`\n📅 ${year}`);
        console.log("----------------------------------------");

        console.log(`Czas słuchania : ${formatTime(minutes)}`);
        console.log(`Liczba utworów : ${count}`);

        console.log(`\n🎵 TOP SONGS`);

        for (let i = 0; i < songTop.length; i++) {
            const [song, data] = songTop[i];

            console.log(
                `${String(i + 1).padStart(2)}. ${song.padEnd(40)} ${data.count} odtworzeń`
            );
        }

        console.log(`\n🎤 TOP ARTISTS`);

        for (let i = 0; i < artistsTop.length; i++) {
            const [artist, data] = artistsTop[i];

            console.log(
                `${String(i + 1).padStart(2)}. ${artist.padEnd(40)} ${data.count} odtworzeń`
            );
        }

        console.log(`\n TOP ALBUMS`)

        for (let i = 0; i < albumsTop.length; i++) {
            const [album, data] = albumsTop[i];

            console.log(`${String(i + 1).padStart(2)}. ${album.padEnd(40)} ${data.count} odtworzeń`)
        }
    }
}
