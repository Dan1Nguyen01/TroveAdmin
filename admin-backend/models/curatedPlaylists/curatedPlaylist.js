const mongoose = require('mongoose');

const curatedPlaylistSchema = new mongoose.Schema(
  {

    curatedPlaylistName: {
      type: String,
      maxlength: 75,
      default: "My Trove List"
    },
    curatedPlaylistCreator: {
      type: String,
      //default
      default: "Trove Music"
    },
    curatedPlaylistBio: {
      type: String,
      maxLength: 100,
      default: "generated playlist provided to you by Trove Music."
    },
    curatedPlaylistCoverUrl: {
      type: String,
      default: "https://firebasestorage.googleapis.com/v0/b/helical-analyst-376421.appspot.com/o/images%2FDefaultAlbumCover.png?alt=media&token=402df276-39d5-4d7f-9a82-9a7b06d91349"
    },
    isPublished: {
      type: Boolean,
      default: false
    },
    isGenerated: {
      type: Boolean,
      default: false
    },
    songList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song"
      }
    ]


  }

)
module.exports = mongoose.model('CuratedPlaylist', curatedPlaylistSchema);