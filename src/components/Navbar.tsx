import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "./UserContext";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
    const{ user, logout } = useUser();
    const navigator = useNavigate();
    
    const handleLogout = () => {
        logout();
        navigator("/");
    }
    return(
        <nav>
            <ul>
                <li>
                   <Link to="/">Feed</Link> 
                </li>
                <li>
                   <Link to="/search">Search</Link> 
                </li>
                <li>
                   <Link to="/profile">Profile</Link> 
                </li>
                <li>
                   <button onClick={handleLogout}></button>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;