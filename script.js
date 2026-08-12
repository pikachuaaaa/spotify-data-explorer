
const n = 5

const path = require('path');
const fs = require('fs');

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

let totalUniqueSongsCount = 0

let yearsCount = 0;

let sortedSongs

function formatTime(minutes) {
    const days = Math.floor(minutes / 1440);
    minutes %= 1440;

    const hours = Math.floor(minutes / 60);
    minutes = Math.round(minutes % 60);

    return `${days} dni, ${hours} godz. ${minutes} min`;
}

for (const file of files) {
    if (!file.endsWith(".json")) continue;

    const filePath = path.join(dir, file);
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const yearMatch = file.match(/\d{4}/);
    if (!yearMatch) continue;
    const year = yearMatch[0];
    const type = file.includes("_Audio_") ? "audio" : "video";

    if (!totalByYear[year]) {
        totalByYear[year] = {
            audio: { time: 0, count: 0 },
            video: { time: 0, count: 0 }
        };
    }

    for (const entry of data) {
        totalByYear[year][type].time += entry.ms_played;
        totalByYear[year][type].count++;

        if (!ipAddressesList.includes(entry.ip_addr)) {
            ipAddressesList.push(entry.ip_addr);
        }

        const song = entry.master_metadata_track_name;

        if (!songs.has(song)) {
            songs.set(song, {
                count: 0,
                time: 0,
                artist: entry.master_metadata_album_artist_name
            });
        }

        const songData = songs.get(song);

        songData.count++;
        songData.time += entry.ms_played;
    }
}

for (const songData of songs.values()) {
    const artist = songData.artist;

    if (!artists.has(artist)) {
        artists.set(artist, {
            count: 0,
            time: 0
        });
    }

    const artistData = artists.get(artist);

    artistData.count += songData.count;
    artistData.time += songData.time;
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
sortedSongs = [...songs.entries()]
    .sort((a, b) => b[1].count - a[1].count);
sortedArtists = [...artists.entries()]
    .sort((a, b) => b[1].count - a[1].count);



console.log("\n========================================");
console.log("           SPOTIFY STATISTICS");
console.log("========================================\n");


console.log("🎵 TOP SONGS");
console.log("----------------------------------------");

for (let i = 0; i < n && i < sortedSongs.length; i++) {
    const [song, songData] = sortedSongs[i];

    console.log(
        `${String(i + 1).padStart(2)}. ${song.padEnd(40)} ${songData.count} odtworzeń`
    );
}


console.log("\n🎤 TOP ARTISTS");
console.log("----------------------------------------");

for (let i = 0; i < n && i < sortedArtists.length; i++) {
    const [artist, artistData] = sortedArtists[i];

    console.log(
        `${String(i + 1).padStart(2)}. ${artist.padEnd(40)} ${artistData.count} odtworzeń`
    );
}


console.log("\n📊 GENERAL STATISTICS");
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

console.log(`Unikalne IP                          : ${ipAddressesList.length}`);


console.log("\n========================================\n");
