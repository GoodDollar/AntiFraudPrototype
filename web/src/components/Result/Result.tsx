import React, { Component } from "react";
import { EnrollmentResult, search } from "../../util/Zoom";

interface ResultProps {
  name?: string;
  email?: string;
  enrollmentResult: EnrollmentResult;
}

interface ResultState {
  searchResults?: any;
}

export class Result extends Component<ResultProps, ResultState> {
  state: ResultState = {
    searchResults: null
  };

  async componentDidMount() {
    if (!this.didPassLiveness) {
      return;
    }

    const searchResults = await (await fetch("http://localhost:3001/users", {
      method: "POST",
      body: JSON.stringify({
        name: this.props.name,
        email: this.props.email,
        zoom_enrollment_id: this.props.enrollmentResult.data
          .enrollmentIdentifier,
        zoom_session_id: this.props.enrollmentResult.sessionId,
        audit_trail_image: this.props.enrollmentResult.auditTrailImage
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })).json();

    this.setState({ searchResults });
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

        {this.state.searchResults && (
          <div>
            <strong>Search Results:</strong>
            <br />
            <code>${JSON.stringify(this.state.searchResults, null, 2)}</code>
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
