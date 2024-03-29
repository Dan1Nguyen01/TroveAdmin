import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useCreateAdmin } from "../../hooks/login & signup/useCreateAdmin";
import { useAuth } from "../../context/AuthContext";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { useApproveSong } from "../../hooks/approve/useApproveSong";
import { useApproveAlbum } from "../../hooks/approve/useApproveAlbum";
import { useApproveEP } from "../../hooks/approve/useApproveEP";
import { useRejectSingle } from "../../hooks/reject/useRejectSingle";
import { useRejectAlbum } from "../../hooks/reject/useRejectAlbum";
import { useRejectEP } from "../../hooks/reject/useRejectEP";
import { MusicContext } from "../../context/MusicContext";

const Admin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminName, setAdminName] = useState("");
  const [error, setError] = useState(null);

  const [show, setShow] = useState(false);
  const {
    displayMusicBar,
    updateDisplayMusicBar,

    currentSong,
    updateCurrentSong,

    play_list,
    play_listPosition,
    updatePlay_list,
    clearPlay_list,
    updatePlay_listPosition,

    queue,
    queuePosition,
    advanceQueue,
    addToQueue,
    updateQueuePosition,
    clearQueue,

    loopLevel,
    updateLoopLevel,

    isPlay_Global,
    toggleIsPlay_G,
    setIsPlay_Global,
  } = React.useContext(MusicContext);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleAdminNameChange = (event) => {
    setAdminName(event.target.value);
  };

  const { createAdmin, createError, createIsloading, message } =
    useCreateAdmin();

  const handleSubmit = (event) => {
    event.preventDefault();
    createAdmin(email, password, adminName);
    setEmail("");
    setPassword("");
    setAdminName("");
    try {
    } catch (error) {
      console.log(error);
    }
  };

  const currentAdmin = localStorage.getItem("admin");
  const { authAdmin, isLoggedIn } = useAuth();

  const { approveSong, approveError, approveIsLoading } = useApproveSong();

  //fetch unverified data
  const [single, setSingle] = React.useState([]);

  const fetchUSingles = async () => {
    const response = await fetch("/api/songs/unverified", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const json = await response.json();
    if (!response.ok) {
      return;
    }
    if (response.ok) {
      setSingle(json);
    }
  };
  React.useEffect(() => {
    fetchUSingles();
  }, [approveIsLoading || rejectAlbumIsLoading]);

  const { approveAlbum, approveAlbumError, setApproveAlbumIsLoading } =
    useApproveAlbum();
  const [albums, setAlbums] = React.useState([]);

  const fetchUAlbums = async () => {
    const response = await fetch("/api/albums/unverified", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const json = await response.json();
    if (!response.ok) {
      return;
    }
    if (response.ok) {
      setAlbums(json);
    }
  };
  React.useEffect(() => {
    fetchUAlbums();
  }, [approveIsLoading || rejectAlbumIsLoading]);

  const [eps, setEPs] = React.useState([]);
  const { approveEP, approveEPError, setApproveEPIsLoading } = useApproveEP();

  const fetchUEPs = async () => {
    const response = await fetch("/api/eps/unverified", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const json = await response.json();
    if (!response.ok) {
      return;
    }
    if (response.ok) {
      setEPs(json);
    }
  };
  React.useEffect(() => {
    fetchUEPs();
  }, [approveIsLoading || rejectAlbumIsLoading]);

  const {
    rejectSingle,
    rejectSingleError,
    rejectSingleIsLoading,
    rejectSingleStatus,
  } = useRejectSingle();

  const {
    rejectAlbum,
    rejectAlbumError,
    rejectAlbumIsLoading,
    rejectAlbumStatus,
  } = useRejectAlbum();

  const { rejectEP, rejectEPError, rejectEPIsLoading, rejectEPStatus } =
    useRejectEP();
  const [singleMessage, setSingleMessage] = React.useState("");
  const [albumMessage, setAlbumMessage] = React.useState("");
  const [epMessage, setEPMessage] = React.useState("");

  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredSingle = single.filter(
    (single) =>
      single.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      single.artist.artistName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAlbums = albums.filter(
    (album) =>
      album.albumName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      album.artist.artistName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const epFiltered = eps.filter(
    (ep) =>
      ep.epName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ep.artist.artistName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  React.useEffect(() => {
    if (displayMusicBar == false) {
      updateDisplayMusicBar(true);
    }
  }, []);
  return (
    <>
      <Container>
        <h1>Songs Verification</h1>
        <Row>
          <Col md={8}>
            <Tabs>
              <TabList>
                <Tab>Songs</Tab>
                <Tab>Albums</Tab>
                <Tab>EPs</Tab>
              </TabList>
              <TabPanel>
                <h2>Single Songs</h2>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Search by title or artist name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <table class="table table-dark table-bordered ">
                  <thead>
                    {filteredSingle.length > 0 && (
                      <tr>
                        <th scope="col">Title</th>
                        <th scope="col">ARTIST</th>
                        <th scope="col">IMG</th>
                        <th scope="col">Approve</th>
                        <th scope="col">Reject</th>
                      </tr>
                    )}
                  </thead>
                  <tbody>
                    {filteredSingle?.map((singleSongs) => (
                      <tr key={singleSongs._id}>
                        <th>{singleSongs.title}</th>
                        <th>{singleSongs?.artist?.artistName}</th>
                        <th>
                          <img src={singleSongs.imgUrl} width={"50px"} alt="" />
                        </th>
                        <th>
                          <button
                            className="btn btn-success"
                            onClick={() => {
                              approveSong(singleSongs._id);
                            }}
                          >
                            Approve
                          </button>
                        </th>
                        <th>
                          <Button variant="danger" onClick={handleShow}>
                            Reject
                          </Button>

                          <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                              <Modal.Title>Reject Single Song</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              <div class="form-group">
                                <label for="exampleFormControlTextarea1">
                                  Feed back
                                </label>
                                <textarea
                                  class="form-control"
                                  id="exampleFormControlTextarea1"
                                  rows="3"
                                  onChange={(e) =>
                                    setSingleMessage(e.target.value)
                                  }
                                  value={singleMessage}
                                ></textarea>
                              </div>
                            </Modal.Body>
                            <Modal.Footer>
                              <Button variant="secondary" onClick={handleClose}>
                                Close
                              </Button>
                              <Button
                                variant="danger"
                                onClick={() => {
                                  rejectSingle(singleSongs._id, singleMessage);
                                }}
                              >
                                Save Changes
                              </Button>
                            </Modal.Footer>
                          </Modal>
                        </th>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TabPanel>
              <TabPanel>
                <h2>Album</h2>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Search by title or artist name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <table class="table table-dark table-bordered ">
                  <thead>
                    {filteredAlbums.length > 0 && (
                      <tr>
                        <th scope="col">Title</th>
                        <th scope="col">ARTIST</th>
                        <th scope="col">IMG</th>
                        <th scope="col">Approve</th>
                        <th scope="col">Reject</th>
                      </tr>
                    )}
                  </thead>
                  <tbody>
                    {filteredAlbums?.map((album) => (
                      <tr key={album._id}>
                        <th>{album?.albumName}</th>
                        <th>{album?.artist?.artistName}</th>
                        <th>
                          <img src={album.albumArt} width={"50px"} alt="" />
                        </th>
                        <th>
                          <button
                            className="btn btn-success"
                            onClick={() => {
                              approveAlbum(album._id);
                            }}
                          >
                            Approve
                          </button>
                        </th>
                        <th>
                          <Button variant="danger" onClick={handleShow}>
                            Reject
                          </Button>

                          <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                              <Modal.Title>Reject Album</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              <div class="form-group">
                                <label for="exampleFormControlTextarea1">
                                  Feed back
                                </label>
                                <textarea
                                  class="form-control"
                                  id="exampleFormControlTextarea1"
                                  rows="3"
                                  onChange={(e) => {
                                    setAlbumMessage(e.target.value);
                                  }}
                                  value={albumMessage}
                                ></textarea>
                              </div>
                            </Modal.Body>
                            <Modal.Footer>
                              <Button variant="secondary" onClick={handleClose}>
                                Close
                              </Button>
                              <Button
                                variant="danger"
                                onClick={() =>
                                  rejectAlbum(album._id, albumMessage)
                                }
                              >
                                Save Changes
                              </Button>
                            </Modal.Footer>
                          </Modal>
                        </th>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TabPanel>
              <TabPanel>
                <h2>EP</h2>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Search by title or artist name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <table class="table table-dark table-bordered ">
                  <thead>
                    {epFiltered.length > 0 && (
                      <tr>
                        <th scope="col">Title</th>
                        <th scope="col">ARTIST</th>
                        <th scope="col">IMG</th>
                        <th scope="col">Approve</th>
                        <th scope="col">Reject</th>
                      </tr>
                    )}
                  </thead>
                  <tbody>
                    {epFiltered?.map((ep) => (
                      <tr key={ep._id}>
                        <th>{ep?.epName}</th>
                        <th>{ep?.artist?.artistName}</th>
                        <th>
                          <img src={ep?.epArt} width={"50px"} alt="" />
                        </th>
                        <th>
                          {" "}
                          <button
                            className="btn btn-success"
                            onClick={() => {
                              approveEP(ep._id);
                              fetchUEPs();
                            }}
                          >
                            Approve
                          </button>
                        </th>
                        <th>
                          <Button variant="danger" onClick={handleShow}>
                            Reject
                          </Button>

                          <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                              <Modal.Title>Reject EP</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              <div class="form-group">
                                <label for="exampleFormControlTextarea1">
                                  Feed back
                                </label>
                                <textarea
                                  class="form-control"
                                  id="exampleFormControlTextarea1"
                                  rows="3"
                                  onChange={(e) => setEPMessage(e.target.value)}
                                  value={epMessage}
                                ></textarea>
                              </div>
                            </Modal.Body>
                            <Modal.Footer>
                              <Button variant="secondary" onClick={handleClose}>
                                Close
                              </Button>
                              <Button
                                variant="danger"
                                onClick={() => {
                                  rejectEP(ep._id, epMessage);
                                  fetchUEPs();
                                }}
                              >
                                Save Changes
                              </Button>
                            </Modal.Footer>
                          </Modal>
                        </th>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TabPanel>
            </Tabs>
          </Col>
          <Col md={3} xs={12} className="mt-3 mt-md-0">
            <div className="bg-light p-3">
              <h3 className="text-center mb-4">Create Admin</h3>
              <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    required
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicAdminName">
                  <Form.Label>Admin Name</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Enter admin name"
                    value={adminName}
                    onChange={handleAdminNameChange}
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  const
                  onClick={handleSubmit}
                >
                  Create
                </Button>
                {message && <p>{message}</p>}
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Admin;
