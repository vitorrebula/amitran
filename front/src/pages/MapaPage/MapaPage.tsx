import React, { Dispatch, SetStateAction } from 'react';
import * as styled from './MapaPage.styles';
import { Navbar } from '../../components/Navbar';
import { Servico } from '../Servicos/ServicosPage';
import { RegionMap } from './components/RegionMap';
import { Veiculo } from '../Veiculos/Veiculos';

export interface MapaPageProps {
    listaServico: Servico[];
    listaVeiculo: Veiculo[];
    setListaServico: Dispatch<SetStateAction<Servico[]>>;
    lastRequestDate: string;
    setLastRequestDate: Dispatch<SetStateAction<string>>;
    buscaServicosPorFaixaDeData: (date: string) => Promise<void>;
}

function MapaPage(props: MapaPageProps) {
    const { setListaServico, lastRequestDate, setLastRequestDate, buscaServicosPorFaixaDeData, listaServico, listaVeiculo } = props;

    return (
        <styled.MapaPageContainer>
            <Navbar />
            <RegionMap setListaServico={setListaServico} lastRequestDate={lastRequestDate} setLastRequestDate={setLastRequestDate} buscaServicosPorFaixaDeData={buscaServicosPorFaixaDeData} listaServico={listaServico} listaVeiculo={listaVeiculo}/>
        </styled.MapaPageContainer>
    );
}

export default MapaPage;
