import React, { Dispatch, SetStateAction } from 'react';
import * as styled from './AddVeiculo.styles';
import { Button, Col, Drawer, Form, Input, message, Row, Select, Space } from 'antd';
import { Veiculo } from '../../Veiculos';
import { url } from '../../../../url';
import { api } from '../../../../axios';

interface AddVeiculoProps {
    setShowAddVeiculo: Dispatch<SetStateAction<boolean>>;
    showAddVeiculo: boolean;
    setListaVeiculo: Dispatch<SetStateAction<Veiculo[]>>;
}

const { Option } = Select;

function AddVeiculo(props: AddVeiculoProps) {
    const { setShowAddVeiculo, showAddVeiculo, setListaVeiculo } = props;

    const [form] = Form.useForm();

    const PostarVeiculo = async (veiculo: Veiculo) => {
        try {
            const formattedVeiculo = {
                ...veiculo,
                placa: veiculo.placa.toUpperCase(),
            };

            const response = await api.post(`${url}/veiculo`, formattedVeiculo);
            const novoVeiculo = response.data;

            setListaVeiculo(prev => [...prev, novoVeiculo]);
            message.success('Veículo adicionado com sucesso!');

            setShowAddVeiculo(false);
        } catch (error) {
            console.error("Erro ao enviar os dados:", error);
        }
    };

    const handlePlacaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toUpperCase();
        form.setFieldsValue({ placa: value });
    };

    return (
        <styled.AddVeiculoContainer>
            <Drawer
                title="Adicionar Veículo"
                style={{ position: 'relative' }}
                open={showAddVeiculo}
                onClose={() => setShowAddVeiculo(false)}
                extra={
                    <Space style={{ position: 'absolute', bottom: '10px', left: '200px', zIndex: 3 }}>
                        <Button onClick={() => setShowAddVeiculo(false)}>Cancel</Button>
                        <Button onClick={() => form.submit()} type="primary">
                            Enviar
                        </Button>
                    </Space>
                }
            >
                <Form
                    form={form}
                    layout="vertical"
                    hideRequiredMark
                    onFinish={PostarVeiculo}
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="modelo"
                                label="Modelo"
                                rules={[{ required: true, message: 'Insira o Modelo' }]}
                            >
                                <Input placeholder="Insira o Modelo do Veículo" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="placa"
                                label="Placa"
                                rules={[
                                    { required: true, message: 'Insira a Placa' },
                                    { len: 7, message: 'Insira placa válida.'},
                                ]}
                            >
                                <Input
                                    maxLength={7} 
                                    placeholder="Insira a Placa"
                                    onChange={handlePlacaChange} 
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="ano"
                                label="Ano"
                                rules={[{ required: true, message: 'Insira o Ano' }]}
                            >
                                <Input placeholder="Insira o Ano de Fabricação" />
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
                                <Input.TextArea rows={2} placeholder="Caso queira, insira observações sobre o Veículo." />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </styled.AddVeiculoContainer>
    );
}

export default AddVeiculo;