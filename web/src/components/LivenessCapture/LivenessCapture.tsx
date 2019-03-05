import React, { Component, createRef } from "react";
import { Camera } from "../Camera/Camera";
import { capture, ZoomCaptureResult } from "../../util/Zoom";
import { Button } from "../Button/Button";
import "./LivenessCapture.css";

interface LivenessCaptureProps {
  onCaptureComplete: (captureResult: ZoomCaptureResult) => void;
  onCaptureError: (captureError: Error) => void;
}

interface LivenessCaptureState {
  cameraShown: boolean;
}

export class LivenessCapture extends Component<
  LivenessCaptureProps,
  LivenessCaptureState
> {
  state: LivenessCaptureState = {
    cameraShown: false
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
  }

  async onCameraLoad(track: MediaStreamTrack) {
    let captureOutcome: ZoomCaptureResult;

    try {
      captureOutcome = await capture(track);
    } catch (e) {
      return this.props.onCaptureError(e);
    }

    this.props.onCaptureComplete(captureOutcome);
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

        {!this.state.cameraShown && (
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
      </div>
    );
  }
}
