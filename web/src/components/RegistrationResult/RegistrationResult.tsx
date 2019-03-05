import React, { Component } from "react";
import { ZoomCaptureResult } from "../../util/Zoom";
import { ApiResponse, ApiClient, ApiError } from "../../util/ApiClient";
import { ErrorList } from "../ErrorList/ErrorList";

interface RegistrationResultProps {
  result: ZoomCaptureResult;
}

interface RegistrationResultState {
  loading: boolean;
  apiResult?: ApiResponse<unknown>;
  apiError?: ApiError;
}

export class RegistrationResult extends Component<
  RegistrationResultProps,
  RegistrationResultState
> {
  private readonly client = new ApiClient();

  state: RegistrationResultState = {
    loading: true
  };

  async componentDidMount() {
    try {
      this.setState({
        loading: false,
        apiResult: await this.client.enroll({
          sessionId: this.props.result.sessionId,
          facemap: this.props.result.facemap,
          auditTrailImage: this.props.result.faceMetrics.auditTrail[0]
        })
      });
    } catch (apiError) {
      this.setState({
        loading: false,
        apiError
      });
    }
  }

  render() {
    if (this.state.loading) {
      return <p>Loading...</p>;
    }

    if (this.state.apiError) {
      return <ErrorList errors={[this.state.apiError.message]} />;
    }

    return <div>{JSON.stringify(this.state.apiResult)}</div>;
  }
}
