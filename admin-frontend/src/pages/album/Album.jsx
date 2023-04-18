import React, { useEffect, useState } from 'react'
import AlbumModal from '../../components/modals/album modal/AlbumModal'
import { MusicContext } from '../../context/MusicContext'
import { BsFillPlayFill } from 'react-icons/bs'
import { BsPlay, BsPause } from 'react-icons/bs'

const Album = () => {
  const [albums, setAlbums] = React.useState([])
  const [errors, setErrors] = React.useState(null)
  const [clicks, setClicks] = useState(0)
  const allAlbums = React.useEffect(() => {
    const fetchAlbums = async () => {
      const response = await fetch('/api/albums', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })

      const json = await response.json()
      if (!response.ok) {
        setErrors(json.error)
        return
      }

      if (response.ok) {
        setAlbums(json.albums)
      }
    }
    fetchAlbums()
  }, [albums.length])

  const [songs, setSongs] = React.useState([])
  const allSongs = React.useEffect(() => {
    const fetchSongs = async () => {
      const response = await fetch('/api/songs', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })

      const json = await response.json()
      if (!response.ok) {
        setErrors(json.error)
        return
      }

      if (response.ok) {
        setSongs(json)
      }
    }
    fetchSongs()
  }, [songs.length])

  const [artistData, setArtistData] = React.useState([])
  React.useEffect(() => {
    const fetchAllArtist = async () => {
      const response = await fetch('/api/artists/', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const json = await response.json()

      if (response.ok) {
        setArtistData(json)
      }
    }
    fetchAllArtist()
  }, [artistData.length])

  const [searchTerm, setSearchTerm] = React.useState('')

  const filteredAlbums = albums.filter(
    album =>
      album.albumName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      album.artist.artistName.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const {
    displayMusicBar,
    updateDisplayMusicBar,
    play_list,
    updatePlay_list,
    currentSong,
    updateCurrentSong,
    isPlay_Global,
    toggleIsPlay_G,
    setIsPlay_Global
  } = React.useContext(MusicContext)

  React.useEffect(() => {
    if (displayMusicBar == false) {
      updateDisplayMusicBar(true)
    }
  }, [])
  const [albumHolder, updateAlbumHolder] = useState(undefined)

  const handlePlayAlbum = albumIn => {
    if(albumIn === undefined){
      return;
    } else {
      updateAlbumHolder(albumIn)
      console.log(albumIn)
    }

    if (play_list !== albumIn?.songList) {
      
      setClicks(clicks + 1)
      return
    } else {
      // handlePlayAlbum(albumIn)
    }
  }
  React.useEffect(() => {
    // This code will run after every render
    handlePlayAlbum(albumHolder)
  }, [clicks]) // Only re-run the effect if count changes

  const setPlaylistasPlay_list = albumIn => {
    console.log('in playlist play_List method')
    if (clicks !== 0) {
      if (play_list !== albumIn?.songList) {
        if (albumIn?.songList.length === 0) {
          return
        } else {
          console.log('setting Play_list')
          updatePlay_list(albumIn?.songList)
        }
      }
    }
  }
  const togglePlayPause = () => {
    toggleIsPlay_G();
  }
  console.log(currentSong);
  return (
    <div className='container'>
      <h1 className='text-light'>Album Manager</h1>

      <input
        type='text'
        className='form-control mb-3'
        placeholder='Search by album name or artist'
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      {filteredAlbums?.length > 0 && (
        <>
          <table class='table table-dark table-bordered '>
            <thead>
              <tr>
                <th scope='col'></th>
                <th scope='col'>ID</th>
                <th scope='col'>IMG</th>
                <th scope='col'>NAME</th>
                <th scope='col'>ARTIST</th>
                <th scope='col'>#TRACKS</th>
                <th scope='col'>EDIT</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlbums?.map(album => (
                <tr key={album._id}>
                  <th scope='row'>
                    <div className='playPauseQueueBtnCont'>
                      {clicks !== 0 && play_list === album?.songList ? (
                        <button
                          className='playlist--playbtn'
                          // id='playPauseBtn'
                          onClick={togglePlayPause}
                        >
                          {isPlay_Global ? (
                            <BsPause />
                          ) : (
                            <BsPlay className='playIconPlayList' />
                          )}
                        </button>
                      ) : (
                        <button
                          className='playlist--playbtn'
                          onClick={() => {
                            handlePlayAlbum({album})}}
                        >
                          <BsFillPlayFill className='playIconPlayList' />
                        </button>
                      )}
                    </div>
                  </th>
                  <th>{album._id}</th>
                  <th>
                    <img src={album.albumArt} width={'50px'} alt='' />
                  </th>
                  <th>{album.albumName}</th>
                  <th>{album?.artist?.artistName}</th>
                  <th>{album?.songList?.length}</th>
                  <th>
                    <AlbumModal
                      album={album}
                      artists={artistData}
                      songs={songs}
                    />
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}

export default Album
