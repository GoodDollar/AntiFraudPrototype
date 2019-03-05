import React, { Component, createRef, FormEvent } from "react";
import styled from "styled-components";
import { Button } from "../Button/Button";
import { Label } from "../Label/Label";
import { TextInput } from "../TextInput/TextInput";

interface RegistrationFormProps {
  onSubmit: (name: string, email: string) => void;
}

export class RegistrationForm extends Component<RegistrationFormProps> {
  private readonly nameField = createRef<HTMLInputElement>();
  private readonly emailField = createRef<HTMLInputElement>();

  render() {
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <Label>
          Name
          <TextInput ref={this.nameField} required />
        </Label>

        <Label>
          Email
          <TextInput ref={this.emailField} type="email" required />
        </Label>

        <Button type="submit">Register</Button>
      </form>
    );
  }

  onSubmit(e: FormEvent) {
    e.preventDefault();

    const name = (this.nameField.current && this.nameField.current.value) || "";
    const email =
      (this.emailField.current && this.emailField.current.value) || "";
    this.props.onSubmit(name, email);
  }
}
