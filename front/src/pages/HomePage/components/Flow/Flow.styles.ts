import styled from 'styled-components';

export const FlowContainer = styled.div`
    padding: 20px;
    .flow-content {
        width: 80vw;
        height: 50vh;
    }
    h3{
        text-align: center;
        text-justify: center;
    }
    .react-flow__panel.react-flow__attribution.bottom.right {
        display: none;
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