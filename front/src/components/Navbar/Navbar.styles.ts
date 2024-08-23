import styled from 'styled-components';

export const NavbarContainer = styled.div`
    padding-left: 1vw;
    padding-top: 2vh;
    opacity: 1;
    position: relative;
    @media (max-width: 468px) {
        span {
            display: none;
        }
    }
`;

export const Logo = styled.img`
    height: 40px;
    position: absolute;
    @media (max-width: 768px) {
        display: block;
        position: static;
        margin: 0 auto;
    }
`;