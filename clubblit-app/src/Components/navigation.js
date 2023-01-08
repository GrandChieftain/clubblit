import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './navigation.css'
import { NavLink } from "react-router-dom";
import React, { useState } from "react";

export default function Navigation(){
    //Initializing a use state so we can detect when user clicks 
    // const [click, setClick] = useState(false);

    // const handleClick = () => setClick(!click);

    return (
    <nav>
        <h1 className="title"><span className="club">Club</span>ble</h1>
        <ul>
            <li className="links">Home</li>
            <li className="links">About</li>
            <li className="links">Services</li>
            <li className="links register">Log In</li>
            <li className="links register">Sign Up</li>
        </ul>
    </nav>
    )
}


