import React, { Dispatch, SetStateAction, useState } from 'react';
import * as styled from './CardVeiculos.styles';
import { EditOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import { FaTrashAlt, FaMotorcycle } from 'react-icons/fa';
import { FaRoad } from "react-icons/fa";
import { BsTruckFlatbed } from "react-icons/bs";
import { FaTruckFront } from "react-icons/fa6";
import { PiTruckLight } from "react-icons/pi";
import { PiVanFill } from "react-icons/pi";
import { Veiculo } from '../../Veiculos';
import axios from 'axios';
import { IoReturnDownBackOutline } from 'react-icons/io5';

interface CardVeiculoProps {
    veiculo: Veiculo;
    setShowEditVeiculo: () => void;
    setListaVeiculo: Dispatch<SetStateAction<Veiculo[]>>;
}

function CardVeiculo(props: CardVeiculoProps) {
    const { veiculo, setShowEditVeiculo, setListaVeiculo } = props;
    const [showDelete, setShowDelete] = useState<boolean>(false);

    const deleteVeiculo = async (placa: string) => {
        try {
            await axios.delete(`http://localhost:8080/veiculo/${placa}`);
            
            setListaVeiculo((prev) => prev.filter(veiculo => veiculo.placa !== placa));
    
            setShowDelete(false);
        } catch (error) {
            console.error("Erro ao deletar o veículo:", error);
        }
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
        <div style={{width: '100%'}} onClick={setShowEditVeiculo}><EditOutlined key="edit" /></div>,
        <div style={{width: '100%'}} onClick={() => setShowDelete(true)} ><FaTrashAlt key="delete"/></div>
    ];

    return (
        <styled.CardVeiculoContainer>
            {showDelete ? (
                <Card style={showDelete ? {border: '1px solid red', boxShadow: "0 2px 10px rgba(0, 0, 0, 0.4)"} : { boxShadow: "0 2px 10px rgba(0, 0, 0, 0.4)" }}>
                    <Card.Meta
                        avatar={renderIcon()} 
                        title={`Excluir veículo ${veiculo.placa}?`}
                        description={
                            <>                                
                            <p>Essa função é irreversível, você também pode desativá-lo.</p>
                                <ul className='icon-wrapper'>
                                    <li className="deleteconfirm" onClick={() => deleteVeiculo(veiculo.placa)}>
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
            )}
        </styled.CardVeiculoContainer>
    );
}

export default CardVeiculo;
