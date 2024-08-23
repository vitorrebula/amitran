import styled from 'styled-components';

export const LoginPageContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    position: relative;
`;

export const BackgroundImage = styled.img`
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(50%);
    user-select: none;
    pointer-events: none;
`;