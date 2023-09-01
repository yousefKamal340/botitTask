import Landing from "./Components/Landing";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Components/Login";
import Main from "./Components/main";
import React from "react";

function App() {
  return (
    <Router>
        <Routes>
          <Route exact path="/register" element={<Landing />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/usersWallet" element={<Main />} />
        </Routes>
    </Router>
  );
}

export default App;
