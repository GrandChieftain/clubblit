import './App.css';
import Home from "./home.js";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";


export default function App() {
  return (
    <div className="App">
      <Home />
    </div>
  );
}
