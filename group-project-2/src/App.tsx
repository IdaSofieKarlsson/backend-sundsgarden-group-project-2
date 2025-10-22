import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AllUsersPage from "./pages/AllUsersPage";
import UserOverviewPage from "./pages/UserOverviewPage";
import GamePage from "./pages/GamePage";
import DemoPage from "./pages/DemoPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

//implements { BrowserRouter }

function App() {
  return <>
  <BrowserRouter>
  <Header/>
  <Navbar></Navbar>
  <Routes>
    <Route path="/" element={<LoginPage/>}/>
    <Route path="/register" element={<RegisterPage/>}/>
    <Route path="/all-users" element={<AllUsersPage/>}/>
    <Route path="/user-overview" element={<UserOverviewPage/>}/>
    <Route path="/games" element={<GamePage/>}/>
    <Route path="/demo-page" element={<DemoPage/>}/>
  </Routes>
  <Footer />
  </BrowserRouter>
  </>
}

export default App;
