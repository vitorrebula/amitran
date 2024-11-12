import React, { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react';
import ReactFlow, { Background, Controls, Node, Edge, Position } from 'reactflow';
import 'reactflow/dist/style.css';
import dayjs from 'dayjs';
import { Servico } from '../../../Servicos/ServicosPage';
import { Veiculo } from '../../../Veiculos/Veiculos';
import { Funcionario } from '../../../Funcionarios/Funcionarios';
import { Select, Divider } from 'antd';
import * as styled from './Flow.styles';
import CustomNode from './utils/CustomNode';
import { EditModal } from '../../../Servicos/components/EditModal';

interface FlowProps {
    listaServico: Servico[];
    setListaServico: Dispatch<SetStateAction<Servico[]>>;
    listaVeiculo: Veiculo[];
    setListaVeiculo: Dispatch<SetStateAction<Veiculo[]>>;
    listaFuncionario: Funcionario[];
    setListaFuncionario: Dispatch<SetStateAction<Funcionario[]>>;
}

const nodeTypes = {
    customNode: CustomNode,
};

function Flow({ listaServico, listaVeiculo, listaFuncionario, setListaServico }: FlowProps) {
    const [veiculoSelecionado, setVeiculoSelecionado] = useState<string | null>(null);
    const [servicosFiltrados, setServicosFiltrados] = useState<Servico[]>([]);
    const [isEditarModalVisible, setIsEditarModalVisible] = useState(false);
    const [servicoSelecionado, setServicoSelecionado] = useState<Servico | undefined>(undefined);

    const abrirEditarModal = (servico: Servico) => {
        setServicoSelecionado(servico);
        setIsEditarModalVisible(true);
    };

    const ordenarServicos = (servicos: Servico[]) => {
        return servicos.sort((a, b) => dayjs(a.dataInicio).isAfter(dayjs(b.dataInicio)) ? 1 : -1);
    };

    useEffect(() => {
        if (veiculoSelecionado) {
            const veiculoServicos = listaServico.filter(servico =>
                servico.veiculos?.some(veiculo => veiculo.placa === veiculoSelecionado) &&
                dayjs().isBefore(dayjs(servico.dataTermino))
            );
            const sortedServicos = ordenarServicos(veiculoServicos);
            setServicosFiltrados(sortedServicos);
        }
    }, [veiculoSelecionado, listaServico]);

    const createNodesAndEdges = useCallback(() => {
        const nodes: Node[] = servicosFiltrados.map((servico, index) => ({
            id: String(servico.id),
            type: 'customNode',
            position: { x: 400 * index, y: 100 },
            data: {
                servico,
                onEdit: () => abrirEditarModal(servico),
            },
        }));

        const edges: Edge[] = servicosFiltrados.slice(1).map((_, index) => ({
            id: `e${index}-${index + 1}`,
            source: String(servicosFiltrados[index].id),
            target: String(servicosFiltrados[index + 1].id),
            type: 'smoothstep',
        }));

        return { nodes, edges };
    }, [servicosFiltrados]);

    const { nodes, edges } = createNodesAndEdges();

    return (
        <styled.FlowContainer>
            <h3>Escolha o Veículo desejado, e veja o fluxo de Serviços!</h3>
            <Select
                placeholder="Selecione um veículo"
                style={{ width: 200, marginBottom: 10 }}
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
            <Divider style={{ marginTop: '5px', marginBottom: '5px' }} />
            <div className='flow-content'>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    style={{ width: '100%', height: 500 }}
                    fitView
                >
                    <Background color="#aaa" gap={16} />
                    <Controls />
                </ReactFlow>
            </div>
            {isEditarModalVisible && (
                <EditModal
                    showEditarModal={isEditarModalVisible}
                    setShowEditarModal={setIsEditarModalVisible}
                    listaServico={listaServico}
                    setListaServico={setListaServico}
                    listaFuncionario={listaFuncionario}
                    listaVeiculo={listaVeiculo}
                    servico={servicoSelecionado}
                />
            )}
        </styled.FlowContainer>
    );
}

export default Flow;
