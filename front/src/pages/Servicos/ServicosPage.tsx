import React, { Dispatch, SetStateAction } from 'react';
import * as styled from './ServicosPage.styles';
import { Navbar } from '../../components/Navbar';
import { Agenda } from './components/Agenda';
import { Veiculo } from '../Veiculos/Veiculos';
import { Funcionario } from '../Funcionarios/Funcionarios';

export interface Servico {
    id?: number;
    nomeCliente: string;
    enderecoOrigem: string;
    enderecoEntrega: string;
    dataInicio: string;
    dataTermino?: string;
    valor: number;
    descricao?: string;
    funcionarios: Funcionario[];
    veiculos?: Veiculo[];
}

export interface ServicosPageProps {
    listaVeiculo: Veiculo[];
    listaFuncionario: Funcionario[];
    listaServico: Servico[];
    setListaServico: Dispatch<SetStateAction<Servico[]>>;
}

function ServicosPage(props: ServicosPageProps) {
       const {listaVeiculo, listaFuncionario, listaServico, setListaServico}= props;
        return(
            <styled.ServicosPageContainer>
                <Navbar />
                <Agenda listaVeiculo={listaVeiculo} listaFuncionario={listaFuncionario} listaServico={listaServico} setListaServico={setListaServico}/>
            </styled.ServicosPageContainer>
        );
}

export default ServicosPage;