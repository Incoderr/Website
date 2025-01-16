import styled from "styled-components";

export const Footer = styled.footer`
  background-color: #0e0c0a;
  position: absolute;
  backdrop-filter: blur(10px);
  width: 100%;
  height: auto;
`;

export const Container = styled.div`
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 5px;

  .footer-info{
    display: flex;
  }
`;

export const FooterIcons = styled.div`
  gap: 15px;
  display: flex;

  svg{
    filter: invert(100%);
    width: 27px;
    height: auto;
  }
`;