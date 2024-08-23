import React from 'react';
import * as styled from './LoginPage.styles';
import { LoginBox } from './components/LoginBox';

function LoginPage() {
      
        return(
            <styled.LoginPageContainer>
                <styled.BackgroundImage src='./login_background.png'/>
                <LoginBox />
            </styled.LoginPageContainer>
        );
}

export default LoginPage;