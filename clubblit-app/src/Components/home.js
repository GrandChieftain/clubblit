import React from 'react';
import './home.css';
import Navigation from './navigation.js';
//Importing route to link different pages together 
// import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';


export default function Home() {
  return (
    <section className="bg-blue-100 container-center pt-[50px] py-[570px]">
      <div className="flex container mx-auto justify-center">
        <h1 className="text-3xl font-bold text-[#3b9af0]">Empowering college clubs {'\n'} in one place...</h1>
      </div>
    </section>
  );  
}