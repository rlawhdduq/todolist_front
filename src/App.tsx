import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import { UserProvider } from "./components/UserContext";

import Feed from "./pages/Feed";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import Todolist from "./test/Todolist";
import ViteIntro from "./test/ViteIntro";
import Login from "./pages/Login";
// import "./App.css";

const isLogin = () => {
  const userData = sessionStorage.getItem("user");
  return userData !== null;
};

const App: React.FC = () => {
  useEffect(()=> {

  }, []);

  return (
    <UserProvider>
    <Router>
      <Navbar />
      <Routes>
        {/* 로그인 페이지 */}
        <Route path="/login" element={!isLogin() ? <Login /> : <Navigate to ="/"/>} />

        {/* 로그인 후 접근할 수 있는 페이지 */}
        <Route path="/search" element={<PrivateRoute component={Search} />} />
        <Route path="/profile" element={<PrivateRoute component={Profile} />} />
        <Route path="/todolist" element={<PrivateRoute component={Todolist} />} />
        <Route path="/viteintro" element={<PrivateRoute component={ViteIntro} />} />

        {/* 기본 페이지 */}
        <Route path="/" element={<PrivateRoute component={Feed} />} />
      </Routes>
    </Router>
    </UserProvider>
  );
};

type PrivateRouteProps = {
  component: React.ComponentType;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component }) => {
  return isLogin() ? <Component /> : <Navigate to="/login" />;
};

export default App;