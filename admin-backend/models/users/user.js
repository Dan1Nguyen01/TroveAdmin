const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please enter an email"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      minLength: [8, "Minium password length is 8 characters"],
    },

    dob: {
      type: Date,
    },
    gender: {
      type: String,
    },

    // provider_id: {
    //   type: String,
    //   unique: true,
    // },

    provider: {
      type: String,
    },

    imageURL: {
      type: String,
      default: "https://firebasestorage.googleapis.com/v0/b/helical-analyst-376421.appspot.com/o/images%2FartistPicPlaceholder.png?alt=media&token=2e12a07f-4c39-4029-8c7c-d30fcbcfa84c"
    },

    displayName: {
      type: String,
      default: "My Account",
    },

    playlists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Playlist",
        default: null,
      },
    ],

    recentTracks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song",
        default: null,
      },
    ],

    likedSongs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song",
        default: null,
      },
    ],

    likedArtists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Artist",
        default: null,
      },
    ],
  },
  { timestamps: true }
);

//static sign up method

userSchema.statics.signup = async function (email, password) {
  // validation

  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }

  const condition2 = await this.findOne({ email });

  if (condition2) {
    throw Error("Email already in use");
  }

  //mypassword into dakjda542
  // salt to make password to be different from the same password
  const salt = await bcrypt.genSalt(10);

  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hash });

  return user;
};

//static login method

userSchema.statics.login = async function (email, password) {
  if (!password || !email) {
    throw Error("All fields must be filled");
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw Error("Incorrect email or password");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Incorrect email or password");
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);
