import React, { Component, createRef, FormEvent } from "react";
import styled from "styled-components";
import { Button } from "../Button/Button";
import { Label } from "../Label/Label";
import { TextInput } from "../TextInput/TextInput";

interface LoginFormProps {
  onSubmit: (email: string) => void;
}

export class LoginForm extends Component<LoginFormProps> {
  private readonly emailField = createRef<HTMLInputElement>();

  render() {
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <Label>
          Email
          <TextInput ref={this.emailField} type="email" required />
        </Label>

        <Button type="submit">Log In</Button>
      </form>
    );
  }

  onSubmit(e: FormEvent) {
    e.preventDefault();

    const email =
      (this.emailField.current && this.emailField.current.value) || "";
    this.props.onSubmit(email);
  }
}
