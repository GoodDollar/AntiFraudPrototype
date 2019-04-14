import React, { Component } from "react";
import { ZoomCaptureResult } from "../../util/Zoom";
import {
  ApiResponse,
  ApiClient,
  ApiError,
  EnrollResponse,
  Reply
} from "../../util/ApiClient";

interface RegistrationResultProps {
  name: string;
  email: string;
  result: ZoomCaptureResult;
  onApiError: (error: ApiError) => void;
  printSimilarUsersResults: (apiResult:any) => JSX.Element;
}

interface RegistrationResultState {
  loading: boolean;
  apiResult?: ApiResponse<Reply>;
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
          email: this.props.email,
          name: this.props.name,
          sessionId: this.props.result.sessionId,
          facemap: this.props.result.facemap,
          auditTrailImage: this.props.result.auditTrailImage
        })
      });
    } catch (apiError) {
      this.props.onApiError(apiError);
    }
  }



  render() {
    if (this.state.loading) {
      return <p>Loading...</p>;
    }
    let results = this.state.apiResult
    return this.props.printSimilarUsersResults(results)
  }
}