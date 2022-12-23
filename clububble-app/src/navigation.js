import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

export default function navigation(){
    return (
    <nav className="navigation">
        <h1 className="">Clubbable</h1>
        <ul>
            <a><li className="links">Home</li></a>
            <a><li className="links">About</li></a>
            <a><li className="links">Services</li></a>
        </ul>
        <div>
            <></>
        </div>
    </nav>
    )
}


