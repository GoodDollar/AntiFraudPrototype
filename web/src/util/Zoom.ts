declare var ZoomSDK: any;

const licenseKey = process.env.REACT_APP_ZOOM_LICENSE_KEY;

export const initialize = (): Promise<void> =>
  new Promise(resolve => {
    ZoomSDK.initialize(licenseKey, () => ZoomSDK.preload(() => resolve()));
  });

export const prepareInterface = (videoTrack: MediaStreamTrack): Promise<void> =>
  new Promise((resolve, reject) => {
    ZoomSDK.prepareInterface(
      "zoom-interface-container",
      "zoom-video-element",
      (prepareInterfaceResult: any) => {
        if (
          prepareInterfaceResult !==
          ZoomSDK.ZoomTypes.ZoomPrepareInterfaceResult.Success
        ) {
          return reject(
            new Error(
              `unable to prepare zoom interface: ${prepareInterfaceResult}`
            )
          );
        }

        const zoomSession = new ZoomSDK.ZoomSession(
          (x: any) => console.log(x),
          videoTrack
        );

        zoomSession.capture();

        resolve();
      }
    );
  });
