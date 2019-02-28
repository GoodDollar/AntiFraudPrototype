import React, { Component } from "react";
import { Liveness } from "./components/Liveness/Liveness";
import styled from "styled-components";
import { Form } from "./components/Form/Form";
import { EnrollmentResult, initialize } from "./util/Zoom";
import { Result } from "./components/Result/Result";

enum Mode {
  Register,
  Login
}

interface AppState {
  mode: Mode;
  name?: string;
  email?: string;
  enrollmentResult?: EnrollmentResult;
}

export class App extends Component<{}, AppState> {
  state: AppState = {
    mode: Mode.Register
  };

  async componentDidMount() {
    await initialize();
  }

  render() {
    return (
      <Wrapper>
        <Header>
          GoodDollar Anti-Fraud Prototype
          <Nav>
            <NavLink onClick={() => this.setState({ mode: Mode.Register })}>
              Register
            </NavLink>
            {/* <NavLink onClick={() => this.setState({ mode: Mode.Login })}>
              Log In
            </NavLink> */}
          </Nav>
        </Header>

        {this.state.mode === Mode.Register && (
          <>
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
                handleReset={this.handleReset.bind(this)}
              />
            )}
          </>
        )}

        {this.state.mode === Mode.Login && (
          <>
            <p>Coming soon.</p>
          </>
        )}
      </Wrapper>
    );
  }

  handleReset() {
    this.setState({ enrollmentResult: undefined });
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
  display: flex;
`;

const Nav = styled.nav`
  margin-left: auto;
`;

const NavLink = styled.a`
  font-weight: normal;
  margin-left: 1rem;
  cursor: pointer;
`;
