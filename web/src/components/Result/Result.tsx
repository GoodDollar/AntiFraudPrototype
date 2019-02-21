import React, { Component } from "react";
import { EnrollmentResult, search } from "../../util/Zoom";

interface ResultProps {
  enrollmentResult: EnrollmentResult;
}

interface ResultState {
  matchResults: any;
}

export class Result extends Component<ResultProps> {
  async componentDidMount() {
    if (!this.didPassLiveness) {
      return;
    }

    // const searchResults = await search(this.props.enrollmentResult);

    // console.log(searchResults);
  }

  render() {
    return (
      <div>
        <div>
          <strong>Liveness Result:</strong>{" "}
          {this.didPassLiveness ? "Passed" : "Uncertain"}
        </div>

        {this.enrollmentError && (
          <div>
            <strong>Enrollment Error:</strong> {this.enrollmentError}
          </div>
        )}
      </div>
    );
  }

  private get enrollmentError() {
    if (this.props.enrollmentResult.meta.ok) {
      return null;
    }

    return this.props.enrollmentResult.meta.message || "Unknown error";
  }

  private get didPassLiveness() {
    return (
      !this.enrollmentError &&
      this.props.enrollmentResult.data.livenessResult === "passed"
    );
  }
}
