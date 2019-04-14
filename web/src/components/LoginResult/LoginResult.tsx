import React, { Component } from "react";
import { ZoomCaptureResult } from "../../util/Zoom";
import {
  ApiError,
  ApiResponse,
  ApiClient,
  LoginResponse
} from "../../util/ApiClient";

interface LoginResultProps {
  email: string;
  result: ZoomCaptureResult;
  onApiError: (error: ApiError) => void;
}

interface LoginResultState {
  loading: boolean;
  apiResponse?: ApiResponse<LoginResponse>;
}

export class LoginResult extends Component<LoginResultProps, LoginResultState> {
  private readonly client = new ApiClient();

  state: LoginResultState = {
    loading: true
  };

  async componentDidMount() {
    try {
      const apiResponse = await this.client.login({
        email: this.props.email,
        sessionId: this.props.result.sessionId,
        facemap: this.props.result.facemap,
        auditTrailImage: this.props.result.auditTrailImage
      });

      this.setState({
        loading: false,
        apiResponse
      });
    } catch (apiError) {
      this.props.onApiError(apiError);
    }
  }

  render() {
    if (this.state.loading) {
      return <p>Loading...</p>;
    }

    return <div>{JSON.stringify(this.state.apiResponse)}</div>;
  }
}