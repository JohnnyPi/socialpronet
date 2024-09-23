import React from 'react';
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";
import Mentorship from "./pages/Mentorship";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/create-post" component={CreatePost} />
          <Route path="/profile" component={Profile} />
          <Route path="/mentorship" component={Mentorship} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;