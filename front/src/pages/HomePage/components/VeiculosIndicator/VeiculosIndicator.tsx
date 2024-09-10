import React, { useState, useEffect } from 'react';
import * as styled from './VeiculosIndicator.styles';
import { Servico } from '../../../Servicos/ServicosPage';
import { Select, Divider, Tabs } from 'antd';
import dayjs from 'dayjs';
import { Veiculo } from '../../../Veiculos/Veiculos';

interface VeiculosIndicatorProps {
    listaServico: Servico[];
    listaVeiculo: Veiculo[];
}

function VeiculosIndicator(props: VeiculosIndicatorProps) {
    const { listaServico, listaVeiculo } = props;
    const [veiculoSelecionado, setVeiculoSelecionado] = useState<string | null>(null);
    const [servicosFiltrados, setServicosFiltrados] = useState<Servico[]>([]);

    const ordenarServicos = (servicos: Servico[]) => {
        return servicos.sort((a, b) => dayjs(a.dataInicio).isAfter(dayjs(b.dataInicio)) ? 1 : -1);
    };

    useEffect(() => {
        if (veiculoSelecionado) {
            const veiculoServicos = listaServico.filter(servico =>
                servico.veiculos?.some(veiculo => veiculo.placa === veiculoSelecionado) &&
                dayjs().isBefore(dayjs(servico.dataTermino))
            );
            setServicosFiltrados(ordenarServicos(veiculoServicos));
        } else {
            setServicosFiltrados([]);
        }
    }, [veiculoSelecionado, listaServico]);

    const tabItems = servicosFiltrados.map((servico, index) => ({
        key: `tab-${index}`,
        label: `${servico.nomeCliente}`,
        children: (
            <div style={{ height: '100%', textOverflow: 'ellipsis', wordBreak: 'break-all'}}>
                <p><strong>Cliente:</strong> {servico.nomeCliente}</p>
                <p><strong>Endereço de Origem:</strong> {servico.enderecoOrigem}</p>
                <p><strong>Endereço de Entrega:</strong> {servico.enderecoEntrega}</p>
                <p><strong>Data de Início:</strong> {dayjs(servico.dataInicio).format('DD/MM/YYYY')}</p>
                <p><strong>Data de Término:</strong> {dayjs(servico.dataTermino).format('DD/MM/YYYY')}</p>
                <p>{servico.descricao}</p>
            </div>
        )
    }));

    return (
        <styled.VeiculosIndicatorContainer>
            <styled.HelpBar>
                <h3>Escolha o Veículo desejado, e veja o fluxo de Serviços!</h3>
                <Select
                    placeholder="Selecione um veículo"
                    style={{ width: 200 }}
                    onChange={(value) => setVeiculoSelecionado(value)}
                >
                    {listaVeiculo
                        .filter(veiculo => veiculo.status === 'Ativo')
                        .map(veiculo => (
                            <Select.Option key={veiculo.placa} value={veiculo.placa}>
                                {veiculo.placa}
                            </Select.Option>
                        ))}
                </Select>
            </styled.HelpBar>
            <Divider style={{ marginTop: '5px', marginBottom: '5px' }} />

            {veiculoSelecionado && servicosFiltrados.length > 0 ? (
                <Tabs defaultActiveKey="0" items={tabItems} />
            ) : (
                <div style={{ height: '280px', alignItems: 'center', textAlign: 'center' }}><p>Nenhum serviço disponível para o veículo selecionado.</p></div>
            )}
        </styled.VeiculosIndicatorContainer>
    );
}

export default VeiculosIndicator;
