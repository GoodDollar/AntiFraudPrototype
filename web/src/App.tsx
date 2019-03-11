import React, { Component } from "react";
import styled from "styled-components";
import { RegistrationForm } from "./components/RegistrationForm/RegistrationForm";
import { initializeAndPreload, ZoomCaptureResult } from "./util/Zoom";
import { LivenessCapture } from "./components/LivenessCapture/LivenessCapture";
import { ErrorList } from "./components/ErrorList/ErrorList";
import { RegistrationResult } from "./components/RegistrationResult/RegistrationResult";
import { LoginForm } from "./components/LoginForm/LoginForm";
import { LoginResult } from "./components/LoginResult/LoginResult";

enum Mode {
  Register,
  Login,
  Error
}

interface AppState {
  mode: Mode;
  register: {
    name?: string;
    email?: string;
    result?: ZoomCaptureResult;
  };
  login: {
    email?: string;
    result?: ZoomCaptureResult;
  };
  error?: Error;
}

export class App extends Component<{}, AppState> {
  state: AppState = {
    mode: Mode.Register,
    register: {},
    login: {}
  };

  async componentDidMount() {
    await initializeAndPreload();
  }

  render() {
    return (
      <Wrapper>
        <Header>
          GoodDollar
          <Nav>
            <NavLink onClick={() => this.setState({ mode: Mode.Register })}>
              Register
            </NavLink>
            <NavLink onClick={() => this.setState({ mode: Mode.Login })}>
              Log In
            </NavLink>
          </Nav>
        </Header>

        {this.state.mode === Mode.Register && (
          <>
            {(!this.state.register.email || !this.state.register.name) && (
              <RegistrationForm
                onSubmit={this.handleRegisterSubmit.bind(this)}
              />
            )}

            {this.state.register.email && this.state.register.name && (
              <>
                {!this.state.register.result && (
                  <LivenessCapture
                    onCaptureComplete={this.handleRegisterCaptureComplete.bind(
                      this
                    )}
                    onCaptureError={this.handleError.bind(this)}
                  />
                )}

                {this.state.register.result && (
                  <RegistrationResult
                    email={this.state.register.email}
                    name={this.state.register.name}
                    result={this.state.register.result}
                    onApiError={this.handleError.bind(this)}
                  />
                )}
              </>
            )}
          </>
        )}

        {this.state.mode === Mode.Login && (
          <>
            {!this.state.login.email && (
              <LoginForm onSubmit={this.handleLoginSubmit.bind(this)} />
            )}

            {this.state.login.email && !this.state.login.result && (
              <LivenessCapture
                onCaptureComplete={this.handleLoginCaptureComplete.bind(this)}
                onCaptureError={this.handleError.bind(this)}
              />
            )}

            {this.state.login.email && this.state.login.result && (
              <LoginResult
                email={this.state.login.email}
                result={this.state.login.result}
                onApiError={this.handleError.bind(this)}
              />
            )}
          </>
        )}

        {this.state.mode == Mode.Error && <ErrorList errors={this.errors()} />}
      </Wrapper>
    );
  }

  // errors
  private errors(): string[] {
    if (!this.state.error) {
      return [];
    }

    return [this.state.error.message];
  }

  private handleError(error: Error) {
    this.setState({
      mode: Mode.Error,
      error
    });
  }

  // register
  private handleRegisterCaptureComplete(result: ZoomCaptureResult) {
    this.setState({
      register: {
        ...this.state.register,
        result
      }
    });
  }

  private handleRegisterSubmit(name: string, email: string) {
    this.setState({
      register: {
        name,
        email
      }
    });
  }

  // login
  private handleLoginCaptureComplete(result: ZoomCaptureResult) {
    this.setState({
      login: {
        ...this.state.login,
        result
      }
    });
  }

  private handleLoginSubmit(email: string) {
    this.setState({
      login: {
        email
      }
    });
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
  font-size: 0.8rem;
  cursor: pointer;

  &:last-child {
    margin-left: 1rem;
  }
`;
