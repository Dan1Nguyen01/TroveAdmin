const express = require('express');
const router = express.Router();
//const cron = require("node-cron");
const CuratedPlaylist = require("../../models/curatedPlaylists/curatedPlaylist");


const {
    getAllCuratedPlaylist,
    getACuratedPlaylist,
    generateCuratedPlaylists,
    updateCuratedPlaylist,
    deleteCuratedPlaylist,
} = require('../../controllers/curatedPlaylist/curatedPlaylist');

router.get('/', getAllCuratedPlaylist);

router.get('/:id', getACuratedPlaylist);

// router.post('/', createCuratedPlaylist);

// router.post('/:id', createTopUserSongsPlaylist);

router.post('/', generateCuratedPlaylists);


// router.post('/', generateRandomCuratedPlaylist);


router.patch('/:id', updateCuratedPlaylist);

router.delete('/:id', deleteCuratedPlaylist);

// cron.schedule("* * * * *", async (req, res) => {
//     try {
//         await CuratedPlaylist.deleteMany({ isGenerated: true });
//         await generateCuratedPlaylists();
//         console.log("generated curated playlists!");
//     } catch (err) {
//         console.log(err);
//         res.status(400).json({ err: err.message });
//     }
// });

module.exports = router;