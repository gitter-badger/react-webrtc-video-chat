import React, { Component } from "react";
import "./App.css";
import "semantic-ui-css/semantic.min.css";
import Navbar from "./components/Navbar";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar />
      </div>
    );
  }
}

export default App;
