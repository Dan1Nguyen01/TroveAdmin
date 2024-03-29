const CuratedPlaylist = require("../../models/curatedPlaylists/curatedPlaylist");
const Song = require("../../models/songs/song");
const Artist = require("../../models/artists/artist");
const Admin = require("../../models/admin/admin");
const User = require("../../models/users/user");


const mongoose = require("mongoose");
//get all curatedPlaylist
const getAllCuratedPlaylist = async (req, res) => {
    const curatedPlaylists = await CuratedPlaylist.find({}).sort({ createdAt: -1 });

    res.status(200).json(curatedPlaylists);
};

//get 1 pl
const getACuratedPlaylist = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ err: "No such curatedPlaylist" });
    }

    const curatedPlaylist = await Playlist.findById(id)
        .populate("curatedPlaylistCreator")
        .populate({
            path: "songList",
            populate: {
                path: "artist",
                select: "artistName",
            },
        });
    if (!curatedPlaylist) {
        return res.status(404).json({ err: "No such curatedPlaylist" });
    } else {
        console.log(curatedPlaylist);

        res.status(200).json(curatedPlaylist);
    }
};

// const getYourCuratedPlaylists = async (req, res) => {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         return res.status(404).json({ error: "This curatedPlaylist doesn't not exist" });
//     }
//     const curatedPlaylists = await Playlist.find({ curatedPlaylistCreator: id }).sort({
//         createdAt: -1,
//     });

//     res.status(200).json(curatedPlaylists);
// };

//create a new curatedPlaylist
// const createCuratedPlaylist = async (req, res) => {
//     console.log(req.body);
//     console.log(req.body.id);
//     try {

//         const admin = await Admin.findOne({ _id: req.body.id });

//         if (!admin) {
//             throw new Error("Please sign in to play this");
//         }

//         let songList = [];
//         let song;

//         if (req.body.songList) {
//             for (i = 0; i < req.body.songList.length; i++) {
//                 song = await Song.findOne({ _id: req.body.songList[i] });
//                 songList = [...songList, song._id];
//                 console.log(songList)

//                 if (!song) {
//                     throw new Error("Please sign in to play this SONG");
//                 }

//             }
//         }

//         const curatedPlaylist = new Playlist({
//             ...req.body,
//             curatedPlaylistCreator: admin._id,
//             songList: songList,
//             isGenerated: false
//         });

//         // curatedPlaylist.songList = songList;
//         admin.curatedPlaylists.push(curatedPlaylist._id);

//         await curatedPlaylist.save();
//         await admin.save();

//         res.status(201).json(curatedPlaylist);
//     } catch (err) {
//         console.log(err);

//         res.status(400).json({ message: err.message });
//     }
// };

const generateCuratedPlaylists = async (req, res) => {


    try {

        await createTopSongsPlaylist();

        await createTopArtistPlaylist();

        await createRandomPopPlaylist();

        await createRandomRockPlaylist();

        await createRandomCountryPlaylist();

        await createRandomHipHopPlaylist();

        await createRandomPlaylist();

        

    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err.message });
    }
}


const createTopSongsPlaylist = async (req, res) => {

    try {

        const songs = await Song.find()
            .populate("artist")
            .populate("featuredArtists")
            .populate("album")
            .sort({ searchCount: -1 });

        if (!songs) {
            return res.status(404).send("songs not found");
        }

        const songLimit = [];

        while (songLimit.length < 2) {

            const currentSong = songs.shift();

            if (!songLimit.some((song) => song._id === currentSong._id)) {
                songLimit.push(currentSong);
                console.log("added currentSong: " + currentSong.title);
                console.log("searchCount of currentSong: " + currentSong.searchCount);
            }
        }
        console.log("songLimit length: " + songLimit.length);

        if (songLimit.length > 2) {
            throw new Error("Song limit cannot be greater than 50.");
        }

        const topSongNames = ["Top Beatz", "Popular Tracks", "Most Searched"];

        let name = "";
        let index = 0;
        const image = "https://firebasestorage.googleapis.com/v0/b/helical-analyst-376421.appspot.com/o/images%2FAsset_7.png?alt=media&token=999aeed3-b12b-4188-b687-64e969d76570";

        index = Math.floor(Math.random() * topSongNames.length);
        name = topSongNames[index];

        console.log("name: " + name);

        const curatedPlaylist = new CuratedPlaylist({
            curatedPlaylistName: name,
            curatedPlaylistBio: "Listen to the most popular songs on the platform!",
            curatedPlaylistCoverUrl: image,
            songList: songLimit,
            isGenerated: true
        });

        console.log("curatedPlaylist: " + curatedPlaylist);

        await curatedPlaylist.save();
        return curatedPlaylist;

    } catch (err) {
        console.log(err);
        res.status(400).json({ err: err.message });
    }
}

const createTopArtistPlaylist = async (req, res) => {

    try {

        const songLimit = [];

        const artists = await Artist.find()
            //.limit(5)
            .sort({ searchCount: -1 });

        if (!artists) {
            return res.status(404).send("artists not found");
        }


        for (const artist of artists) {
            console.log("current artist: " + artist.artistName + ", search count: " + artist.searchCount);

            const currentSong = await Song.findOne({ artist: artist._id })
                .sort({ searchCount: -1 });

            console.log("current song: " + currentSong.title + ", searchCount: " + currentSong.searchCount);

            if (!songLimit.some((song) => song._id === currentSong._id)) {
                songLimit.push(currentSong);
                console.log("added song: " + currentSong.title);
            }

            if (songLimit.length >= 2) {
                break;
            }
        }


        songLimit.map(async (song) => {
            console.log("song in songlimit: " + song.title);
        });

        console.log("songLimit length: " + songLimit.length);

        const name = "Top Artists of the Day";

        const image = "https://firebasestorage.googleapis.com/v0/b/helical-analyst-376421.appspot.com/o/images%2FAsset_0.png?alt=media&token=b324a47c-fb3a-49bd-8f75-f9ba57c4c8cc"

        const curatedPlaylist = new CuratedPlaylist({
            curatedPlaylistName: name,
            curatedPlaylistBio: "Listen to the most popular hits from the most popular artists!",
            curatedPlaylistCoverUrl: image,
            songList: songLimit,
            isGenerated: true
        });

        console.log("curatedPlaylist: " + curatedPlaylist);

        await curatedPlaylist.save();
        return curatedPlaylist;

    } catch (err) {
        console.log(err);
        res.status(400).json({ err: err.message });
    }
}

const createRandomPopPlaylist = async (req, res) => {

    try {

        const songs = await Song.find({ genre: "pop" })
            .populate("artist")
            .populate("featuredArtists")
            .populate("album")
            .sort();

        if (!songs) {
            return res.status(404).send("songs not found");
        }

        const songLimit = [];

        while (songLimit.length < 2) {

            const randomSong = songs[Math.floor(Math.random() * songs.length)];

            if (!songLimit.some((song) => song._id === randomSong._id)) {
                songLimit.push(randomSong);
                console.log("added randomSong: " + randomSong.title);
            }
        }
        console.log("songLimit length: " + songLimit.length);

        if (songLimit.length > 2) {
            throw new Error("Song limit cannot be greater than 50.");
        }

        const popNames = ["Poppin' Nights", "Pop, Pops, Popz", "P-O-Pcorn"];

        let name = "";
        let index = 0;
        const image  = "https://firebasestorage.googleapis.com/v0/b/helical-analyst-376421.appspot.com/o/images%2FAsset_3.png?alt=media&token=fc39f696-1467-4e99-9b1f-45f472c9a954";

        index = Math.floor(Math.random() * popNames.length);
        name = popNames[index];

        console.log("name: " + name);

        const curatedPlaylist = new CuratedPlaylist({
            curatedPlaylistName: name,
            curatedPlaylistBio: "Listen to a mix of random of pop songs!",
            curatedPlaylistCoverUrl: image,
            songList: songLimit,
            isGenerated: true
        });

        console.log("curatedPlaylist: " + curatedPlaylist);

        await curatedPlaylist.save();
        return curatedPlaylist;
    } catch (err) {
        console.log(err);
        res.status(400).json({ err: err.message });
    }
}

const createRandomRockPlaylist = async (req, res) => {

    try {

        const songs = await Song.find({ genre: "rock" })
            .populate("artist")
            .populate("featuredArtists")
            .populate("album")
            .sort();

        if (!songs) {
            return res.status(404).send("songs not found");
        }

        const songLimit = [];

        while (songLimit.length < 2) {

            const randomSong = songs[Math.floor(Math.random() * songs.length)];

            if (!songLimit.some((song) => song._id === randomSong._id)) {
                songLimit.push(randomSong);
                console.log("added randomSong: " + randomSong.title);
            }
        }
        console.log("songLimit length: " + songLimit.length);

        if (songLimit.length > 2) {
            throw new Error("Song limit cannot be greater than 50.");
        }

        const rockNames = ["Rockin' Nights", "Rockslidez", "Rockefeller"];

        let name = "";
        let index = 0;
        const image = "https://firebasestorage.googleapis.com/v0/b/helical-analyst-376421.appspot.com/o/images%2FAsset_2.png?alt=media&token=89fd9c20-0594-4757-995f-d2e7aff8c6ac";

        index = Math.floor(Math.random() * rockNames.length);
        name = rockNames[index];

        console.log("name: " + name);

        const curatedPlaylist = new CuratedPlaylist({
            curatedPlaylistName: name,
            curatedPlaylistBio: "Listen to a mix of random of rock songs!",
            curatedPlaylistCoverUrl: image,
            songList: songLimit,
            isGenerated: true
        });

        console.log("curatedPlaylist: " + curatedPlaylist);

        await curatedPlaylist.save();
        return curatedPlaylist;
    } catch (err) {
        console.log(err);
        res.status(400).json({ err: err.message });
    }
}

const createRandomCountryPlaylist = async (req, res) => {

    try {

        const songs = await Song.find({ genre: "country" })
            .populate("artist")
            .populate("featuredArtists")
            .populate("album")
            .sort();

        if (!songs) {
            return res.status(404).send("songs not found");
        }

        const songLimit = [];

        while (songLimit.length < 2) {

            const randomSong = songs[Math.floor(Math.random() * songs.length)];

            if (!songLimit.some((song) => song._id === randomSong._id)) {
                songLimit.push(randomSong);
                console.log("added randomSong: " + randomSong.title);
            }
        }
        console.log("songLimit length: " + songLimit.length);

        if (songLimit.length > 2) {
            throw new Error("Song limit cannot be greater than 50.");
        }

        const countryNames = ["Country Vibes", "Western Trails", "Big Iron"];

        let name = "";
        let index = 0;
        const image = "https://firebasestorage.googleapis.com/v0/b/helical-analyst-376421.appspot.com/o/images%2FAsset_4_2.png?alt=media&token=42f210c8-267e-48a1-90e7-fbf1e1ced7ff";

        index = Math.floor(Math.random() * countryNames.length);
        name = countryNames[index];

        console.log("name: " + name);

        const curatedPlaylist = new CuratedPlaylist({
            curatedPlaylistName: name,
            curatedPlaylistBio: "Listen to a mix of random of country songs!",
            curatedPlaylistCoverUrl: image,
            songList: songLimit,
            isGenerated: true
        });

        console.log("curatedPlaylist: " + curatedPlaylist);

        await curatedPlaylist.save();
        return curatedPlaylist;
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err.message });
    }
}

const createRandomHipHopPlaylist = async (req, res) => {

    try {

        const songs = await Song.find({ genre: "hiphop" })
            .populate("artist")
            .populate("featuredArtists")
            .populate("album")
            .sort();

        if (!songs) {
            return res.status(404).send("songs not found");
        }

        const songLimit = [];

        while (songLimit.length < 2) {

            const randomSong = songs[Math.floor(Math.random() * songs.length)];

            if (!songLimit.some((song) => song._id === randomSong._id)) {
                songLimit.push(randomSong);
                console.log("added randomSong: " + randomSong.title);
            }
        }
        console.log("songLimit length: " + songLimit.length);

        if (songLimit.length > 2) {
            throw new Error("Song limit cannot be greater than 50.");
        }

        const hipHopNames = ["Trappin' Rhymez", "Westside Vibez", "HipHop Beatz"];

        let name = "";
        let index = 0;
        const image = "https://firebasestorage.googleapis.com/v0/b/helical-analyst-376421.appspot.com/o/images%2FAsset_4.png?alt=media&token=dd058baf-947c-4204-8db2-b3eb534eaa8e";

        index = Math.floor(Math.random() * hipHopNames.length);
        name = hipHopNames[index];

        console.log("name: " + name);

        const curatedPlaylist = new CuratedPlaylist({
            curatedPlaylistName: name,
            curatedPlaylistBio: "Listen to a mix of random of hiphop songs!",
            curatedPlaylistCoverUrl: image,
            songList: songLimit,
            isGenerated: true
        });

        console.log("curatedPlaylist: " + curatedPlaylist);

        await curatedPlaylist.save();
        return curatedPlaylist;
    } catch (err) {
        console.log(err);
        res.status(400).json({ err: err.message });
    }
}

const createRandomPlaylist = async (req, res) => {

    try {
        const songs = await Song.find()
            .populate("artist")
            .populate("featuredArtists")
            .populate("album")
            .sort();

        if (!songs) {
            return res.status(404).send("songs not found");
        }

        const songLimit = [];

        while (songLimit.length < 2) {

            const randomSong = songs[Math.floor(Math.random() * songs.length)];

            if (!songLimit.some((song) => song._id === randomSong._id)) {
                songLimit.push(randomSong);
                console.log("added randomSong: " + randomSong.title);
            }
        }
        console.log("songLimit length: " + songLimit.length);

        if (songLimit.length > 2) {
            throw new Error("Song limit cannot be greater than 50.");
        }

        const randomNames = ["Random Vibez", "The Shuffler", "Mystery Music"];

        let name = "";
        let index = 0;
        const image = "https://firebasestorage.googleapis.com/v0/b/helical-analyst-376421.appspot.com/o/images%2FAsset_8.png?alt=media&token=56d1b0a1-1c1c-43bc-9f97-ad09fbeac891";

        index = Math.floor(Math.random() * randomNames.length);
        name = randomNames[index];

        console.log("name: " + name);

        const curatedPlaylist = new CuratedPlaylist({
            curatedPlaylistName: name,
            curatedPlaylistBio: "Listen to a mix of random of songs!",
            curatedPlaylistCoverUrl: image,
            songList: songLimit,
            isGenerated: true
        });

        console.log("curatedPlaylist: " + curatedPlaylist);

        await curatedPlaylist.save();
        return curatedPlaylist;
    } catch (err) {
        console.log(err);
        res.status(400).json({ err: err.message });
    }
}

//update a new pl

const updateCuratedPlaylist = async (req, res) => {
    const { id } = req.params;

    console.log(req.body);
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ err: "No such curatedPlaylist" });
    }

    try {
        const curatedPlaylist = await CuratedPlaylist.findById(id);


        let songList = [];
        let song;

        for (i = 0; i < req.body.songList.length; i++) {
            song = await Song.findOne({ _id: req.body.songList[i] });
            songList = [...songList, song._id];
            console.log(songList);

            if (!song) {
                throw new Error("Please sign in to play this SONG");
            }
        }

        // const songs = await Song.find({}).sort({ createdAt: -1 });

        // if (!songs) {
        //   throw new Error("Songs not found");
        // }

        // let songList = songs.map((song) => song._id);

        const curatedPlaylistUpdate = await CuratedPlaylist.findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    ...req.body,
                    // curatedPlaylistCreator: admin._id,
                    curatedPlaylistName: req.body.curatedPlaylistName,
                    songList: songList,
                },
            },
            { new: true }
        );

        await curatedPlaylistUpdate.save();
        //figure out how to remove songs...

        if (!curatedPlaylistUpdate) {
            return res.status(404).json({ message: "No such curatedPlaylist" });
        }

        res.status(200).json(curatedPlaylistUpdate);
    } catch (err) {
        console.log(err);
        res.status(400).json({ err: err.message });
    }
};

//Delete a pl
const deleteCuratedPlaylist = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ err: "No such curatedPlaylist" });
    }

    try {
        const curatedPlaylist = await CuratedPlaylist.findById(id);


        await CuratedPlaylist.findOneAndDelete({ _id: id });

        res.status(200).json({ msg: "curatedPlaylist deleted" });
    } catch (err) {
        console.log(err);
        res.status(400).json({ err: err.message });
    }
};

module.exports = {
    getAllCuratedPlaylist,
    // getYourCuratedPlaylists,
    getACuratedPlaylist,
    // createCuratedPlaylist,
    //getRandomCuratedPlaylist,
    generateCuratedPlaylists,
    updateCuratedPlaylist,
    deleteCuratedPlaylist,
};
