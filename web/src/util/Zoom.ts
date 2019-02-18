declare var ZoomSDK: any;

const licenseKey = process.env.REACT_APP_ZOOM_LICENSE_KEY || "";

interface ZoomResult {
  status: any;
  sessionId: string;
  facemap: Blob;
}

export const initialize = (): Promise<void> =>
  new Promise(resolve => {
    ZoomSDK.initialize(licenseKey, () => ZoomSDK.preload(() => resolve()));
  });

export const capture = (videoTrack: MediaStreamTrack): Promise<ZoomResult> =>
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

        const zoomSession = new ZoomSDK.ZoomSession((result: ZoomResult) => {
          if (
            result.status !==
              ZoomSDK.ZoomTypes.ZoomCaptureResult.SessionCompleted ||
            !result.facemap
          ) {
            reject(new Error(`unsuccessful capture result: ${result.status}`));
          }

          resolve(result);
        }, videoTrack);

        zoomSession.capture();
      }
    );
  });

export const check = async (result: ZoomResult): Promise<any> => {
  const data = new FormData();
  data.append("sessionId", result.sessionId);
  data.append("facemap", result.facemap);

  const response = await fetch(
    "https://api.zoomauth.com/api/v1/biometrics/liveness",
    {
      method: "POST",
      body: data,
      headers: {
        "X-App-Token": licenseKey,
        "X-User-Agent": ZoomSDK.createZoomAPIUserAgentString(result.facemap)
      }
    }
  );

  return response.json();
};
