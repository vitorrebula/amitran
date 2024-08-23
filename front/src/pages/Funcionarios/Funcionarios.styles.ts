import styled from 'styled-components';

export const FuncionariosContainer = styled.div`
    width: 100%;
    height: 100%;
`;

export const ListaFuncionarios = styled.div`
    padding-top: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    @media(max-width: 768px){
        justify-content: center;
    }
`;
