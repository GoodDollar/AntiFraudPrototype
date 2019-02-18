import React, { Component, createRef } from "react";

interface CameraProps {
  width: number;
  height: number;
  onLoad: (track: MediaStreamTrack) => void;
}

export class Camera extends Component<CameraProps> {
  private videoPlayerRef = createRef<HTMLVideoElement>();
  private stream: MediaStream | null = null;

  async componentDidMount() {
    await this.getUserMedia();
  }

  async getUserMedia() {
    this.stream = await window.navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        width: { exact: this.props.width },
        height: { exact: this.props.height },
        facingMode: "user"
      }
    });

    if (!this.videoPlayerRef.current) {
      throw new Error("No video player found");
    }

    const videoTrack = this.stream.getVideoTracks()[0];

    this.videoPlayerRef.current.srcObject = this.stream;

    this.videoPlayerRef.current.addEventListener("loadeddata", () => {
      this.props.onLoad(videoTrack);
    });
  }

  render() {
    return (
      <video
        id="zoom-video-element"
        autoPlay
        playsInline
        ref={this.videoPlayerRef}
        style={{
          width: `${this.props.width}px`,
          height: `${this.props.height}px`
        }}
      />
    );
  }
}
