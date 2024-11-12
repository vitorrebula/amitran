import React from 'react';
import { Handle, Position } from 'reactflow';
import dayjs from 'dayjs';
import { Servico } from '../../../../Servicos/ServicosPage';
import { Button, Divider } from 'antd';
import { CiEdit } from "react-icons/ci";

interface CustomNodeProps {
    data: {
        servico: Servico;
        onEdit: (servico: Servico) => void;
    };
}

const CustomNode: React.FC<CustomNodeProps> = ({ data }) => {
    const { servico, onEdit } = data;

    return (
        <div style={{ border: '1px solid #777', padding: '10px', borderRadius: '8px', backgroundColor: '#fff', width: '250px' }}>
            <strong>{servico.nomeCliente}</strong>
            <Divider />
            <div>Origem: {servico.enderecoOrigem}</div>
            <div>Destino: {servico.enderecoEntrega}</div>
            <div>Data Início: {dayjs(servico.dataInicio).format('DD/MM/YYYY')}</div>
            <div>Data Término: {dayjs(servico.dataTermino).format('DD/MM/YYYY')}</div>
            <Divider />
            <Button icon={<CiEdit />} onClick={() => onEdit(servico)} />
            <Handle type="source" position={Position.Right} />
            <Handle type="target" position={Position.Left} />
        </div>
    );
};

export default CustomNode;
