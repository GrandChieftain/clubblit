import './App.css';
import Home from "./Components/home.js";
import Navigation from './Components/navigation.js'; 
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home/>}/>
        </Routes>
      </div>
    </Router>
  );
}
