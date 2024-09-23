import React, { useState } from 'react';
import * as styled from './LoginBox.styles';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import axios from 'axios';
import { setToken } from '../../../../auth';
import { url } from '../../../../url';

interface LoginResponse {
    token: string;
}

export interface LoginBoxProps {
    onLoginSuccess: () => void;
}

function LoginBox(props: LoginBoxProps) {
    const {onLoginSuccess} = props;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [forgetPassword, setForgetPassword] = useState(false);
    const [verificationCode, setVerificationCode] = useState<string[]>(['', '', '', '', '', '']);
    const [generatedCode, setGeneratedCode] = useState<string | null>(null);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (passwordForgotten?: string) => {
        try {
            const loginData = {
                email: (passwordForgotten ? {email: 'admin@admin.com.br'} : {email: email}),
                password: (passwordForgotten ? { password: passwordForgotten } : {password: password})
            };
            const response = await axios.post<LoginResponse>(`${url}/auth/login`, loginData);
            const token = response.data.token;
            setToken(token);
            onLoginSuccess();
            navigate('/home');
        } catch (error: any) {
            console.error('Erro no login:', error);
            alert('Credenciais incorretas! Tente novamente.');
        }
    };

    const generateRandomCode = () => {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedCode(code);
        emailjs.send('service_i9mujv8', 'template_q8dkru8', {
            codigo: code,
            senha: 'admin123'
        }, 'w_O7CPvKQQSgAsx8r')
            .then((response) => {
                console.log('SUCCESS!', response.status, response.text);
            }, (err) => {
                console.log('FAILED...', err);
                alert('Falha ao enviar o código de verificação.');
            });
    };

    const handleVerification = () => {
        const enteredCode = verificationCode.join('');
        if (generatedCode === enteredCode) {
            alert('Verificação bem-sucedida!');
            handleLogin('admin123');
            setForgetPassword(false);
        } else {
            alert('Código de verificação incorreto.');
        }
    };

    const handleInputChange = (index: number, value: string) => {
        if (value.length <= 1) {
            const newCode = [...verificationCode];
            newCode[index] = value;
            setVerificationCode(newCode);

            if (value !== '' && index < 5) {
                const nextInput = document.getElementById(`input-${index + 1}`);
                nextInput?.focus();
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
            const prevInput = document.getElementById(`input-${index - 1}`);
            prevInput?.focus();
        }
    };

    return (
        <styled.LoginContainer>
            <styled.LoginBox>
                {!forgetPassword ? (
                    <>
                        <div className='img-wrapper'><styled.LogoImage src="./logo_amitran.png" alt="gif" /></div>
                        <styled.Title>Logística</styled.Title>
                        <styled.Input
                            type="email"
                            placeholder="E-mail"
                            style={{ marginBottom: '20px' }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <styled.PasswordWrapper>
                            <styled.Input
                                type={passwordVisible ? 'text' : 'password'}
                                placeholder="Senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <styled.EyeIcon onClick={() => setPasswordVisible(!passwordVisible)}>
                                {passwordVisible ? <FaEye /> : <FaEyeSlash />}
                            </styled.EyeIcon>
                        </styled.PasswordWrapper>
                        <styled.SignupLink style={{ marginBottom: '20px' }}
                            onClick={() => {
                                setForgetPassword(true);
                                generateRandomCode();
                            }}>
                            Esqueceu a senha?
                        </styled.SignupLink>
                        <styled.Button onClick={() => handleLogin()}>LOGIN</styled.Button>
                    </>
                ) : (
                    <>
                        <FaArrowLeft className="back-arrow" onClick={() => setForgetPassword(false)} />
                        <styled.Title>Verificação</styled.Title>
                        <styled.Instruction>
                            Insira o código de 6 dígitos, enviado no e-mail {email}
                        </styled.Instruction>
                        <styled.VerificationContainer>
                            {verificationCode.map((digit, index) => (
                                <styled.VerificationInput
                                    key={index}
                                    id={`input-${index}`}
                                    type="text"
                                    value={digit}
                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    maxLength={1}
                                />
                            ))}
                        </styled.VerificationContainer>
                        <styled.Button onClick={handleVerification}>VERIFICAR</styled.Button>
                    </>
                )}
            </styled.LoginBox>
        </styled.LoginContainer>
    );
}

export default LoginBox;