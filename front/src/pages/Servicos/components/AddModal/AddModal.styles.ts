import styled from 'styled-components';

export const AddModalContainer = styled.div`
    padding: 20px;
`;

export const FormContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

export const LeftSection = styled.div`
    width: 48%;
    display: flex;
    flex-direction: column;
    
    label {
        margin-top: 10px;
        font-weight: bold;
    }

    .ant-input, .ant-picker {
        margin-top: 5px;
    }
`;

export const RightSection = styled.div`
    width: 48%;
    display: flex;
    flex-direction: column;

    label {
        margin-top: 10px;
        font-weight: bold;
    }

    .ant-input {
        margin-top: 5px;
    }
`;

export const CheckboxContainer = styled.div`
    max-height: 150px;
    overflow-y: auto;
    border: 1px solid #ddd;
    padding: 8px;
    margin-bottom: 16px;
    background-color: #f7f7f7;
    border-radius: 4px;
`;