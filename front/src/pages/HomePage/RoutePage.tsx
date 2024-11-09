import React, { Dispatch, SetStateAction } from 'react';
import * as styled from './RoutePage.styles';
import { Navbar } from '../../components/Navbar';
import { VeiculosIndicator } from './components/VeiculosIndicator';
import { Veiculo } from '../Veiculos/Veiculos';
import { Servico } from '../Servicos/ServicosPage';
import { Collapse } from 'antd'; 
import { Funcionario } from '../Funcionarios/Funcionarios';
import { Flow } from './components/Flow';


interface RoutePageProps {
    listaServico: Servico[];
    setListaServico: Dispatch<SetStateAction<Servico[]>>;
    listaVeiculo: Veiculo[];
    setListaVeiculo: Dispatch<SetStateAction<Veiculo[]>>;
    listaFuncionario: Funcionario[];
    setListaFuncionario: Dispatch<SetStateAction<Funcionario[]>>;
}

function RoutePage(props: RoutePageProps) {
    const { listaServico, listaVeiculo, setListaServico, setListaFuncionario, setListaVeiculo, listaFuncionario } = props;

    return (
        <styled.RoutePageContainer>
            <Navbar />
            <Flow listaFuncionario={listaFuncionario} setListaServico={setListaServico} setListaFuncionario={setListaFuncionario} setListaVeiculo={setListaVeiculo} listaVeiculo={listaVeiculo} listaServico={listaServico} />
        </styled.RoutePageContainer>
    );
}

export default RoutePage;
