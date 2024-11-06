import React from 'react';
import * as styled from './LoginPage.styles';
import { LoginBox } from './components/LoginBox';
import { LoginBoxProps } from './components/LoginBox/LoginBox';

function LoginPage(props: LoginBoxProps) {
      
        return(
            <styled.LoginPageContainer>
                <styled.BackgroundImage src='./login_background.png'/>
                <LoginBox onLoginSuccess={props.onLoginSuccess}/>
            </styled.LoginPageContainer>
        );
}

export default LoginPage;