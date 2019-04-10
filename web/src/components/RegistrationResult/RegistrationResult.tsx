import React, { Component } from "react";
import { ZoomCaptureResult } from "../../util/Zoom";
import {
  ApiResponse,
  ApiClient,
  ApiError,
  EnrollResponse
} from "../../util/ApiClient";

interface RegistrationResultProps {
  name: string;
  email: string;
  result: ZoomCaptureResult;
  onApiError: (error: ApiError) => void;
}

interface RegistrationResultState {
  loading: boolean;
  apiResult?: ApiResponse<EnrollResponse>;
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
      this.props.onApiError(apiError,this.prettifyResults);
    }
  }

  prettifyResults(results){
    return( 
      <div>
            {results["users_from_similar_enrollments"].map((r:any,i:number)=> <pre key={i}>{r}</pre>)}
      </div>)
    
  }
  render() {
    if (this.state.loading) {
      return <p>Loading...</p>;
    }

    let similar_results:any = this.state.apiResult? this.state.apiResult.body? this.state.apiResult.body:{}:{}

    return (this.prettifyResults(similar_results));
  }
}
