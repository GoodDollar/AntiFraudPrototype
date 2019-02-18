import React, { PureComponent } from "react";
import { Camera } from "../Camera/Camera";
import { prepareInterface, initialize } from "../../util/Zoom";

import "./Liveness.css";

export class Liveness extends PureComponent {
  state = {
    parentContainerWidth: 1280,
    parentContainerHeight: 720
  };

  async onCameraLoad(track: MediaStreamTrack, width: number, height: number) {
    await initialize();
    await prepareInterface(track);
  }

  render() {
    return (
      <div
        id="zoom-parent-container"
        style={{
          width: `${this.state.parentContainerWidth}px`,
          height: `${this.state.parentContainerHeight}px`
        }}
      >
        <div id="zoom-interface-container" />

        <Camera onLoad={this.onCameraLoad.bind(this)} />
      </div>
    );
  }
}
