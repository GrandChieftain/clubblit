import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './navigation.css'
import { NavLink } from "react-router-dom";
import React, { useState } from "react";
import profileIcon from '../Images/profile.png'

export default function Navigation(){
    //Initializing a use state so we can detect when user clicks 
    // const [click, setClick] = useState(false);

    // const handleClick = () => setClick(!click);

    return (
    <nav>
        <h1 className="title"><span className="clu">Clu</span>Bubble</h1>
        <ul>
            <a><li className="links">Home</li></a>
            <a><li className="links">About</li></a>
            <a><li className="links">Services</li></a>
            <a><li className="links register">Log In</li></a>
            <a><li className="links register">Sign Up</li></a>
        </ul>
        <div className="profile">
            <img src={profileIcon} className="profile-icon"></img>
            <span className="profile-name">User</span>
        </div>
    </nav>
    )
}


