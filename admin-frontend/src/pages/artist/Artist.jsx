import React from "react";
import ArtistModal from "../../components/modals/artist modal/ArtistModal";
import { MusicContext } from '../../context/MusicContext';

const Artist = () => {
  const [artists, setArtist] = React.useState([]);
  const [errors, setErrors] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState(""); // Add state for search term

  const allArtists = React.useEffect(() => {
    const fetchAlbums = async () => {
      const response = await fetch("/api/artists", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const json = await response.json();
      if (!response.ok) {
        setErrors(json.error);
        return;
      }

      if (response.ok) {
        setArtist(json);
      }
    };
    fetchAlbums();
  }, []);
 
  const {
      displayMusicBar,
      updateDisplayMusicBar,
  
      currentSong,
      updateCurrentSong,
      isPlay_Global,
      toggleIsPlay_G,
      setIsPlay_Global,
    } = React.useContext(MusicContext)
  
  // Filter artists based on search term
  const filteredArtists = artists.filter(
    (artist) =>
      artist.artistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artist.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  React.useEffect(() => {
    if(displayMusicBar == true){
      setIsPlay_Global(false);
      updateDisplayMusicBar(false);
    }
  },[]);
  return (
    <div className="container">
      <h1 className="text-light">Artist Manager</h1>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by name or email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Update search term state
      />
      {filteredArtists?.length > 0 && (
        <>
          <table className="table table-dark table-bordered ">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">IMG</th>
                <th scope="col">NAME</th>
                <th scope="col">EMAIL</th>
                <th scope="col">GENDER</th>
                <th scope="col">EDIT</th>
              </tr>
            </thead>
            <tbody>
              {filteredArtists?.map((artist) => (
                <tr key={artist._id}>
                  <th scope="row">{artist._id}</th>
                  <th>
                    <img src={artist.artistImg} width={"50px"} alt="" />
                  </th>
                  <th>{artist.artistName}</th>
                  <th>{artist?.email}</th>
                  <th>{artist?.gender}</th>
                  <th>
                    <ArtistModal artist={artist} />
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Artist;
