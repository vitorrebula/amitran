import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
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
import * as styled from './EditModal.styles';
import { url } from '../../../../url';

dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

interface EditarModalProps {
    showEditarModal: boolean;
    setShowEditarModal: Dispatch<SetStateAction<boolean>>;
    listaServico: Servico[];
    setListaServico: Dispatch<SetStateAction<Servico[]>>;
    listaFuncionario: Funcionario[];
    listaVeiculo: Veiculo[];
    servico?: Servico;
}

function EditarModal(props: EditarModalProps) {
    const { showEditarModal, setShowEditarModal, listaServico, setListaServico, listaFuncionario, listaVeiculo, servico } = props;
    const [datasPreenchidas, setDatasPreenchidas] = useState<boolean>(true);
    const [dataInicio, setDataInicio] = useState<Dayjs | undefined>(undefined);
    const [dataTermino, setDataTermino] = useState<Dayjs | undefined>(undefined);

    const [form] = Form.useForm();

    useEffect(() => {
        if(showEditarModal && servico){
            setDataInicio(dayjs(servico.dataInicio));
            setDataTermino(dayjs(servico.dataTermino));
            form.setFieldsValue({
                nomeCliente: servico.nomeCliente,
                enderecoOrigem: servico.enderecoOrigem,
                enderecoEntrega: servico.enderecoEntrega,
                dataInicio: dayjs(servico.dataInicio),
                dataTermino: dayjs(servico.dataTermino),
                valor: servico.valor,
                descricao: servico.descricao,
                motoristas: servico.funcionarios?.filter(f => f.cargo === 'Motorista' || f.cargo === 'Chapa Motorista').map(f => f.id),
                ajudantes: servico.funcionarios?.filter(f => f.cargo === 'Ajudante' || f.cargo === 'Chapa Ajudante').map(f => f.id),
                veiculos: servico.veiculos?.map(v => v.placa),
            });
        }
    }, [form, servico, showEditarModal]);

    const handleClose = useCallback(() => {
        setShowEditarModal(false);
        form.resetFields();
    }, [setShowEditarModal, form]);

    const verificarDatas = useCallback((dataI?: Dayjs, dataT?: Dayjs) => {
        if (dataI !== undefined) setDataInicio(dataI);
        if (dataT !== undefined) setDataTermino(dataT);

        if (dataInicio && dataTermino) {
            setDatasPreenchidas(dataTermino.isSameOrAfter(dataInicio));
        } else {
            setDatasPreenchidas(false);
        }
    }, [setDataInicio, setDataTermino, dataInicio, dataTermino]);

    const verificaMudancaDeDatas = useCallback(() => {
        const dataInicioAtual = form.getFieldValue('dataInicio');
        const dataTerminoAtual = form.getFieldValue('dataTermino');
    
        if (!dataInicioAtual || !dataTerminoAtual) {
            setDatasPreenchidas(false);
        }
        
        form.setFieldsValue({ motoristas: [], ajudantes: [], veiculos: [] });
    }, [form]);

    const getServicosConflitantes = useCallback((funcionarioId: number, dataInicio: Dayjs, dataTermino?: Dayjs) => {
        return listaServico?.filter(servico =>
            servico.id !== props.servico?.id &&
            servico?.funcionarios?.some(f => f.id === funcionarioId) &&
            (
                dayjs(dataInicio).isBetween(dayjs(servico?.dataInicio), dayjs(servico?.dataTermino), null, '[]') ||
                (dataTermino && dayjs(dataTermino).isBetween(dayjs(servico?.dataInicio), dayjs(servico?.dataTermino), null, '[]')) ||
                (dayjs(servico?.dataInicio).isBetween(dataInicio, dataTermino ?? dataInicio, null, '[]') ||
                    dayjs(servico?.dataTermino).isBetween(dataInicio, dataTermino ?? dataInicio, null, '[]'))
            )
        );
    }, [listaServico, props.servico?.id]);
    

    const getVeiculosConflitantes = useCallback((placa: string, dataInicio: Dayjs, dataTermino?: Dayjs) => {
        return listaServico?.filter(servico =>
            servico.id !== props.servico?.id &&
            servico?.veiculos?.some(v => v.placa === placa) &&
            (
                dayjs(dataInicio).isBetween(dayjs(servico?.dataInicio), dayjs(servico?.dataTermino), null, '[]') ||
                (dataTermino && dayjs(dataTermino).isBetween(dayjs(servico?.dataInicio), dayjs(servico?.dataTermino), null, '[]')) ||
                (dayjs(servico?.dataInicio).isBetween(dataInicio, dataTermino ?? dataInicio, null, '[]') ||
                    dayjs(servico?.dataTermino).isBetween(dataInicio, dataTermino ?? dataInicio, null, '[]'))
            )
        );
    }, [listaServico, props.servico?.id]);

    const veiculosDisponiveis = useMemo(() => {
        return listaVeiculo?.filter(veiculo => veiculo.status === 'Ativo');
    }, [listaVeiculo]);

    const handleFinish = useCallback(async (values: any) => {
        const dataInicio = dayjs(values.dataInicio).toISOString();
        const dataTermino = dayjs(values.dataTermino).toISOString();
    
        if (dataTermino && dayjs(dataTermino).isBefore(dayjs(dataInicio))) {
            message.error('A data de término não pode ser antes da data de início.');
            return;
        }
    
        const funcionariosSelecionados: Funcionario[] = values.motoristas?.concat(values.ajudantes)
            .filter((id: number | undefined) => id !== undefined && id !== null)
            .map((id: number) => {
                const funcionario = listaFuncionario.find(func => func.id === id);
                return funcionario as Funcionario;
            });
    
        if (!funcionariosSelecionados || funcionariosSelecionados.length === 0) {
            message.error('É necessário selecionar ao menos um funcionário.');
            return;
        }
    
        const updatedServico: Servico = {
            ...servico,
            nomeCliente: values.nomeCliente,
            enderecoOrigem: values.enderecoOrigem,
            enderecoEntrega: values.enderecoEntrega,
            dataInicio: dataInicio,
            dataTermino: dataTermino,
            valor: values.valor || 0,
            descricao: values.descricao || '',
            funcionarios: funcionariosSelecionados,
        };
    
        if (values.veiculos && values.veiculos.length > 0) {
            updatedServico.veiculos = values.veiculos.map((placa: string) => ({ placa } as Veiculo));
        }
    
        try {
            const response = await axios.put(`${url}/servico`, updatedServico);
    
            const servicoAtualizado = { ...updatedServico, id: response.data.id };
    
            setListaServico(prev => prev.map(s => (s.id === servicoAtualizado.id ? servicoAtualizado : s)));
            message.success('Serviço atualizado com sucesso!');
            handleClose();
        } catch (error) {
            message.error('Erro ao atualizar o serviço. Tente novamente.');
            console.error('Erro ao atualizar serviço:', error);
        }
    }, [listaFuncionario, servico, setListaServico, handleClose]);

    const motoristas = useMemo(() => {
        return listaFuncionario?.filter(func =>
            (func.cargo === 'Motorista' || func.cargo === 'Chapa Motorista') &&
            func.status === 'Ativo'
        );
    }, [listaFuncionario]);

    const ajudantes = useMemo(() => {
        return listaFuncionario?.filter(func =>
            (func.cargo === 'Ajudante' || func.cargo === 'Chapa Ajudante') &&
            func.status === 'Ativo'
        );
    }, [listaFuncionario]);

    return (
        <styled.EditModalContainer>
            <Modal
                title="Editar Serviço"
                open={showEditarModal}
                centered
                onOk={() => document.querySelector('form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}
                onCancel={handleClose}
                width={800}
                onClose={handleClose}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={handleFinish}>
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
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
                                        <DatePicker format="DD/MM/YYYY" onChange={(date) => {verificarDatas(date ? date : undefined, dataTermino); verificaMudancaDeDatas();}} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Data de Término"
                                        name="dataTermino"
                                        rules={[{ required: true, message: 'Por favor, selecione a data de início' }]}
                                    >
                                        <DatePicker format="DD/MM/YYYY" onChange={(date) => {verificarDatas(dataInicio, date ? date : undefined); verificaMudancaDeDatas();}} />
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
                        <Col xs={24} md={12}>
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
                                                            {funcionario.nome}
                                                        </Tooltip>
                                                    </Select.Option>
                                                );
                                            })}
                                        </Select>

                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Ajudantes" name="ajudantes">
                                        <Select mode="multiple" placeholder="Selecione os ajudantes" disabled={!datasPreenchidas}>
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
                                                            {funcionario.nome}
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
        </styled.EditModalContainer>
    );
}

export default EditarModal;
