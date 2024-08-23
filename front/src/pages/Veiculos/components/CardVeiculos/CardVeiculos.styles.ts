import styled from 'styled-components';
import colors from '../../../../styles.colors';

export const CardVeiculoContainer = styled.div`
    display: flex;
    width: fit-content;
    padding: 10px;
    .ant-card {
        width: 330px;
        height: 210px;
        position: relative;
        .icon-wrapper {
            display: flex;
            position: absolute !important;
            border-top: 1px solid ${colors.bordinha};
            align-items: center;
            padding: 0;
            margin: 0;
            height: 23%;
            width: 100%;
            left: 0;
            right: 0;
            bottom: 0;
            justify-content: center;
            list-style: none;
            .deleteconfirm {
                align-items: center;
                justify-content: center;
                display: flex;
                width: 100%;
                cursor: pointer;
            }
            .backtocard {
                align-items: center;
                justify-content: center;
                border-left: 1px solid ${colors.bordinha};
                cursor: pointer;
                display: flex;
                width: 100%;
            }
        }
    }
`;
