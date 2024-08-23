import styled from 'styled-components';
import colors from '../../../../styles.colors';

export const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

export const LoginBox = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;

  .img-wrapper {
    display: flex;
    justify-content: center;
    align-items: center; 
    width: 100%; 
  }

  .back-arrow {
    position: absolute;
    top: 10px;
    left: 10px;
    cursor: pointer;
  }

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const Title = styled.h2`
  text-align: center;
  margin: 0;
  font-size: 1.5rem;
  padding-bottom: 20px;
`;

export const LogoImage = styled.img`
  width: 120px;
  margin: 0 auto;
  user-select: none;
  pointer-events: none;

  @media (max-width: 768px) {
    width: 90px;
  }
`;

export const Input = styled.input`
  width: calc(100% - 20px);
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 14px;

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 12px;
  }
`;

export const Button = styled.button`
  width: 100%;
  padding: 10px;
  background: linear-gradient(90deg, ${colors.roxologin}, ${colors.azullogin});
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 16px;
  cursor: pointer;

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 14px;
  }
`;

export const SignupLink = styled.div`
  text-align: start;
  font-size: 14px;
  cursor: pointer;
  color: ${colors.azullogin};

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

export const PasswordWrapper = styled.div`
    position: relative;
    width: 100%;
`;

export const EyeIcon = styled.div`
    position: absolute;
    top: 55%;
    right: 5px;
    transform: translateY(-50%);
    cursor: pointer;
    color: ${colors.cinzaclaro};
    &:hover {
        color: ${colors.cinzaescuro};
    }
`;

// verificação de login 

export const VerificationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

export const VerificationInput = styled.input`
  width: 40px;
  height: 40px;
  text-align: center;
  font-size: 18px;
  border-radius: 4px;
  border: 1px solid #ddd;
  margin-left: 5px;
  margin-right: 5px;

  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
    font-size: 16px;
  }
`;

export const Instruction = styled.p`
  margin-bottom: 20px;
  text-align: center;
  color: #555;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;
