import styled from 'styled-components';

export const VeiculosContainer = styled.div`
    width: 100%;
    height: 100%;
`;

export const ListaVeiculos = styled.div`
    padding-top: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    @media(max-width: 768px){
        justify-content: center;
    }
`;
