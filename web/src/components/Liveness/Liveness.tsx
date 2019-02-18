import React, { Component } from "react";
import { Camera } from "../Camera/Camera";
import { capture, initialize, check } from "../../util/Zoom";

import "./Liveness.css";

interface LivenessState {
  cameraLoaded: boolean;
  captureInProgress: boolean;
  captureOutcome: any;
  checkInProgress: boolean;
  checkOutcome: any;
}

export class Liveness extends Component<{}, LivenessState> {
  state: LivenessState = {
    cameraLoaded: false,
    captureInProgress: false,
    captureOutcome: null,
    checkInProgress: false,
    checkOutcome: null
  };

  private readonly width = 1280;
  private readonly height = 720;
  private track: MediaStreamTrack | null = null;

  async onCameraLoad(track: MediaStreamTrack) {
    await initialize();

    this.track = track;

    this.setState({ cameraLoaded: true });
  }

  async runCheck() {
    if (!this.track) {
      throw new Error("No media track");
    }

    this.setState({
      captureInProgress: true,
      captureOutcome: null,
      checkInProgress: false,
      checkOutcome: null
    });

    const captureOutcome = await capture(this.track);

    this.setState({
      captureInProgress: false,
      captureOutcome,
      checkInProgress: true
    });

    const checkOutcome = await check(captureOutcome);

    this.setState({
      checkInProgress: false,
      checkOutcome
    });
  }

  render() {
    return (
      <div className="Liveness">
        <div
          id="zoom-parent-container"
          style={{
            width: `${this.width}px`,
            height: `${this.height}px`
          }}
        >
          <div id="zoom-interface-container" />

          <Camera
            width={this.width}
            height={this.height}
            onLoad={this.onCameraLoad.bind(this)}
          />
        </div>

        {this.state.cameraLoaded &&
          !this.state.captureInProgress &&
          !this.state.checkInProgress && (
            <button
              className="Liveness__trigger"
              onClick={this.runCheck.bind(this)}
            >
              Start
            </button>
          )}

        {this.state.captureInProgress && <div>Capture in progress...</div>}

        {this.state.captureOutcome && (
          <div>
            <strong>Capture outcome:</strong> {this.state.captureOutcome.status}
          </div>
        )}

        {this.state.checkInProgress && <div>Check in progress...</div>}

        {this.state.checkOutcome && (
          <div>
            <strong>Check outcome:</strong>{" "}
            {JSON.stringify(this.state.checkOutcome.data)}
          </div>
        )}
      </div>
    );
  }
}
