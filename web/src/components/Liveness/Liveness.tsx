import React, { Component } from "react";
import uuid from "uuid";
import { Camera } from "../Camera/Camera";
import { capture, initialize, enroll, EnrollmentResult } from "../../util/Zoom";

import "./Liveness.css";
import { Button } from "../Button/Button";

interface LivenessProps {
  name: string;
  onEnroll: (enrollmentResult: EnrollmentResult) => void;
}

interface LivenessState {
  cameraLoaded: boolean;
  captureInProgress: boolean;
  captureOutcome: any;
  enrollInProgress: boolean;
}

export class Liveness extends Component<LivenessProps, LivenessState> {
  state: LivenessState = {
    cameraLoaded: false,
    captureInProgress: false,
    captureOutcome: null,
    enrollInProgress: false
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
      enrollInProgress: false
    });

    const captureOutcome = await capture(this.track);

    this.setState({
      captureInProgress: false,
      captureOutcome,
      enrollInProgress: true
    });

    const enrollId = uuid.v4();

    const enrollOutcome = await enroll(captureOutcome, enrollId);

    this.setState({
      enrollInProgress: false
    });

    this.props.onEnroll(enrollOutcome);
  }

  render() {
    return (
      <div>
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
          !this.state.enrollInProgress && (
            <Button onClick={this.runCheck.bind(this)}>
              Start Face Verification
            </Button>
          )}

        {this.state.captureInProgress && <div>Capture in progress...</div>}

        {this.state.captureOutcome && (
          <div>
            <strong>Capture outcome:</strong> {this.state.captureOutcome.status}
          </div>
        )}

        {this.state.enrollInProgress && <div>Enroll in progress...</div>}
      </div>
    );
  }
}
