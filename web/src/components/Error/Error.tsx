import React from "react";
import styled from "styled-components";

interface ErrorProps {
  title?: string;
  errors: string[];
}

export const Error = (props: ErrorProps) => (
  <Wrapper>
    {props.title || "An error occurred:"}
    <ul>
      {props.errors.map(e => (
        <li>{e}</li>
      ))}
    </ul>
  </Wrapper>
);

const Wrapper = styled.div`
  background-color: #cc0000;
  color: #fff;
  padding: 1rem;
  margin-bottom: 1rem;
`;
