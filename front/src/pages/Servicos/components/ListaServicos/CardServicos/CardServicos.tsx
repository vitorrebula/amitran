import React, { Dispatch, SetStateAction, useState } from 'react';
import { Servico } from '../../../ServicosPage';
import { Collapse, CollapseProps, Modal, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { FaRegTrashAlt } from "react-icons/fa";
import { Veiculo } from '../../../../Veiculos/Veiculos';
import { Funcionario } from '../../../../Funcionarios/Funcionarios';
import dayjs from 'dayjs';
import { EditModal } from '../../EditModal';
import { url } from '../../../../../url';
import { api } from '../../../../../axios';

interface CardServicosProps {
    servicos: Servico[];
    setListaServico: Dispatch<SetStateAction<Servico[]>>;
    listaServico: Servico[];
    selectedValue: dayjs.Dayjs;
    listaVeiculo: Veiculo[];
    listaFuncionario: Funcionario[];
}

function CardServicos(props: CardServicosProps) {
    const { servicos, setListaServico, listaServico, listaVeiculo, listaFuncionario } = props;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [servicoToDelete, setServicoToDelete] = useState<Servico | null>(null);
    const [servicoToEdit, setServicoToEdit] = useState<Servico | undefined>(undefined); 

    const showModal = (servico: Servico) => {
        setServicoToDelete(servico);
        setIsModalVisible(true);
    };

    const showEditModal = (servico: Servico) => {
        setServicoToEdit(servico);
        setIsEditModalVisible(true); 
    };

    const handleOk = async () => {
        if (servicoToDelete) {
            try {
                await api.delete(`${url}/servico/${servicoToDelete.id}`);
                setListaServico(prevServicos => prevServicos.filter(servico => servico.id !== servicoToDelete.id));
                message.success('Serviço excluído com sucesso.');
            } catch (error) {
                message.error('Erro ao excluir o serviço.');
                console.error("Erro ao excluir o serviço:", error);
            }
        }
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setServicoToDelete(null);
    };

    const genExtra = (servico: Servico) => (
        <>
            <EditOutlined
                onClick={(event) => {
                    event.stopPropagation();
                    showEditModal(servico);
                }}
                style={{ paddingRight: '15px' }}
            />
            <FaRegTrashAlt
                onClick={(event) => {
                    event.stopPropagation();
                    showModal(servico);
                }}
            />
        </>
    );

    const renderVeiculos = (veiculos?: Veiculo[]) => (
        veiculos?.map((veiculo, index) => <div key={index}>{veiculo.placa}</div>)
    );

    const renderFuncionarios = (funcionarios: Funcionario[]) => {
        const motoristas = funcionarios.filter(funcionario =>
            ["Motorista", "Chapa Motorista"].includes(funcionario.cargo)
        );

        const ajudantes = funcionarios.filter(funcionario =>
            ["Ajudante", "Chapa Ajudante"].includes(funcionario.cargo)
        );

        return (
            <div>
                <div>
                    <strong>Motoristas:</strong>
                    {motoristas?.length > 0 ? motoristas?.map((funcionario, index) => (
                        <div key={index}>{funcionario.nome}</div>
                    )) : <div>Nenhum motorista</div>}
                </div>
                <div>
                    <strong>Ajudantes:</strong>
                    {ajudantes?.length > 0 ? ajudantes?.map((funcionario, index) => (
                        <div key={index}>{funcionario.nome}</div>
                    )) : <div>Nenhum ajudante</div>}
                </div>
            </div>
        );
    };

    const items: CollapseProps['items'] = servicos.map((servico) => {
        return {
            key: servico.id?.toString(),
            label: servico.nomeCliente,
            children: (
                <div>
                    <h4 style={{ margin: 0 }}>{`${dayjs(servico.dataInicio).format('DD/MM/YYYY')} > ${dayjs(servico.dataTermino).format('DD/MM/YYYY')}`}</h4>
                    <p style={{ fontSize: '0.8rem' }}>{`${servico.enderecoOrigem} > ${servico.enderecoEntrega}`}</p>
                    <div>
                        <strong>Veículos:</strong>
                        {renderVeiculos(servico.veiculos)}
                    </div>
                    <div>
                        {renderFuncionarios(servico.funcionarios)}
                    </div>
                    <p style={{ fontSize: '0.8rem' }}>{`obs: ${servico.descricao}`}</p>
                </div>
            ),
            extra: genExtra(servico),
        };
    });

    return (
        <>
            <Collapse
                defaultActiveKey={['1']}
                expandIconPosition="start"
                items={items}
                bordered={false}
                ghost
            />
            <EditModal
                listaServico={listaServico}
                showEditarModal={isEditModalVisible}
                setShowEditarModal={setIsEditModalVisible}
                servico={servicoToEdit}
                setListaServico={setListaServico}
                listaFuncionario={listaFuncionario}
                listaVeiculo={listaVeiculo}
            />
            <Modal
                title="Confirmar Exclusão"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Excluir"
                cancelText="Cancelar"
            >
                <p>Tem certeza que deseja excluir o serviço {servicoToDelete?.nomeCliente}?</p>
            </Modal>
        </>
    );
}

export default CardServicos;
