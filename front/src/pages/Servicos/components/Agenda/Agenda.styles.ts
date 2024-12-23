import styled from 'styled-components';
import colors from '../../../../styles.colors';

export const AgendaContainer = styled.div`
    padding-left: 20px;
    padding-right: 20px;
`;

export const ServiçosTitle = styled.h1`
    font-size: 1.5rem;
    text-align: center;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
`;

export const Legenda = styled.p`
    font-size: 15px;
    text-align: center;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    margin-bottom: 0;
`;

export const CenteredCalendar = styled.div`
    max-width: 80%;
    height: fit-content;
    margin: 0 auto;
    padding: 20px; 
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); 
    background-color: #fff; 
    border-radius: 8px; 
    p {
        color: ${colors.vermelho};
        display: block;
        margin: 0 auto;
        font-size: 12px;
    }
`;