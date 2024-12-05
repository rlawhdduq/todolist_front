import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import { UserProvider, useUser } from "./components/UserContext";

import Feed from "./pages/Feed";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import Todolist from "./test/Todolist";
import ViteIntro from "./test/ViteIntro";
import Login from "./pages/Login";
import Write from "./pages/board/Write";
import Detail from "./pages/board/Detail";

// import "./App.css";

const App: React.FC = () => {
  return (
    <UserProvider>
    <Router>
      <Navbar />
      <Routes>
        {/* 로그인 페이지 */}
        <Route path="/login" element={<IsLogin />} />

        {/* 로그인 후 접근할 수 있는 페이지 */}
        <Route path="/search" element={<PrivateRoute component={Search} />} />
        <Route path="/profile" element={<PrivateRoute component={Profile} />} />
        <Route path="/todolist" element={<PrivateRoute component={Todolist} />} />
        <Route path="/viteintro" element={<PrivateRoute component={ViteIntro} />} />
        <Route path="/write" element={<PrivateRoute component={Write} />} />
        <Route path="/write/:postId" element={<PrivateRoute component={Write} />} />
        <Route path="/detail" element={<PrivateRoute component={Detail} />} />

        {/* 기본 페이지 */}
        <Route path="/" element={<PrivateRoute component={Feed} />} />
      </Routes>
    </Router>
    </UserProvider>
  );
};

const IsLogin: React.FC = () => {
  const{ user }  = useUser();
  return user ? <Navigate to ="/" /> : <Login />;
}
type PrivateRouteProps = {
  component: React.ComponentType;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component }) => {
  const{ user, loading } = useUser();
  return user !== null ? <Component /> : <Navigate to="/login" />;
};

export default App;