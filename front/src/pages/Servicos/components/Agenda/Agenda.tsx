import React, { useEffect, useState } from 'react';
import * as styled from './Agenda.styles';
import { Alert, Badge, BadgeProps, Button, Calendar, CalendarProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { ListaServicos } from '../ListaServicos';
import { Funcionario } from '../../../Funcionarios/Funcionarios';
import axios from 'axios';
import { Servico, ServicosPageProps } from '../../ServicosPage';

function Agenda(props: ServicosPageProps) {
    const {listaVeiculo, listaFuncionario, listaServico, setListaServico} = props;
    const [value, setValue] = useState(() => dayjs());
    const [selectedValue, setSelectedValue] = useState(() => dayjs());
    const [openListaServicos, setOpenListaServicos] = useState<boolean>(false);

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
                <Button type="primary" block>
                    Adicionar Serviço
                </Button>
                <Calendar fullscreen={false} onSelect={onSelect} />
            </styled.CenteredCalendar>
            <styled.Legenda>Clique na data desejada, e visualize, edite ou exclua serviços!</styled.Legenda>
            <ListaServicos selectedValue={selectedValue} listaServico={listaServico} setListaServico={setListaServico} openListaServicos={openListaServicos} setOpenListaServicos={setOpenListaServicos} />
        </styled.AgendaContainer>
    );
}

export default Agenda;