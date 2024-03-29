import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "./components/sidebar/Sidebar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashBoard from "./pages/dashboard/DashBoard";
import Users from "./pages/user/Users";
import Song from "./pages/song/Song";
import Album from "./pages/album/Album";
import EP from "./pages/ep/EP";
import Curated from "./pages/curated/Curated";
import Home from "./pages/home/Home";
import Artist from "./pages/artist/Artist";
import Admin from "./pages/admin/Admin";
import AdminLogin from "./pages/login/AdminLogin";
import ErrorPage from "./pages/error/ErrorPage";
import { useAuth } from "./context/AuthContext";
import { Navigate } from "react-router-dom";

import AdminMusicBar from "./components/adminMusicBar/adminMusicBar";

const App = () => {
  const { authAdmin, isLoggedIn } = useAuth();

  const troveAdminToken = localStorage.getItem("TroveAdminToken");
  return (
    <BrowserRouter>
      <Container fluid className="bg-secondary min-vh-100">
        <Row>
          {troveAdminToken ? (
            <Col
              xs={12}
              md={2}
              className="bg-light vh-100 position-fixed"
              style={{ left: 0, top: 0 }}
              sm={3} // Set the width to 3 columns on sm screens
            >
              <Sidebar />
            </Col>
          ) : null}

          <Col
            xs={12}
            md={10}
            className="min-vh-100"
            style={{ marginLeft: "16.6666667%" }}
          >
            <Routes>
              <Route
                path="/dashboard"
                element={troveAdminToken ? <DashBoard /> : <Navigate to="/" />}
              />
              <Route
                path="/user"
                element={troveAdminToken ? <Users /> : <Navigate to="/" />}
              />
              <Route
                path="/artist"
                element={troveAdminToken ? <Artist /> : <Navigate to="/" />}
              />
              <Route
                path="/song"
                element={troveAdminToken ? <Song /> : <Navigate to="/" />}
              />
              <Route
                path="/album"
                element={troveAdminToken ? <Album /> : <Navigate to="/" />}
              />
              <Route
                path="/ep"
                element={troveAdminToken ? <EP /> : <Navigate to="/" />}
              />
              <Route
                path="/collection"
                element={troveAdminToken ? <Curated /> : <Navigate to="/" />}
              />
              <Route
                path="/admin"
                element={troveAdminToken ? <Admin /> : <Navigate to="/login" />}
              />
              <Route
                path="/"
                element={troveAdminToken ? <DashBoard /> : <AdminLogin />}
              />
              <Route 
                path="*" 
                element={<ErrorPage />}>
              </Route>
            </Routes>
          </Col>
          <Col>
          <AdminMusicBar/>
          </Col>
        </Row>  
      </Container>
    </BrowserRouter>
  );
};

export default App;
