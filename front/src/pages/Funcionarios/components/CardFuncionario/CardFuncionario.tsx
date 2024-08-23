import React, { Dispatch, SetStateAction, useState } from 'react';
import * as styled from './CardFuncionario.styles';
import { EditOutlined } from '@ant-design/icons';
import { Avatar, Card } from 'antd';
import { FaTrashAlt } from 'react-icons/fa';
import { Funcionario } from '../../Funcionarios';
import axios from 'axios';
import { IoReturnDownBackOutline } from 'react-icons/io5';


interface CardFuncionarioProps {
    funcionario: Funcionario;
    setShowEditFunc: () => void;
    setListaFuncionario: Dispatch<SetStateAction<Funcionario[]>>;
}

function CardFuncionario(props: CardFuncionarioProps) {
    const { funcionario, setShowEditFunc, setListaFuncionario } = props;
    const [showDelete, setShowDelete] = useState<boolean>(false);
    const avatarSeed = encodeURIComponent(funcionario.username);

    const deleteFuncionario = async (id: number) => {
        try {
            await axios.delete(`http://localhost:8080/Funcionario/${id}`);
            
            setListaFuncionario((prev) => prev.filter(funcionario => funcionario.id !== id));
    
            setShowDelete(false);
        } catch (error) {
            console.error("Erro ao deletar o funcionário:", error);
        }
    };

    const action: React.ReactNode[] = [
        <div style={{width: '100%'}} onClick={setShowEditFunc}><EditOutlined key="edit" /></div>,
        <div style={{width: '100%'}} onClick={() => setShowDelete(true)} ><FaTrashAlt key="delete"/></div>
    ];

    return (
        <styled.CardFuncionarioContainer>
            {showDelete ? (
                <Card style={showDelete ? {border: '1px solid red', boxShadow: "0 2px 10px rgba(0, 0, 0, 0.4)"} : { boxShadow: "0 2px 10px rgba(0, 0, 0, 0.4)" }}>
                    <Card.Meta
                        avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${avatarSeed}`} />} title={`Excluir ${funcionario.username}?`}
                        description={
                            <>                                
                            <p>Essa função é irreversível, você também pode inativá-lo.</p>
                                <ul className='icon-wrapper'>
                                    <li className="deleteconfirm" onClick={() => deleteFuncionario(funcionario.id)}>
                                        <FaTrashAlt />
                                    </li>
                                    <li className="backtocard" onClick={() => setShowDelete(false)}>
                                        <IoReturnDownBackOutline />
                                    </li>
                                </ul>
                            </>
                        }
                    />
                </Card>
            ) : (
                <Card actions={action} style={{ boxShadow: "0 2px 10px rgba(0, 0, 0, 0.4)" }}>
                    <Card.Meta
                        avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${avatarSeed}`} />} title={funcionario.username}
                        description={
                            <>
                                <h3>{funcionario.cargo}</h3>
                                <p>{funcionario.status}</p>
                            </>
                        }
                    />
                </Card>
            )}
        </styled.CardFuncionarioContainer>
    );
}

export default CardFuncionario;
