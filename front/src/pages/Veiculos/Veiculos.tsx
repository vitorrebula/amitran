import { Dispatch, SetStateAction, useState } from 'react';
import * as styled from './Veiculos.styles';
import { Navbar } from '../../components/Navbar';
import { MenuDeAcoes } from '../components/MenuDeAcoes';
import { FloatButton } from 'antd';
import AddVeiculo from './components/AddVeiculo/AddVeiculo';
import CardVeiculo from './components/CardVeiculos/CardVeiculos';
import { EditVeiculo } from './components/EditVeiculo';
import { Servico } from '../Servicos/ServicosPage';

export interface Veiculo {
    id: number;
    modelo: string;
    placa: string;
    ano: number;
    status: string;
    tipoVeiculo: string;
    observacoes?: string;
}

export interface VeiculosProps {
    listaVeiculo: Veiculo[];
    setListaVeiculo: Dispatch<SetStateAction<Veiculo[]>>;
    listaServico: Servico[];
    setListaServico: Dispatch<SetStateAction<Servico[]>>;
}

function Veiculos(props: VeiculosProps) {
    const [showAddVeiculo, setShowAddVeiculo] = useState(false);
    const [showEditVeiculo, setShowEditVeiculo] = useState(false);
    const [showInativos, setShowInativos] = useState(false);
    const [searchText, setSearchText] = useState('');
    const { listaVeiculo, setListaVeiculo, listaServico, setListaServico } = props;
    const [veiculoSelecionado, setVeiculoSelecionado] = useState<Veiculo | null>(null);

    const handleEdit = (veiculo: Veiculo) => {
        setVeiculoSelecionado(veiculo);
        setShowEditVeiculo(true);
    };

    return (
        <styled.VeiculosContainer>
            <Navbar />
            <MenuDeAcoes setShowAddModal={setShowAddVeiculo} setCheckBoxEvent={setShowInativos} showCheckBox={true} setSearchText={setSearchText} AddText='Adicionar Veículo' />
            <AddVeiculo setListaVeiculo={setListaVeiculo} setShowAddVeiculo={setShowAddVeiculo} showAddVeiculo={showAddVeiculo} />
            <EditVeiculo
                setShowEditVeiculo={setShowEditVeiculo}
                showEditVeiculo={showEditVeiculo}
                veiculo={veiculoSelecionado ? veiculoSelecionado : undefined}
                setListaVeiculo={setListaVeiculo}
                listaServico={listaServico}
                setListaServico={setListaServico}
            />            
            <styled.ListaVeiculos>
                {showInativos ?
                    (listaVeiculo
                        .filter(veiculo => veiculo.placa.toLowerCase().includes(searchText.toLowerCase()))
                        .sort((a, b) => a.placa.localeCompare(b.placa))
                        .map(veiculo => (
                            <CardVeiculo
                                key={veiculo.id}
                                veiculo={veiculo}
                                setListaVeiculo={setListaVeiculo}
                                setShowEditVeiculo={() => handleEdit(veiculo)}
                                listaServico={listaServico}
                                setListaServico={setListaServico}
                            />
                        ))) : (
                        listaVeiculo
                            .filter(veiculo => veiculo.status === 'Ativo' && veiculo.placa.toLowerCase().includes(searchText.toLowerCase())).sort((a, b) => a.placa.localeCompare(b.placa))
                            .map(veiculo => (
                                <CardVeiculo
                                    key={veiculo.id}
                                    veiculo={veiculo}
                                    setListaVeiculo={setListaVeiculo}
                                    setShowEditVeiculo={() => handleEdit(veiculo)}
                                    listaServico={listaServico}
                                    setListaServico={setListaServico}
                                />
                            ))
                    )}
            </styled.ListaVeiculos>
            <FloatButton.BackTop />
        </styled.VeiculosContainer>
    );
}

export default Veiculos;