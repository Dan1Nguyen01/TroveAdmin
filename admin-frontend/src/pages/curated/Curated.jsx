import React, {useEffect} from "react";
import { MusicContext } from '../../context/MusicContext';

const Curated = () => {
  const {
    displayMusicBar,
    updateDisplayMusicBar,

    currentSong,
    updateCurrentSong,
    isPlay_Global,
    toggleIsPlay_G,
    setIsPlay_Global,
  } = React.useContext(MusicContext)

React.useEffect(() => {
    if(displayMusicBar == false){
      updateDisplayMusicBar(true);
    }
  },[]);

  return (
    <div className="container">
      <h1 className="text-light">Curated Playlist</h1>
      <h3>Will come Soon</h3>
    </div>
  );
};

export default Curated;
