import React, { Dispatch, SetStateAction, useEffect } from 'react';
import * as styled from './EditVeiculo.styles';
import { Button, Col, Drawer, Form, Input, Row, Select, Space } from 'antd';
import axios from 'axios';
import { Veiculo } from '../../Veiculos';

interface EditVeiculoProps {
    setShowEditVeiculo: Dispatch<SetStateAction<boolean>>;
    showEditVeiculo: boolean;
    veiculo?: Veiculo;
    setListaVeiculo: Dispatch<SetStateAction<Veiculo[]>>;
}

const { Option } = Select;

function EditVeiculo(props: EditVeiculoProps) {
    const { setShowEditVeiculo, showEditVeiculo, veiculo, setListaVeiculo } = props;

    const [form] = Form.useForm();

    useEffect(() => {
        if (veiculo) {
            form.setFieldsValue({
                ...veiculo,
            });
        }
    }, [veiculo, form]);

    const AtualizarVeiculo = async (values: Veiculo) => {
        try {
            const dataToSend = {
                ...values,
                id: veiculo?.id,
            };
    
            const response = await axios.put(`http://localhost:8080/veiculo/${veiculo?.placa}`, dataToSend);            const veiculoAtualizado = response.data; 
            setListaVeiculo(prev => 
                prev.map(veiculo => 
                    veiculo.id === veiculoAtualizado.id ? veiculoAtualizado : veiculo
                )
            )
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
                    onFinish={AtualizarVeiculo}
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
                                <Input placeholder="Insira a Placa" />
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
                                <Input.TextArea rows={4} placeholder="Caso queira, insira observações sobre o Veículo." />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </styled.EditVeiculoContainer>
    );
}

export default EditVeiculo;
