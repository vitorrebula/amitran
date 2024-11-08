import styled from 'styled-components';

export const NavbarContainer = styled.div`
    padding-left: 1vw;
    padding-top: 2vh;
    opacity: 1;
    position: relative;
    @media (max-width: 768px) {
        .ant-menu-title-content {
            display: none;
        }
        svg {
            font-size: 10px;
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