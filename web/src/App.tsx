import React, { Component } from "react";
import { Liveness } from "./components/Liveness/Liveness";
import { initialize } from "./util/Zoom";

class App extends Component {
  render() {
    return (
      <>
        <Liveness />
      </>
    );
  }
}

export default App;
