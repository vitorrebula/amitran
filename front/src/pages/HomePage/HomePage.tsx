import React from 'react';
import * as styled from './HomePage.styles';
import { Navbar } from '../../components/Navbar';
import { VeiculosIndicator } from './components/VeiculosIndicator';
import { Veiculo } from '../Veiculos/Veiculos';
import { Servico } from '../Servicos/ServicosPage';
import { Collapse } from 'antd'; 

const { Panel } = Collapse; 

interface HomePageProps {
    listaVeiculo: Veiculo[];
    listaServico: Servico[];
}

function HomePage(props: HomePageProps) {
    const { listaServico, listaVeiculo } = props;

    return (
        <styled.HomePageContainer>
            <Navbar />
            <Collapse accordion defaultActiveKey={['1']} style={{backgroundColor: 'white', margin: '20px'}}>
                <Panel header="Rotas de Veículos" key="1">
                    <VeiculosIndicator listaVeiculo={listaVeiculo} listaServico={listaServico} />
                </Panel>
            </Collapse>
        </styled.HomePageContainer>
    );
}

export default HomePage;
