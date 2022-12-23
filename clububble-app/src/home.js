import React from 'react';
import './home.css';
import './navigation';
//Importing route to link different pages together 
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';


function Home() {
  return (
    <div>
      <navigation />
      
    </div>

  );
}

export default Home;