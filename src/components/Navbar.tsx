import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
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
            </ul>
        </nav>
    );
};

export default Navbar;