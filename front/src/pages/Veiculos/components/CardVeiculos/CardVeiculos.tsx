import React, { Dispatch, SetStateAction, useState } from 'react';
import * as styled from './CardVeiculos.styles';
import { EditOutlined } from '@ant-design/icons';
import { Card, message } from 'antd';
import { FaTrashAlt, FaMotorcycle } from 'react-icons/fa';
import { FaRoad } from "react-icons/fa";
import { BsTruckFlatbed } from "react-icons/bs";
import { FaTruckFront } from "react-icons/fa6";
import { PiTruckLight, PiVanFill } from "react-icons/pi";
import { Veiculo } from '../../Veiculos';
import axios from 'axios';
import { Servico } from '../../../Servicos/ServicosPage';
import dayjs from 'dayjs';
import { ModalDelecao } from '../../../../components/ModalDelecao';

interface CardVeiculoProps {
    veiculo: Veiculo;
    setShowEditVeiculo: () => void;
    setListaVeiculo: Dispatch<SetStateAction<Veiculo[]>>;
    listaServico: Servico[];
    setListaServico: Dispatch<SetStateAction<Servico[]>>;
}

function CardVeiculo(props: CardVeiculoProps) {
    const { veiculo, setShowEditVeiculo, setListaVeiculo, listaServico, setListaServico } = props;
    const [modalVisible, setModalVisible] = useState<boolean>(false); 
    const [futureServicos, setFutureServicos] = useState<Servico[]>([]); 

    const handleDelete = () => {
        const futureServices = listaServico.filter(servico =>
            (dayjs(servico.dataInicio).isAfter(dayjs()) || dayjs(servico.dataTermino).isAfter(dayjs())) &&
            servico.veiculos?.some(v => v.placa === veiculo.placa)
        );

        if (futureServices.length > 0) {
            setFutureServicos(futureServices); 
            setModalVisible(true); 
        } else {
            deleteVeiculo(veiculo.placa); 
        }
    };


    const deleteVeiculo = async (placa: string) => {
        try {
            await axios.delete(`http://192.168.0.13:8080/veiculo/${placa}`);


            const updatedServicos = listaServico.map(servico => ({
                ...servico,
                veiculos: servico.veiculos?.filter(v => v.placa !== placa)
            }));

            setListaServico(updatedServicos);
            setListaVeiculo(prev => prev.filter(veiculo => veiculo.placa !== placa));
            message.success('Veículo removido com sucesso!');
            setModalVisible(false); 
        } catch (error) {
            console.error("Erro ao deletar o veículo:", error);
        }
    };

    const handleConfirmDelete = () => {
        deleteVeiculo(veiculo.placa);
    };

    const renderIcon = () => {
        switch (veiculo.tipoVeiculo.toLowerCase()) {
            case 'caminhão':
                return <FaTruckFront size={40} />;
            case 'prancha':
                return <BsTruckFlatbed size={40} />;
            case 'van':
                return <PiVanFill size={40} />;
            case 'kombi':
                return <PiTruckLight size={40} />;
            case 'moto':
                return <FaMotorcycle size={40} />;
            default:
                return <FaRoad size={40} />;
        }
    };

    const action: React.ReactNode[] = [
        <div style={{ width: '100%' }} onClick={setShowEditVeiculo}><EditOutlined key="edit" /></div>,
        <div style={{ width: '100%' }} onClick={handleDelete}><FaTrashAlt key="delete" /></div>
    ];

    return (
        <styled.CardVeiculoContainer>
            <Card actions={action} style={{ boxShadow: "0 2px 10px rgba(0, 0, 0, 0.4)" }}>
                <Card.Meta
                    avatar={renderIcon()}
                    title={veiculo.placa}
                    description={
                        <>
                            <h3>{veiculo.tipoVeiculo}</h3>
                            <p>{veiculo.modelo}</p>
                        </>
                    }
                />
            </Card>

            <ModalDelecao
                title={`Excluir veículo ${veiculo.placa}?`}
                item="veículo"
                futureServicos={futureServicos}
                modalVisible={modalVisible}
                handleConfirm={handleConfirmDelete}
                handleCancel={() => setModalVisible(false)}
            />
        </styled.CardVeiculoContainer>
    );
}

export default CardVeiculo;
