import React, { useEffect, useState } from 'react';
import * as styled from './Agenda.styles';
import { Badge, Button, Calendar } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { ListaServicos } from '../ListaServicos';
import { AddModal } from '../AddModal';
import { ServicosPageProps } from '../../ServicosPage';
import axios from 'axios';

function Agenda(props: ServicosPageProps) {
    const { listaVeiculo, listaFuncionario, listaServico, setListaServico } = props;
    const [value, setValue] = useState(() => dayjs());
    const [selectedValue, setSelectedValue] = useState(() => dayjs());
    const [openListaServicos, setOpenListaServicos] = useState<boolean>(false);
    const [showAddModal, setShowAddModal] = useState<boolean>(false);

    const buscaTodosServicos = async () => {
        try {
            const response = await axios.get('http://localhost:8080/servico');
            setListaServico(response.data);
        } catch (error) {
            console.error('Erro ao buscar os serviços:', error);
        }
    };

    useEffect(() => {
        buscaTodosServicos();
    }, []);

    const areAllVehiclesInUse = (date: Dayjs): boolean => {
        const activeVehicles = listaVeiculo.filter(veiculo => veiculo.status === 'Ativo');
    
        const usedVehiclesOnDate = listaServico
            .filter(servico => 
                dayjs(date).isSame(dayjs(servico.dataInicio), 'day') || 
                (servico.dataTermino && dayjs(date).isSame(dayjs(servico.dataTermino), 'day')) ||
                dayjs(date).isBetween(dayjs(servico.dataInicio), dayjs(servico.dataTermino), null, '[]')
            )
            .flatMap(servico => servico.veiculos?.map(veiculo => veiculo.placa) || []);
    
        const uniqueUsedVehicles = Array.from(new Set(usedVehiclesOnDate));
    
        return activeVehicles.length > 0 && uniqueUsedVehicles.length >= activeVehicles.length;
    };
    
    const dateFullCellRender = (date: Dayjs) => {
        const isAllVehiclesInUse = areAllVehiclesInUse(date);

        return (
            <div className="ant-picker-cell-inner" style={{ color: isAllVehiclesInUse ? 'red' : undefined }}>
                {date.date()}
            </div>
        );
    };

    const onSelect = (newValue: Dayjs) => {
        setValue(newValue);
        setSelectedValue(newValue);
        setOpenListaServicos(true);
        console.log(newValue);
    };

    return (
        <styled.AgendaContainer>
            <styled.ServiçosTitle>Agende os Serviços!</styled.ServiçosTitle>
            <styled.CenteredCalendar>
                <Button type="primary" block onClick={() => setShowAddModal(true)}>
                    Adicionar Serviço
                </Button>
                <Calendar fullscreen={false} onSelect={onSelect} dateFullCellRender={dateFullCellRender} />
            </styled.CenteredCalendar>
            <styled.Legenda>Clique na data desejada, e visualize, edite ou exclua serviços!</styled.Legenda>
            <ListaServicos selectedValue={selectedValue} listaServico={listaServico} setListaServico={setListaServico} openListaServicos={openListaServicos} setOpenListaServicos={setOpenListaServicos} />
            <AddModal showAddModal={showAddModal} setShowAddModal={setShowAddModal} listaServico={listaServico} setListaServico={setListaServico} veiculos={listaVeiculo} funcionarios={listaFuncionario} />
        </styled.AgendaContainer>
    );
}

export default Agenda;
