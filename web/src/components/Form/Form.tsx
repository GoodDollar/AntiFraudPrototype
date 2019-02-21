import React, { Component, createRef, FormEvent } from "react";
import styled from "styled-components";
import { Button } from "../Button/Button";

interface FormProps {
  onSubmit: (name: string) => void;
}

export class Form extends Component<FormProps> {
  private readonly nameField = createRef<HTMLInputElement>();

  render() {
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <Label>
          Name
          <TextInput ref={this.nameField} />
        </Label>

        <Button type="submit">Register</Button>
      </form>
    );
  }

  onSubmit(e: FormEvent) {
    e.preventDefault();

    const name = (this.nameField.current && this.nameField.current.value) || "";
    this.props.onSubmit(name);
  }
}

const Label = styled.label`
  margin-bottom: 1rem;
  display: block;
`;

const TextInput = styled.input`
  border: 1px #aaa solid;
  padding: 0.5rem 0.75rem;
  outline: none;
  display: block;
  width: 100%;
  margin-top: 0.5rem;
`;
