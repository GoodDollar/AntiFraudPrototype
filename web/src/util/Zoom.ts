declare var ZoomSDK: any;

const licenseKey = process.env.REACT_APP_ZOOM_LICENSE_KEY || "";

export interface ZoomResult {
  status: any;
  sessionId: string;
  facemap: Blob;
  faceMetrics: {
    auditTrail: string[];
  };
}

export interface EnrollmentResult {
  meta: {
    ok: boolean;
    message: string;
  };
  data: {
    enrollmentIdentifier: string;
    livenessResult: string;
    livenessScore: number;
    glassesScore: number;
    glassesDecision: boolean;
  };
  sessionId: string;
  auditTrailImage: string;
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

export const enroll = async (
  result: ZoomResult,
  id: string
): Promise<EnrollmentResult> => {
  const data = new FormData();
  data.append("enrollmentIdentifier", id);
  data.append("sessionId", result.sessionId);
  data.append("facemap", result.facemap);
  data.append(
    "auditTrailImage",
    await auditTrailImageToBlob(result.faceMetrics.auditTrail[0])
  );

  const response = await fetch(
    "https://api.zoomauth.com/api/v1/biometrics/enrollment",
    {
      method: "POST",
      body: data,
      headers: {
        "X-App-Token": licenseKey,
        "X-User-Agent": ZoomSDK.createZoomAPIUserAgentString(result.facemap)
      }
    }
  );

  const responseJson = await response.json();

  return {
    ...responseJson,
    sessionId: result.sessionId
  };
};

export const search = async ({
  data: { enrollmentIdentifier },
  sessionId
}: EnrollmentResult): Promise<any> => {
  const data = new FormData();
  data.append("enrollmentIdentifier", enrollmentIdentifier);
  data.append("sessionId", sessionId);

  const response = await fetch(
    "https://api.zoomauth.com/api/v1/biometrics/search",
    {
      method: "POST",
      body: data,
      headers: {
        "X-App-Token": licenseKey
      }
    }
  );

  return response.json();
};

const auditTrailImageToBlob = async (auditTrailImage: string): Promise<Blob> =>
  (await fetch(auditTrailImage)).blob();
