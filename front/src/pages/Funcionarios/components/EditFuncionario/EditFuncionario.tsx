import React, { Dispatch, SetStateAction, useEffect } from 'react';
import * as styled from './EditFuncionario.styles';
import { Button, Col, DatePicker, Drawer, Form, Input, message, Row, Select, Space } from 'antd';
import axios from 'axios';
import { Funcionario } from '../../Funcionarios';
import dayjs from 'dayjs';

interface EditFuncionarioProps {
    setShowEditFunc: Dispatch<SetStateAction<boolean>>;
    showEditFunc: boolean;
    funcionario?: Funcionario;
    setListaFuncionario: Dispatch<SetStateAction<Funcionario[]>>;
}

const { Option } = Select;

function EditFuncionario(props: EditFuncionarioProps) {
    const { setShowEditFunc, showEditFunc, funcionario, setListaFuncionario } = props;

    const [form] = Form.useForm();

    useEffect(() => {
        if (funcionario) {
            form.setFieldsValue({
                ...funcionario,
                dataAdmissao: dayjs(funcionario.dataAdmissao), 
                tipoCNH: funcionario.tipoCNH, 
            });
        }
    }, [funcionario, form]);

    const AtualizarFuncionario = async (values: Funcionario) => {
        try {
            const formattedDate = dayjs(values.dataAdmissao).toISOString();
            
            const dataToSend = {
                ...values,
                id: funcionario?.id,
                dataAdmissao: formattedDate,
            };
    
            const response = await axios.put('http://localhost:8080/Funcionario', dataToSend);
            const funcionarioAtualizado = response.data; 
            setListaFuncionario(prev => 
                prev.map(funcionario => 
                    funcionario.id === funcionarioAtualizado.id ? funcionarioAtualizado : funcionario
                )
            )
            message.success('Funcionário editado com sucesso!');

            setShowEditFunc(false);
        } catch (error) {
            console.error("Erro ao atualizar os dados:", error);
        }
    };

    const handleClose = () => {
        if (funcionario) {
            form.setFieldsValue({
                ...funcionario,
                dataAdmissao: dayjs(funcionario.dataAdmissao), 
                tipoCNH: funcionario.tipoCNH, 
            });
        }
        setShowEditFunc(false);
    };

    return (
        <styled.EditFuncionarioContainer>
            <Drawer
                title="Editar Informações"
                style={{ position: 'relative' }}
                open={showEditFunc}
                onClose={handleClose}
                extra={
                    <Space style={{ position: 'absolute', bottom: '10px', left: '200px' }}>
                        <Button onClick={handleClose}>Cancel</Button>
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
                    onFinish={AtualizarFuncionario}
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
                                <Input 
                                    placeholder="Insira o CPF" 
                                    maxLength={14}
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
                                <Input.TextArea rows={4} placeholder="Caso queira, insira observações sobre o Funcionário." />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </styled.EditFuncionarioContainer>
    );
}

export default EditFuncionario;
