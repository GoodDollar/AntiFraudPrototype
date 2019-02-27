import React, { Component, createRef } from "react";
import uuid from "uuid";
import { Camera } from "../Camera/Camera";
import { capture, initialize, enroll, EnrollmentResult } from "../../util/Zoom";

import "./Liveness.css";
import { Button } from "../Button/Button";

interface LivenessProps {
  onEnroll: (enrollmentResult: EnrollmentResult) => void;
}

interface LivenessState {
  cameraShown: boolean;
  captureInProgress: boolean;
  captureError?: Error;
  enrollInProgress: boolean;
}

export class Liveness extends Component<LivenessProps, LivenessState> {
  state: LivenessState = {
    cameraShown: false,
    captureInProgress: false,
    enrollInProgress: false
  };

  private readonly containerRef = createRef<HTMLDivElement>();
  private width = 1280;
  private height = 0;

  async componentDidMount() {
    const containerWidth =
      (this.containerRef &&
        this.containerRef.current &&
        this.containerRef.current.offsetWidth) ||
      this.width;
    this.width = Math.min(this.width, containerWidth);
    this.height =
      window.innerHeight > window.innerWidth
        ? this.width * 1.77777778
        : this.width * 0.5625;

    await initialize();
  }

  async onCameraLoad(track: MediaStreamTrack) {
    this.setState({
      captureInProgress: true,
      enrollInProgress: false
    });

    let captureOutcome;

    try {
      captureOutcome = await capture(track);
    } catch (e) {
      this.setState({
        captureInProgress: false,
        captureError: e,
        cameraShown: false
      });
      return;
    }

    this.setState({
      captureInProgress: false,
      enrollInProgress: true,
      cameraShown: false
    });

    const enrollId = uuid.v4();
    const enrollOutcome = await enroll(captureOutcome, enrollId);

    this.props.onEnroll(enrollOutcome);
  }

  render() {
    return (
      <div ref={this.containerRef}>
        {this.state.cameraShown && (
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
        )}

        {!this.state.cameraShown &&
          !this.state.captureError &&
          !this.state.enrollInProgress && (
            <>
              <p>
                In order for us to confirm your identity, we need to take some
                video of your face. If you're happy to do this, press the button
                below.
              </p>
              <Button onClick={() => this.setState({ cameraShown: true })}>
                Start Face Verification
              </Button>
            </>
          )}

        {this.state.captureError && (
          <>
            <p>
              An error occurred while attempting to capture video of your face:
            </p>
            {this.state.captureError.message}
          </>
        )}

        {this.state.enrollInProgress && <div>Analysing...</div>}
      </div>
    );
  }
}
