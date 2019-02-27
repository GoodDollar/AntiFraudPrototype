import React, { Component } from "react";
import { Liveness } from "./components/Liveness/Liveness";
import styled from "styled-components";
import { Form } from "./components/Form/Form";
import { EnrollmentResult } from "./util/Zoom";
import { Result } from "./components/Result/Result";

interface AppState {
  name?: string;
  email?: string;
  enrollmentResult?: EnrollmentResult;
}

export class App extends Component<{}, AppState> {
  state: AppState = {};

  render() {
    return (
      <Wrapper>
        <Header>GoodDollar Anti-Fraud Prototype</Header>
        {!this.state.name && (
          <Form onSubmit={this.handleFormSubmit.bind(this)} />
        )}
        {this.state.name &&
          this.state.email &&
          !this.state.enrollmentResult && (
            <Liveness onEnroll={this.handleEnroll.bind(this)} />
          )}
        {this.state.enrollmentResult && (
          <Result
            name={this.state.name}
            email={this.state.email}
            enrollmentResult={this.state.enrollmentResult}
          />
        )}
      </Wrapper>
    );
  }

  handleFormSubmit(name: string, email: string) {
    this.setState({ name, email });
  }

  handleEnroll(enrollmentResult: EnrollmentResult) {
    this.setState({ enrollmentResult });
  }
}

const Wrapper = styled.div`
  padding: 1rem;
`;

const Header = styled.header`
  font-weight: bold;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px #000 solid;
`;
