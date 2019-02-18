import React, { Component, createRef } from "react";

interface CameraProps {
  onLoad: (track: MediaStreamTrack, width: number, height: number) => void;
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
        width: { exact: 1280 },
        height: { exact: 720 },
        facingMode: "user"
      }
    });

    if (!this.videoPlayerRef.current) {
      throw new Error("No video player found");
    }

    const videoTrack = this.stream.getVideoTracks()[0];

    this.videoPlayerRef.current.srcObject = this.stream;

    this.videoPlayerRef.current.addEventListener("loadeddata", () => {
      if (!this.videoPlayerRef.current) {
        throw new Error("No video player found");
      }

      this.props.onLoad(
        videoTrack,
        this.videoPlayerRef.current.width,
        this.videoPlayerRef.current.height
      );
    });
  }

  render() {
    return (
      <video
        id="zoom-video-element"
        autoPlay
        playsInline
        ref={this.videoPlayerRef}
      />
    );
  }
}
