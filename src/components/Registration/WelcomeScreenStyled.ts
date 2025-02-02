import styled from "styled-components";

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #f6f9fc, #e0f7fa);
  font-family: "Arial", sans-serif;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #007bff;
  color: #fff;
`;

export const Logo = styled.h1`
  font-size: 1.8rem;
  font-weight: bold;
`;

export const Nav = styled.nav`
  display: flex;
  align-items: center;
`;

export const LanguageSelector = styled.select`
  background: #fff;
  color: #007bff;
  border: none;
  padding: 0.5rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
`;

export const MainContent = styled.main`
  flex: 1;
  padding: 2rem 5%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const IntroSection = styled.section`
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #007bff;
  }

  p {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
    color: #333;
  }
`;

export const StartButton = styled.button`
  background: #007bff;
  color: #fff;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 8px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #0056b3;
  }
`;

export const StepsSection = styled.section`
  max-width: 800px;
  margin: 0 auto;
  text-align: left;

  h2 {
    font-size: 2rem;
    color: #007bff;
    margin-bottom: 1.5rem;
    text-align: center;
  }
`;

export const Step = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const StepIcon = styled.div`
  font-size: 2rem;
  color: #007bff;
  margin-right: 1rem;
`;

export const StepContent = styled.div`
  h3 {
    font-size: 1.4rem;
    margin-bottom: 0.5rem;
    color: #333;
  }

  p {
    font-size: 1rem;
    color: #555;
  }
`;

export const Footer = styled.footer`
  padding: 1rem 2rem;
  background: #007bff;
  color: #fff;
  text-align: center;

  p {
    margin: 0.5rem 0;
  }
`;

export const Links = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;

  a {
    color: #fff;
    text-decoration: none;
    font-size: 0.9rem;

    &:hover {
      text-decoration: underline;
    }
  }
`;
