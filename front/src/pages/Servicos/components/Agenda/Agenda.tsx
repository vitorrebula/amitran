import React, { useCallback, useState } from 'react';
import * as styled from './Agenda.styles';
import { Button, Calendar } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { ListaServicos } from '../ListaServicos';
import { AddModal } from '../AddModal';
import { ServicosPageProps } from '../../ServicosPage';

function Agenda(props: ServicosPageProps) {
    const { listaVeiculo, listaFuncionario, listaServico, setListaServico, lastRequestDate, setLastRequestDate, buscaServicosPorFaixaDeData } = props;
    const [value, setValue] = useState(() => dayjs());
    const [selectedValue, setSelectedValue] = useState(() => dayjs());
    const [openListaServicos, setOpenListaServicos] = useState<boolean>(false);
    const [showAddModal, setShowAddModal] = useState<boolean>(false);

    const areAllVehiclesInUse = useCallback((date: Dayjs): boolean => {
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
    }, [listaVeiculo, listaServico],);
    
    const fullCellRender = useCallback((date: Dayjs) => {
        const isAllVehiclesInUse = areAllVehiclesInUse(date);

        return (
            <div className="ant-picker-cell-inner" style={{ color: isAllVehiclesInUse ? 'red' : undefined }}>
                {date.date()}
            </div>
        );
    },[areAllVehiclesInUse]);

    const onSelect = (newValue: Dayjs) => {
        setValue(newValue);
        setSelectedValue(newValue);
        setOpenListaServicos(true);
    
        const lastRequestDayJs = dayjs(lastRequestDate);
    
        if (lastRequestDayJs.diff(newValue, 'months') >= 1 || newValue.diff(lastRequestDayJs, 'months') >= 4) {
            const formattedDate = newValue.toISOString();
            buscaServicosPorFaixaDeData(formattedDate);
            setLastRequestDate(newValue.toISOString());
        }
    };

    return (
        <styled.AgendaContainer>
            <styled.ServiçosTitle>Agende os Serviços!</styled.ServiçosTitle>
            <styled.CenteredCalendar>
                <Button type="primary" block onClick={() => setShowAddModal(true)}>
                    Adicionar Serviço
                </Button>
                <Calendar fullscreen={false} onSelect={onSelect} fullCellRender={fullCellRender} />
            </styled.CenteredCalendar>
            <styled.Legenda>Clique na data desejada, e visualize, edite ou exclua serviços!</styled.Legenda>
            <ListaServicos selectedValue={selectedValue} listaServico={listaServico} setListaServico={setListaServico} openListaServicos={openListaServicos} setOpenListaServicos={setOpenListaServicos} />
            <AddModal showAddModal={showAddModal} setShowAddModal={setShowAddModal} listaServico={listaServico} setListaServico={setListaServico} veiculos={listaVeiculo} funcionarios={listaFuncionario} />
        </styled.AgendaContainer>
    );
}

export default Agenda;
