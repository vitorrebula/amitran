import React, { Dispatch, SetStateAction } from 'react';
import * as styled from './AddFuncionario.styles';
import { Button, Col, DatePicker, Drawer, Form, Input, message, Row, Select, Space } from 'antd';
import axios from 'axios';
import { Funcionario } from '../../Funcionarios';
import dayjs from 'dayjs';
import MaskedInput from 'antd-mask-input';

interface AddFuncionarioProps {
    setShowAddFunc: Dispatch<SetStateAction<boolean>>;
    showAddFunc: boolean;
    setListaFuncionario: Dispatch<SetStateAction<Funcionario[]>>;
}

const { Option } = Select;

function AddFuncionario(props: AddFuncionarioProps) {
    const { setShowAddFunc, showAddFunc, setListaFuncionario } = props;

    const [form] = Form.useForm();

    const PostarFuncionario = async (values: any) => {
        try {
            const cpfSemMascara = values.cpf.replace(/\D/g, '');

            const formattedDate = dayjs(values.dataAdmissao).toISOString();
            const dataToSend = {
                ...values,
                cpf: cpfSemMascara,
                dataAdmissao: formattedDate,
            };

            const response = await axios.post('http://192.168.0.13:8080/Funcionario', dataToSend);
            const novoFuncionario = response.data;

            setListaFuncionario(prev => [...prev, novoFuncionario]);
            message.success('Funcionário adicionado com sucesso!');

            setShowAddFunc(false);
            form.resetFields();
        } catch (error) {
            console.error("Erro ao enviar os dados:", error);
        }
    };

    const handleClose = () => {
        form.resetFields();
        setShowAddFunc(false);
    };

    return (
        <styled.AddFuncionarioContainer>
            <Drawer
                title="Adicionar Funcionário"
                style={{ position: 'relative' }}
                open={showAddFunc}
                onClose={handleClose}
                extra={
                    <Space style={{ position: 'absolute', bottom: '10px', left: '200px', zIndex: 3 }}>
                        <Button onClick={handleClose}>Cancel</Button>
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
                    onFinish={PostarFuncionario}
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="username"
                                label="Name"
                                rules={[{ required: true, message: 'Insira o Nome' }]}
                            >
                                <Input placeholder="Insira o Nome" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
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
                        <Col span={12}>
                            <Form.Item
                                name="dataAdmissao"
                                label="Data de Admissao"
                                rules={[{ required: true, message: 'Escolha uma Data' }]}
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    getPopupContainer={(trigger) => trigger.parentElement!}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="cargo"
                                label="Cargo"
                                rules={[{ required: true, message: 'Selecione o Cargo' }]}
                            >
                                <Select placeholder="Insira o cargo">
                                    <Option value="Ajudante">Ajudante</Option>
                                    <Option value="Motorista">Motorista</Option>
                                    <Option value="Chapa Ajudante">Chapa Ajudante</Option>
                                    <Option value="Chapa Motorista">Chapa Motorista</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={16}>
                            <Form.Item
                                name="cpf"
                                label="CPF"
                                rules={[{ required: true, message: 'Insira o CPF' }]}
                            >
                                <MaskedInput
                                    mask="000.000.000-00"
                                    placeholder="Insira o CPF"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="tipoCNH"
                                label="CNH"
                                rules={[{ required: true, message: 'CNH' }]}
                            >
                                <Select placeholder="CNH">
                                    <Option value="A">A</Option>
                                    <Option value="B">B</Option>
                                    <Option value="AB">AB</Option>
                                    <Option value="C">C</Option>
                                    <Option value="D">D</Option>
                                    <Option value="E">E</Option>
                                    <Option value="N/D">N/D</Option>
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
                                <Input.TextArea rows={2} placeholder="Caso queira, insira observações sobre o Funcionário." />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </styled.AddFuncionarioContainer>
    );
}

export default AddFuncionario;
