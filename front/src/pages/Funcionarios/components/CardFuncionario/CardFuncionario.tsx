import React, { Dispatch, SetStateAction, useState } from 'react';
import * as styled from './CardFuncionario.styles';
import { EditOutlined } from '@ant-design/icons';
import { Avatar, Card, message } from 'antd';
import { FaTrashAlt } from 'react-icons/fa';
import { Funcionario } from '../../Funcionarios';
import { Servico } from '../../../Servicos/ServicosPage';
import dayjs from 'dayjs';
import { ModalDelecao } from '../../../../components/ModalDelecao';
import { url } from '../../../../url';
import { api } from '../../../../axios';

interface CardFuncionarioProps {
    funcionario: Funcionario;
    setShowEditFunc: () => void;
    setListaFuncionario: Dispatch<SetStateAction<Funcionario[]>>;
    listaServico: Servico[];
    setListaServico: Dispatch<SetStateAction<Servico[]>>;
}

function CardFuncionario(props: CardFuncionarioProps) {
    const { funcionario, setShowEditFunc, setListaFuncionario, listaServico, setListaServico } = props;
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [futureServicos, setFutureServicos] = useState<Servico[]>([]);
    const avatarSeed = encodeURIComponent(funcionario.nome);

    const handleDelete = () => {
        const futureServices = listaServico.filter(servico =>
            (dayjs(servico.dataInicio).isAfter(dayjs()) || dayjs(servico.dataTermino).isAfter(dayjs())) &&
            servico.funcionarios.some(f => f.id === funcionario.id)
        );

        setFutureServicos(futureServices);
        setModalVisible(true); 
    };

    const deleteFuncionario = async (id: number) => {
        try {
            await api.delete(`${url}/Funcionario/${id}`);

            const updatedServicos = listaServico.map(servico => ({
                ...servico,
                funcionarios: servico.funcionarios.filter(f => f.id !== id)
            }));

            setListaServico(updatedServicos);
            setListaFuncionario(prev => prev.filter(funcionario => funcionario.id !== id));
            message.success('Funcionário removido com sucesso!');
            setModalVisible(false);
        } catch (error) {
            console.error("Erro ao deletar o funcionário:", error);
            message.error('Erro ao remover o funcionário.');
        }
    };

    const handleConfirmDelete = () => {
        deleteFuncionario(funcionario.id);
    };

    const action: React.ReactNode[] = [
        <div style={{ width: '100%' }} onClick={setShowEditFunc}><EditOutlined key="edit" /></div>,
        <div style={{ width: '100%' }} onClick={handleDelete}><FaTrashAlt key="delete" /></div>
    ];

    return (
        <styled.CardFuncionarioContainer>
            <Card actions={action} style={{ boxShadow: "0 2px 10px rgba(0, 0, 0, 0.4)" }}>
                <Card.Meta
                    avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${avatarSeed}`} />} 
                    title={funcionario.nome}
                    description={
                        <>
                            <h3>{funcionario.cargo}</h3>
                            <p>{funcionario.status}</p>
                        </>
                    }
                />
            </Card>

            <ModalDelecao
                title={`Excluir ${funcionario.nome}?`}
                item="funcionário"
                futureServicos={futureServicos}
                modalVisible={modalVisible}
                handleConfirm={handleConfirmDelete} 
                handleCancel={() => setModalVisible(false)}
            />
        </styled.CardFuncionarioContainer>
    );
}

export default CardFuncionario;