import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import * as styled from './EditVeiculo.styles';
import { Button, Col, Drawer, Form, Input, message, Modal, Row, Select, Space } from 'antd';
import axios from 'axios';
import { Veiculo } from '../../Veiculos';
import dayjs from 'dayjs';
import { Servico } from '../../../Servicos/ServicosPage';

interface EditVeiculoProps {
    setShowEditVeiculo: Dispatch<SetStateAction<boolean>>;
    showEditVeiculo: boolean;
    veiculo?: Veiculo;
    setListaVeiculo: Dispatch<SetStateAction<Veiculo[]>>;
    listaServico: Servico[];
    setListaServico: Dispatch<SetStateAction<Servico[]>>;
}

const { Option } = Select;

function EditVeiculo(props: EditVeiculoProps) {
    const { setShowEditVeiculo, showEditVeiculo, veiculo, setListaVeiculo, listaServico, setListaServico } = props;

    const [form] = Form.useForm();
    const [modalVisible, setModalVisible] = useState(false);
    const [futureServicos, setFutureServicos] = useState<Servico[]>([]);

    useEffect(() => {
        if (veiculo) {
            form.setFieldsValue({
                ...veiculo,
            });
        }
    }, [veiculo, form]);

    const handleSave = async (values: Veiculo) => {
        if (values.status === 'Inativo') {
            const futureServices = listaServico.filter(servico =>
                dayjs(servico.dataInicio).isAfter(dayjs()) || dayjs(servico.dataTermino).isAfter(dayjs()) &&
                servico.veiculos?.some(v => v.id === veiculo?.id)
            );

            if (futureServices.length > 0) {
                setFutureServicos(futureServices);
                setModalVisible(true);
            } else {
                await AtualizarVeiculo(values);
            }
        } else {
            await AtualizarVeiculo(values);
        }
    };

    const handleConfirm = async () => {
        for (const servico of futureServicos) {
            const updatedService = {
                ...servico,
                veiculos: servico.veiculos?.filter(v => v.id !== veiculo?.id)
            };

            await axios.put(`http://localhost:8080/servico`, updatedService);
            setListaServico(prev =>
                prev.map(s => s.id === servico.id ? updatedService : s)
            );
        }

        setModalVisible(false);
        await AtualizarVeiculo(form.getFieldsValue());
    };

    const AtualizarVeiculo = async (values: Veiculo) => {
        try {
            const dataToSend = {
                ...values,
                id: veiculo?.id,
            };
    
            const response = await axios.put(`http://localhost:8080/veiculo/${veiculo?.placa}`, dataToSend);            
            const veiculoAtualizado = response.data; 
            setListaVeiculo(prev => 
                prev.map(veiculo => 
                    veiculo.id === veiculoAtualizado.id ? veiculoAtualizado : veiculo
                )
            )
            message.success('Veículo editado com sucesso!');

            setShowEditVeiculo(false);
        } catch (error) {
            console.error("Erro ao atualizar os dados:", error);
        }
    };

    return (
        <styled.EditVeiculoContainer>
            <Drawer
                title="Editar Veículo"
                style={{ position: 'relative' }}
                open={showEditVeiculo}
                onClose={() => setShowEditVeiculo(false)}
                extra={
                    <Space style={{ position: 'absolute', bottom: '10px', left: '200px' }}>
                        <Button onClick={() => setShowEditVeiculo(false)}>Cancelar</Button>
                        <Button onClick={() => form.submit()} type="primary">
                            Alterar
                        </Button>
                    </Space>
                }
            >
                <Form
                    form={form}
                    layout="vertical"
                    hideRequiredMark
                    onFinish={handleSave}
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="modelo"
                                label="Modelo"
                                rules={[{ required: true, message: 'Insira o Modelo' }]}
                            >
                                <Input placeholder="Insira o Modelo" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="placa"
                                label="Placa"
                                rules={[{ required: true, message: 'Insira a Placa' }]}
                            >
                                <Input placeholder="Insira a Placa" disabled/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="ano"
                                label="Ano"
                                rules={[{ required: true, message: 'Insira o Ano' }]}
                            >
                                <Input type="number" placeholder="Insira o Ano" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                        <Form.Item
                                name="status"
                                label="Status"
                                rules={[{ required: true, message: 'Insira o Status' }]}
                            >
                                <Select placeholder="Insira o status">
                                    <Option value="Ativo">Ativo</Option>
                                    <Option value="Inativo">Inativo</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        </Row>
                        <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="tipoVeiculo"
                                label="Tipo de Veículo"
                                rules={[{ required: true, message: 'Insira o Tipo de Veículo' }]}
                            >
                                <Select placeholder="Selecione o Tipo de Veículo">
                                    <Option value="Caminhão">Caminhão</Option>
                                    <Option value="Prancha">Prancha</Option>
                                    <Option value="Van">Van</Option>
                                    <Option value="Kombi">Kombi Aberta</Option>
                                    <Option value="Moto">Moto</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="observacoes"
                                label="Observações"
                                rules={[
                                    {
                                        required: false,
                                    },
                                ]}
                            >
                                <Input.TextArea rows={3} placeholder="Caso queira, insira observações sobre o Veículo." />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>

            <Modal
                title="Você está Inativando um Veículo que estará em um Serviço futuro, deseja confirmar?"
                open={modalVisible}
                onOk={handleConfirm}
                onCancel={() => setModalVisible(false)}
                okText="Confirmar"
                cancelText="Cancelar"
            >
                <h3>Ao confirmar, o Veículo será retirado dos seguintes serviços:</h3>
                <ul style={{listStyle: 'none'}}>
                    {futureServicos.map(servico => (
                        <li key={servico.id}>
                            {`${servico.nomeCliente}: ${dayjs(servico.dataInicio).format('DD/MM/YYYY')} > ${dayjs(servico.dataTermino).format('DD/MM/YYYY')}`}
                        </li>
                    ))}
                </ul>
            </Modal>
        </styled.EditVeiculoContainer>
    );
}

export default EditVeiculo;
