import { resolve } from "dns";

declare var ZoomSDK: any;

const licenseKey = process.env.REACT_APP_ZOOM_LICENSE_KEY || "";

export interface ZoomCaptureResult {
  status: any;
  sessionId: string;
  facemap: Blob;
  auditTrailImage: Blob;
  faceMetrics: {
    auditTrail: string[];
  };
}

const initialize = async (): Promise<void> =>
  new Promise((resolve, reject) => {
    if (!licenseKey) {
      return reject(
        new Error("No license key supplied in environment variable")
      );
    }

    ZoomSDK.initialize(licenseKey, (initializationSuccessful: boolean) => {
      if (initializationSuccessful) {
        resolve();
      }

      reject(
        new Error(`unable to initialize zoom sdk: ${ZoomSDK.getStatus()}`)
      );
    });
  });

const preload = async (): Promise<void> =>
  new Promise((resolve, reject) => {
    ZoomSDK.preload((preloadResult: any) => {
      if (preloadResult) {
        return resolve();
      }

      reject();
    });
  });

export const initializeAndPreload = async (): Promise<void> => {
  await initialize();
  await preload();
};

export const capture = async (
  videoTrack: MediaStreamTrack
): Promise<ZoomCaptureResult> =>
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
          (result: ZoomCaptureResult) => {
            if (
              result.status !==
                ZoomSDK.ZoomTypes.ZoomCaptureResult.SessionCompleted ||
              !result.facemap
            ) {
              return reject(
                new Error(`unsuccessful capture result: ${result.status}`)
              );
            }

            auditTrailImageToBlob(result.faceMetrics.auditTrail[0])
              .then(auditTrailImage => resolve({ ...result, auditTrailImage }))
              .catch(() => resolve(result));
          },
          videoTrack
        );

        zoomSession.capture();
      }
    );
  });

const auditTrailImageToBlob = async (auditTrailImage: string): Promise<Blob> =>
  (await fetch(auditTrailImage)).blob();
