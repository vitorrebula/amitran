import React, { Dispatch, SetStateAction, useState } from 'react';
import { Servico } from '../../../ServicosPage';
import { Collapse, CollapseProps, Modal, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { FaRegTrashAlt } from "react-icons/fa";
import { Veiculo } from '../../../../Veiculos/Veiculos';
import { Funcionario } from '../../../../Funcionarios/Funcionarios';
import dayjs from 'dayjs';
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
    
    const genExtra = (servico: Servico) => (
        <>
            <EditOutlined
                onClick={(event) => {
                    event.stopPropagation();
                }}
                style={{ paddingRight: '15px' }}
            />
            <FaRegTrashAlt
                onClick={(event) => {
                    event.stopPropagation();
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
            />
        </>
    );
}

export default CardServicos;
