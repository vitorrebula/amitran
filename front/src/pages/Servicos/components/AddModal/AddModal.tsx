import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import * as styled from './AddModal.styles';
import { Col, DatePicker, Form, Input, message, Modal, Row, Select, Tooltip } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { Servico } from '../../ServicosPage';
import { Funcionario } from '../../../Funcionarios/Funcionarios';
import { Veiculo } from '../../../Veiculos/Veiculos';
import axios from 'axios';
import TextArea from 'antd/es/input/TextArea';

dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

interface AddModalProps {
    showAddModal: boolean;
    setShowAddModal: Dispatch<SetStateAction<boolean>>;
    listaServico: Servico[];
    setListaServico: Dispatch<SetStateAction<Servico[]>>;
    funcionarios: Funcionario[];
    veiculos: Veiculo[];
}

function AddModal(props: AddModalProps) {
    const { showAddModal, setShowAddModal, listaServico, setListaServico, funcionarios, veiculos } = props;
    const [datasPreenchidas, setDatasPreenchidas] = useState<boolean>(false);
    const [dataInicio, setDataInicio] = useState<Dayjs | undefined>(undefined);
    const [dataTermino, setDataTermino] = useState<Dayjs | undefined>(undefined);

    const [form] = Form.useForm();

    const handleClose = useCallback(() => {
        setShowAddModal(false);
        setDatasPreenchidas(false);
        form.resetFields();
    },[setShowAddModal, setDatasPreenchidas, form]);

    const verificarDatas = useCallback((dataInicio?: Dayjs, dataTermino?: Dayjs) => {
        if (dataInicio !== undefined) setDataInicio(dataInicio);
        if (dataTermino !== undefined) setDataTermino(dataTermino);

        if (dataInicio && dataTermino) {
            setDatasPreenchidas(dataTermino.isSameOrAfter(dataInicio));
        } else {
            setDatasPreenchidas(false);
        }
    }, [setDataInicio, setDataTermino]);

    const getServicosConflitantes = useCallback((funcionarioId: number, dataInicio: Dayjs, dataTermino?: Dayjs) => {
        return listaServico?.filter(servico =>
            servico?.funcionarios?.some(f => f.id === funcionarioId) &&
            (
                dayjs(dataInicio).isBetween(dayjs(servico?.dataInicio), dayjs(servico?.dataTermino), null, '[]') ||
                (dataTermino && dayjs(dataTermino).isBetween(dayjs(servico?.dataInicio), dayjs(servico?.dataTermino), null, '[]')) ||
                (dayjs(servico?.dataInicio).isBetween(dataInicio, dataTermino ?? dataInicio, null, '[]') ||
                    dayjs(servico?.dataTermino).isBetween(dataInicio, dataTermino ?? dataInicio, null, '[]'))
            )
        );
    }, [listaServico]);

    const getVeiculosConflitantes = useCallback((placa: string, dataInicio: Dayjs, dataTermino?: Dayjs) => {
        return listaServico?.filter(servico =>
            servico?.veiculos?.some(v => v.placa === placa) &&
            (
                dayjs(dataInicio).isBetween(dayjs(servico?.dataInicio), dayjs(servico?.dataTermino), null, '[]') ||
                (dataTermino && dayjs(dataTermino).isBetween(dayjs(servico?.dataInicio), dayjs(servico?.dataTermino), null, '[]')) ||
                (dayjs(servico?.dataInicio).isBetween(dataInicio, dataTermino ?? dataInicio, null, '[]') ||
                    dayjs(servico?.dataTermino).isBetween(dataInicio, dataTermino ?? dataInicio, null, '[]'))
            )
        );
    }, [listaServico]);

    const veiculosDisponiveis = useMemo(() => {
        return veiculos?.filter(veiculo => veiculo.status === 'Ativo');
    }, [veiculos]);
    

    const handleFinish = useCallback(async (values: any) => {
        const dataInicio = dayjs(values.dataInicio);
        const dataTermino = values.dataTermino ? dayjs(values.dataTermino) : undefined;
    
        if (dataTermino && dataTermino.isBefore(dataInicio)) {
            message.error('A data de término não pode ser antes da data de início.');
            return;
        }
    
        const funcionariosSelecionados: Funcionario[] = values.motoristas?.concat(values.ajudantes)
            .filter((id: number | undefined) => id !== undefined && id !== null)
            .map((id: number) => {
                const funcionario = funcionarios.find(func => func.id === id);
                return funcionario as Funcionario;
            });
    
        if (!funcionariosSelecionados || funcionariosSelecionados.length === 0) {
            message.error('É necessário selecionar ao menos um funcionário.');
            return;
        }
    
        const newServico: Servico = {
            nomeCliente: values.nomeCliente,
            enderecoOrigem: values.enderecoOrigem,
            enderecoEntrega: values.enderecoEntrega,
            dataInicio: values.dataInicio.toISOString(),
            dataTermino: values.dataTermino?.toISOString(),
            valor: values.valor || 0,
            descricao: values.descricao || '',
            funcionarios: funcionariosSelecionados,
        };
    
        if (values.veiculos && values.veiculos.length > 0) {
            newServico.veiculos = values.veiculos.map((placa: string) => ({ placa } as Veiculo));
        }
    
        try {
            const response = await axios.post('http://localhost:8080/servico', newServico);
            
            const servicoComId = { ...newServico, id: response.data.id };
            
            setListaServico(prev => [...prev, servicoComId]);
            message.success('Serviço adicionado com sucesso!');
            handleClose();
        } catch (error) {
            message.error('Erro ao adicionar o serviço. Tente novamente.');
            console.error('Erro ao adicionar serviço:', error);
        }
    }, [funcionarios, setListaServico, handleClose]);

    const motoristas = useMemo(() => {
        return funcionarios?.filter(func =>
            (func.cargo === 'Motorista' || func.cargo === 'Chapa Motorista') &&
            func.status === 'Ativo'
        );
    }, [funcionarios]);
    
    const ajudantes = useMemo(() => {
        return funcionarios?.filter(func =>
            (func.cargo === 'Ajudante' || func.cargo === 'Chapa Ajudante') &&
            func.status === 'Ativo'
        );
    }, [funcionarios]);
    
    useEffect(() => {
        form.setFieldsValue({ motoristas: [], ajudantes: [], veiculos: [] });
    }, [dataInicio, dataTermino, form]);

    return (
        <styled.AddModalContainer>
            <Modal
                title="Adicionar Serviço"
                open={showAddModal}
                centered
                onOk={() => document.querySelector('form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}
                onCancel={handleClose}
                width={800}
                onClose={handleClose}
                destroyOnClose
            >
                <Form layout="vertical" onFinish={handleFinish} form={form}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Nome do Cliente"
                                name="nomeCliente"
                                rules={[{ required: true, message: 'Por favor, insira o nome do cliente' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Endereço de Origem"
                                name="enderecoOrigem"
                                rules={[{ required: true, message: 'Por favor, insira o endereço de origem' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Endereço de Entrega"
                                name="enderecoEntrega"
                                rules={[{ required: true, message: 'Por favor, insira o endereço de entrega' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Data de Início"
                                        name="dataInicio"
                                        rules={[{ required: true, message: 'Por favor, selecione a data de início' }]}
                                    >
                                        <DatePicker format="DD/MM/YYYY" onChange={(date) => verificarDatas(date ?? undefined, dataTermino)} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Data de Término"
                                        name="dataTermino"
                                        rules={[{ required: true, message: 'Por favor, selecione a data de início' }]}
                                    >
                                        <DatePicker format="DD/MM/YYYY" onChange={(date) => verificarDatas(dataInicio, date ?? undefined)} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item
                                label="Valor"
                                name="valor"
                                rules={[{ required: true, message: 'Por favor, insira o valor do serviço' }]}
                            >
                                <Input type="number" min={0} step="0.01" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="Motoristas" name="motoristas">
                                        <Select mode="multiple" placeholder="Selecione os motoristas" disabled={!datasPreenchidas}>
                                            {motoristas.map(funcionario => {
                                                const servicosConflitantes = getServicosConflitantes(funcionario.id, dataInicio!, dataTermino);
                                                const optionDisabled = servicosConflitantes?.length > 0;

                                                return (
                                                    <Select.Option key={funcionario.id} value={funcionario.id} disabled={optionDisabled}>
                                                        <Tooltip
                                                            title={optionDisabled ?
                                                                servicosConflitantes.map(servico => (
                                                                    `${servico.nomeCliente} ${dayjs(servico.dataInicio).format('DD/MM/YYYY')} - ${dayjs(servico.dataTermino).format('DD/MM/YYYY')} \n`
                                                                )).join(', ') :
                                                                ''}>
                                                            {funcionario.username}
                                                        </Tooltip>
                                                    </Select.Option>
                                                );
                                            })}
                                        </Select>

                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Ajudantes" name="ajudantes">
                                    <Select mode="multiple" placeholder="Selecione os motoristas" disabled={!datasPreenchidas}>
                                            {ajudantes.map(funcionario => {
                                                const servicosConflitantes = getServicosConflitantes(funcionario.id, dataInicio!, dataTermino);
                                                const optionDisabled = servicosConflitantes?.length > 0;

                                                return (
                                                    <Select.Option key={funcionario.id} value={funcionario.id} disabled={optionDisabled}>
                                                        <Tooltip
                                                            title={optionDisabled ?
                                                                servicosConflitantes.map(servico => (
                                                                    `${servico.nomeCliente} ${dayjs(servico.dataInicio).format('DD/MM/YYYY')} - ${dayjs(servico.dataTermino).format('DD/MM/YYYY')} \n`
                                                                )).join(', ') :
                                                                ''}>
                                                            {funcionario.username}
                                                        </Tooltip>
                                                    </Select.Option>
                                                );
                                            })}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item
                                label="Veículos"
                                name="veiculos"
                            >
                                <Select mode="multiple" placeholder="Selecione os veículos" disabled={!datasPreenchidas}>
                                    {veiculosDisponiveis.map(veiculo => {
                                        const servicosConflitantes = getVeiculosConflitantes(veiculo.placa, dataInicio!, dataTermino);
                                        const optionDisabled = servicosConflitantes?.length > 0;

                                        return (
                                            <Select.Option key={veiculo.placa} value={veiculo.placa} disabled={optionDisabled}>
                                                <Tooltip
                                                    title={optionDisabled ?
                                                        servicosConflitantes.map(servico => (
                                                            `${servico.nomeCliente} ${dayjs(servico.dataInicio).format('DD/MM/YYYY')} - ${dayjs(servico.dataTermino).format('DD/MM/YYYY')} \n`
                                                        )).join(', ') :
                                                        ''}>
                                                    {veiculo.placa}
                                                </Tooltip>
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Descrição"
                                name="descricao"
                                rules={[{ required: false, message: 'Por favor, insira a descrição do serviço' }]}
                            >
                                <TextArea rows={6} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </styled.AddModalContainer>
    );
}

export default AddModal;
