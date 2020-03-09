import React from 'react';
import './App.css';
import {  Route } from "react-router-dom";
import  PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
// import Header from "./components/Header";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from './components/Dashboard';

export default function App() {
  return (
    <div className="App">
      <div className="home-page">
      {/* <Navbar /> */}
    </div>
      <Route path='/(Login|\/|)' component={Login} />
      <Route path="/Register" component={Register} /> 
      {/* If you're logged in automatically takes you to app home */}
      <PrivateRoute exact path='/(home|protected)/' component={Dashboard} />
    </div>
  );
}

