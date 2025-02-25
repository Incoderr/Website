import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="load">
        <div className="progress" />
        <div className="progress" />
        <div className="progress" />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .load {
    display: flex;
    border-radius: 50%;
    flex-direction: row;
  }

  .progress {
    width: 1.2rem;
    height: 1.2rem;
    margin: 0.4em;
    scale: 0;
    border-radius: 50%;
    background: rgb(255, 255, 255);
    animation: loading_492 2s ease infinite;
    animation-delay: 1s;
  }

  @keyframes loading_492 {
    50% {
      scale: 1;
    }
  }

  .progress:nth-child(2) {
    animation-delay: 1.3s;
  }

  .progress:nth-child(3) {
    animation-delay: 1.7s;
  }`;

export default Loader;
