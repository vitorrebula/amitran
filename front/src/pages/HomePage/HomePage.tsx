import React, { Dispatch, SetStateAction } from 'react';
import * as styled from './HomePage.styles';
import { Navbar } from '../../components/Navbar';
import { VeiculosIndicator } from './components/VeiculosIndicator';
import { Veiculo } from '../Veiculos/Veiculos';
import { Servico } from '../Servicos/ServicosPage';
import { Collapse } from 'antd'; 
import { Funcionario } from '../Funcionarios/Funcionarios';

const { Panel } = Collapse; 

interface HomePageProps {
    listaServico: Servico[];
    setListaServico: Dispatch<SetStateAction<Servico[]>>;
    listaVeiculo: Veiculo[];
    setListaVeiculo: Dispatch<SetStateAction<Veiculo[]>>;
    listaFuncionario: Funcionario[];
    setListaFuncionario: Dispatch<SetStateAction<Funcionario[]>>;
}

function HomePage(props: HomePageProps) {
    const { listaServico, listaVeiculo, setListaServico, setListaFuncionario, setListaVeiculo, listaFuncionario } = props;

    return (
        <styled.HomePageContainer>
            <Navbar />
            <Collapse accordion defaultActiveKey={['1']} style={{backgroundColor: 'white', margin: '20px'}}>
                <Panel header="Rotas de Veículos" key="1">
                    <VeiculosIndicator listaFuncionario={listaFuncionario} setListaServico={setListaServico} setListaFuncionario={setListaFuncionario} setListaVeiculo={setListaVeiculo} listaVeiculo={listaVeiculo} listaServico={listaServico} />
                </Panel>
            </Collapse>
        </styled.HomePageContainer>
    );
}

export default HomePage;
