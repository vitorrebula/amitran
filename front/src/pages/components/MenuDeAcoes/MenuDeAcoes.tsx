import React, { Dispatch, SetStateAction } from 'react';
import * as styled from './MenuDeAcoes.styles';
import { Checkbox, Divider } from 'antd';
import Search from 'antd/es/input/Search';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

interface MenuDeAcoesProps {
    setShowAddModal: Dispatch<SetStateAction<boolean>>;
    setCheckBoxEvent?: Dispatch<SetStateAction<boolean>>;
    showCheckBox?: boolean;
    AddText: string;
    setSearchText: Dispatch<SetStateAction<string>>;
}

function MenuDeAcoes(props: MenuDeAcoesProps) {
    const { setShowAddModal, setCheckBoxEvent, showCheckBox, AddText, setSearchText } = props;

    const handleCheckboxChange = (event: CheckboxChangeEvent) => {
        if (setCheckBoxEvent) {
            setCheckBoxEvent(event.target.checked);
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };

    return (
        <>
            <styled.MenuDeAcoes>
                <div className='button-checkbox'>
                    <styled.AddButton onClick={() => setShowAddModal(true)}>
                        <h4>{AddText}</h4>
                    </styled.AddButton>
                    {showCheckBox === true ? (
                        <Checkbox onChange={(e) => handleCheckboxChange(e)}>Mostrar Inativos?</Checkbox>
                    ) : null}
                </div>
                <Search className='search' placeholder="input search text" onChange={handleSearchChange} enterButton />
            </styled.MenuDeAcoes>
            <Divider style={{ margin: 0 }} />
        </>
    );
}

export default MenuDeAcoes;