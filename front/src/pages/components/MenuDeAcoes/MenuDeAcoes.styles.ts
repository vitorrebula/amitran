import styled from 'styled-components';
import colors from '../../../styles.colors';


export const MenuDeAcoes = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    .button-checkbox {
        display: flex;
        gap: 10px;
        align-items: center;
    }
    button {
        background-color: ${colors.azulescuroamitran} !important;
    }
    .search {
        max-width: 25vw;
    }
    @media(max-width: 568px){
        flex-direction: column;
        .search {
            max-width: 80vw;
        }
        .button-checkbox {
            flex-direction: column;
            margin-bottom: 1vh;
        }
    }
`;

export const AddButton = styled.div`
    background-color: ${colors.azulescuroamitran};
    width: 200px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 5px;
    h4{
        color: ${colors.white};
    }
`;
