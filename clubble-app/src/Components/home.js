import React from 'react';
import './home.css';
import Navigation from './navigation.js';
//Importing route to link different pages together 
// import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';


export default function Home() {
  return (
    <div class="home">
      <Navigation />
    </div>
  );
}