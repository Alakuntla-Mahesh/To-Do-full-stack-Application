import { Component } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";


class App extends Component {
  render() {
    return (
      <>
        <Router>
          <Routes>

            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

          </Routes>
        </Router>
      </>
    );
  }
}

export default App;
