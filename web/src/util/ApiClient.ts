enum ApiMethod {
  Get = "GET",
  Post = "POST",
  Patch = "PATCH",
  Put = "PUT",
  Delete = "DELETE"
}

export class ApiError extends Error {}

export interface ApiRequest<Body> {
  method: ApiMethod;
  endpoint: string;
  body: Body;
}

export interface ApiResponse<Reply> {
  status: number;
  headers: Headers;
  body: Reply;
}

export interface EnrollRequest {
  name: string;
  email: string;
  sessionId: string;
  facemap: Blob;
  auditTrailImage: Blob;
}

export interface EnrollResponse {}
export interface EnrollmentsResponse {}

export interface LoginRequest {
  email: string;
  sessionId: string;
  facemap: Blob;
  auditTrailImage: Blob;
}

export interface LoginResponse {}

export class ApiClient {
  private readonly baseUrl =
    process.env.REACT_APP_API_URL || "http://localhost:3001";

    async enroll(e: EnrollRequest): Promise<ApiResponse<EnrollResponse>> {
    const request: ApiRequest<EnrollRequest> = {
      method: ApiMethod.Post,
      endpoint: "/users",
      body: e
    };

    return this.request(request);
  }

  async login(e: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const request: ApiRequest<LoginRequest> = {
      method: ApiMethod.Post,
      endpoint: "/users/login",
      body: e
    };

    return this.request(request);
  }

  private async request<Body, Reply>(
    req: ApiRequest<Body | { [x: string]: string | Blob }>
  ): Promise<ApiResponse<Reply>> {
    const opts: RequestInit = {
      method: req.method
    };

    if (req.method !== ApiMethod.Get && req.body) {
      const formData = new FormData();

      Object.entries(req.body).forEach(pair => {
        const key = pair[0];
        const value = pair[1];

        formData.append(
          // camelCase to snake_case
          key
            .split(/(?=[A-Z])/)
            .join("_")
            .toLowerCase(),
          value
        );
      });

      opts.body = formData;
    }

    const response = await fetch(`${this.baseUrl}${req.endpoint}`, opts);

    if (
      response.status !== 200 &&
      response.status !== 201 &&
      response.status !== 204
    ) {
      throw new ApiError(`HTTP ${response.status}: ${await response.text()}`);
    }

    const json = await response.json();

    const output: ApiResponse<Reply> = {
      status: response.status,
      headers: response.headers,
      body: json
    };

    return output;
  }
}
