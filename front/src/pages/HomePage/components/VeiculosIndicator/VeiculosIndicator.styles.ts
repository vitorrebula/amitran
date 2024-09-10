import styled from 'styled-components';

export const VeiculosIndicatorContainer = styled.div`
    height: 100%;
    padding: 20px;
    h3{
        text-align: center;
        text-justify: center;
    }
`;

export const HelpBar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media(max-width: 768px) {
        display: flex;
        flex-direction: column;
    }
`;