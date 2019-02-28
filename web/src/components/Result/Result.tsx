import React, { Component } from "react";
import { EnrollmentResult, search } from "../../util/Zoom";
import { Error } from "../Error/Error";
import { Button } from "../Button/Button";

interface ResultProps {
  name?: string;
  email?: string;
  enrollmentResult: EnrollmentResult;
  handleReset: () => void;
}

interface ResultState {
  registerResult?: {
    errors?: string[];
    id?: string;
    name?: string;
    email?: string;
  };
}

export class Result extends Component<ResultProps, ResultState> {
  state: ResultState = {};

  async componentDidMount() {
    if (!this.didPassLiveness) {
      return;
    }

    const registerResult = await (await fetch(
      `${process.env.REACT_APP_API_URL}/users`,
      {
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
      }
    )).json();

    this.setState({ registerResult });
  }

  render() {
    return (
      <div>
        {!this.didPassLiveness && (
          <Error
            errors={[
              "Your registration attempt did not pass the liveness test"
            ]}
          />
        )}

        {this.didPassLiveness && !this.state.registerResult && (
          <p>Registering...</p>
        )}

        {this.state.registerResult && this.state.registerResult.errors && (
          <Error errors={this.state.registerResult.errors} />
        )}

        {this.state.registerResult && !this.state.registerResult.errors && (
          <>
            <p>Your registration was successful.</p>

            <p>
              <strong>ID:</strong> {this.state.registerResult.id}
            </p>
            <p>
              <strong>Name:</strong> {this.state.registerResult.name}
            </p>
            <p>
              <strong>Email:</strong> {this.state.registerResult.email}
            </p>
          </>
        )}

        {!this.didPassLiveness ||
          (this.state.registerResult && (
            <Button onClick={this.props.handleReset}>Try Again</Button>
          ))}
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
