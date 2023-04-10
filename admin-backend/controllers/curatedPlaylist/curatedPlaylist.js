const CuratedPlaylist = require("../../models/curatedPlaylists/curatedPlaylist");
const Song = require("../../models/songs/song");
const Artist = require("../../models/artists/artist");
const Admin = require("../../models/admin/admin");


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

const getYourCuratedPlaylists = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "This curatedPlaylist doesn't not exist" });
    }
    const curatedPlaylists = await Playlist.find({ curatedPlaylistCreator: id }).sort({
        createdAt: -1,
    });

    res.status(200).json(curatedPlaylists);
};

//create a new curatedPlaylist
const createCuratedPlaylist = async (req, res) => {
    console.log(req.body);
    console.log(req.body.id);
    try {

        const admin = await Admin.findOne({ _id: req.body.id });

        if (!admin) {
            throw new Error("Please sign in to play this");
        }

        let songList = [];
        let song;

        if (req.body.songList) {
            for (i = 0; i < req.body.songList.length; i++) {
                song = await Song.findOne({ _id: req.body.songList[i] });
                songList = [...songList, song._id];
                console.log(songList)

                if (!song) {
                    throw new Error("Please sign in to play this SONG");
                }

            }
        }

        const curatedPlaylist = new Playlist({
            ...req.body,
            curatedPlaylistCreator: admin._id,
            songList: songList,
            isGenerated: false
        });

        // curatedPlaylist.songList = songList;
        admin.curatedPlaylists.push(curatedPlaylist._id);

        await curatedPlaylist.save();
        await admin.save();

        res.status(201).json(curatedPlaylist);
    } catch (err) {
        console.log(err);

        res.status(400).json({ message: err.message });
    }
};

const generateCuratedPlaylists = async (req, res) => {

    try {

        await createTopSongsPlaylist();

        await createTopArtistPlaylist();

        await createRandomPopPlaylist();

        await createRandomRockPlaylist();

        await createRandomCountryPlaylist();

        await createRandomHipHopPlaylist();

        await createRandomPlaylist();

        return res.status(200).send({ msg: "curated playlists created!" });

    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err.message });
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

        while (songLimit.length < 5) {

            const randomSong = songs[Math.floor(Math.random() * songs.length)];

            if (!songLimit.some((song) => song._id === randomSong._id) || !songLimit.includes(randomSong._id)) {
                songLimit.push(randomSong);
                console.log("added randomSong: " + randomSong.title);
            }
        }
        console.log("songLimit length: " + songLimit.length);

        if (songLimit.length > 5) {
            throw new Error("Song limit cannot be greater than 50.");
        }

        const randomNames = ["Random Vibez", "The Shuffler", "Mystery Music"];

        let name = "";
        let index = 0;

        index = Math.floor(Math.random() * randomNames.length);
        name = randomNames[index];

        console.log("name: " + name);

        const curatedPlaylist = new CuratedPlaylist({
            curatedPlaylistName: name,
            curatedPlaylistBio: "Listen to a mix of random of songs!",
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

        while (songLimit.length < 5) {

            const randomSong = songs[Math.floor(Math.random() * songs.length)];

            if (!songLimit.some((song) => song._id === randomSong._id) || !songLimit.includes(randomSong._id)) {
                songLimit.push(randomSong);
                console.log("added randomSong: " + randomSong.title);
            }
        }
        console.log("songLimit length: " + songLimit.length);

        if (songLimit.length > 5) {
            throw new Error("Song limit cannot be greater than 50.");
        }

        const popNames = ["Poppin' Nights", "Friday Popz", "P-O-Pcorn"];

        let name = "";
        let index = 0;

        index = Math.floor(Math.random() * popNames.length);
        name = popNames[index];

        console.log("name: " + name);

        const curatedPlaylist = new CuratedPlaylist({
            curatedPlaylistName: name,
            curatedPlaylistBio: "Listen to a mix of random of pop songs!",
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

        while (songLimit.length < 5) {

            const randomSong = songs[Math.floor(Math.random() * songs.length)];

            if (!songLimit.some((song) => song._id === randomSong._id)  || !songLimit.includes(randomSong._id)) {
                songLimit.push(randomSong);
                console.log("added randomSong: " + randomSong.title);
            }
        }
        console.log("songLimit length: " + songLimit.length);

        if (songLimit.length > 5) {
            throw new Error("Song limit cannot be greater than 50.");
        }

        const rockNames = ["Rockin' Fridays", "Rockslidez", "Rockefeller"];

        let name = "";
        let index = 0;

        index = Math.floor(Math.random() * rockNames.length);
        name = rockNames[index];

        console.log("name: " + name);

        const curatedPlaylist = new CuratedPlaylist({
            curatedPlaylistName: name,
            curatedPlaylistBio: "Listen to a mix of random of rock songs!",
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

        while (songLimit.length < 5) {

            const randomSong = songs[Math.floor(Math.random() * songs.length)];

            if (!songLimit.some((song) => song._id === randomSong._id) || !songLimit.includes(randomSong._id)) {
                songLimit.push(randomSong);
                console.log("added randomSong: " + randomSong.title);
            }
        }
        console.log("songLimit length: " + songLimit.length);

        if (songLimit.length > 5) {
            throw new Error("Song limit cannot be greater than 50.");
        }

        const countryNames = ["Country Vibes", "Western Dayz", "Big Iron"];

        let name = "";
        let index = 0;

        index = Math.floor(Math.random() * countryNames.length);
        name = countryNames[index];

        console.log("name: " + name);

        const curatedPlaylist = new CuratedPlaylist({
            curatedPlaylistName: name,
            curatedPlaylistBio: "Listen to a mix of random of country songs!",
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

        while (songLimit.length < 5) {

            const randomSong = songs[Math.floor(Math.random() * songs.length)];

            if (!songLimit.some((song) => song._id === randomSong._id) || !songLimit.includes(randomSong._id)) {
                songLimit.push(randomSong);
                console.log("added randomSong: " + randomSong.title);
            }
        }
        console.log("songLimit length: " + songLimit.length);

        if (songLimit.length > 5) {
            throw new Error("Song limit cannot be greater than 50.");
        }

        const hipHopNames = ["Trappin' Thursdays", "Westside Vibez", "HipHop Beatz"];

        let name = "";
        let index = 0;

        index = Math.floor(Math.random() * hipHopNames.length);
        name = hipHopNames[index];

        console.log("name: " + name);

        const curatedPlaylist = new CuratedPlaylist({
            curatedPlaylistName: name,
            curatedPlaylistBio: "Listen to a mix of random of hiphop songs!",
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

        while (songLimit.length < 5) {

            const currentSong = songs.shift();

            if (!songLimit.some((song) => song._id === currentSong._id) || !songLimit.includes(currentSong._id)) {
                songLimit.push(currentSong);
                console.log("added currentSong: " + currentSong.title);
                console.log("searchCount of currentSong: " + currentSong.searchCount);
            }
        }
        console.log("songLimit length: " + songLimit.length);

        if (songLimit.length > 5) {
            throw new Error("Song limit cannot be greater than 50.");
        }

        const topSongNames = ["Top Beatz", "Popular Tracks", "Most Searched"];

        let name = "";
        let index = 0;

        index = Math.floor(Math.random() * topSongNames.length);
        name = topSongNames[index];

        console.log("name: " + name);

        const curatedPlaylist = new CuratedPlaylist({
            curatedPlaylistName: name,
            curatedPlaylistBio: "Listen to the most popular songs on the platform!",
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

const createTopArtistPlaylist = async (req, res) => {

    try {

        const songLimit = [];

        const artists = await Artist.find()
            .limit(5)
            .sort({ searchCount: -1 });

        if (!artists) {
            return res.status(404).send("artists not found");
        }

        for (const artist of artists) {

            console.log("current artist: " + artist.artistName + ", search count: " + artist.searchCount);

            console.log("current artist songList: " + artist.songList);


            const currentSong = await Song.findOne({ artist: artist._id })
                // const song = await Song.findOne({_id: {$in: artist.songList}})
                .sort({ searchCount: -1 });

                while (songLimit.length < 5) {

                    if (!songLimit.some((song) => song._id === currentSong._id) || !songLimit.includes(currentSong._id)) {
                        songLimit.push(currentSong);
                        console.log("added song: " + currentSong.title);
                    }
                }

            if (songLimit.length > 5) {
                throw new Error("Song limit cannot be greater than 5.");
            }
        }

        const topArtistName = "Top Artists of the Day";

        const curatedPlaylist = new CuratedPlaylist({
            curatedPlaylistName: topArtistName,
            curatedPlaylistBio: "Listen to the most popular hits from the most popular artists!",
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
        res.status(400).json({ message: err.message });
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
        res.status(400).json({ message: err.message });
    }
};

module.exports = {
    getAllCuratedPlaylist,
    getYourCuratedPlaylists,
    getACuratedPlaylist,
    createCuratedPlaylist,
    //getRandomCuratedPlaylist,
    generateCuratedPlaylists,
    updateCuratedPlaylist,
    deleteCuratedPlaylist,
};