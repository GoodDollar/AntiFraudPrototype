import React, { Component } from "react";
import styled from "styled-components";
import { ApiResponse, Reply, ApiError } from "../../util/ApiClient";

interface ErrorListProps {
  title?: string;
  apiResult: ApiResponse<Reply> | undefined;
  printSimilarUsersResults: (apiResult:ApiResponse<Reply> | undefined) => JSX.Element
}

export class ErrorList extends Component<ErrorListProps> {
  
  printErrors(apiResult:any){
    if (apiResult && apiResult.body){
      let errors = apiResult.body.errors
      
      return errors?errors.map((e:Error) => e && <li key={e.message}>{e.message}</li>):<span />
    }
    return <span />
  }

  render(){
      return(
        <Wrapper>
          {this.props.printSimilarUsersResults(this.props.apiResult)}
          
          <ul>
            {this.printErrors(this.props.apiResult)}    
          </ul>
          
        </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  background-color: #cc0000;
  color: #fff;
  padding: 1rem;
  margin-bottom: 1rem;
`;
