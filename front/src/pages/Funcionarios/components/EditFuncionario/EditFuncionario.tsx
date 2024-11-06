import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import * as styled from './EditFuncionario.styles';
import { Button, Col, DatePicker, Drawer, Form, Input, message, Row, Select, Space } from 'antd';
import { Funcionario } from '../../Funcionarios';
import dayjs from 'dayjs';
import { Servico } from '../../../Servicos/ServicosPage';
import { ModalDelecao } from '../../../../components/ModalDelecao';
import { MaskedInput } from 'antd-mask-input';
import { url } from '../../../../url';
import { api } from '../../../../axios';

interface EditFuncionarioProps {
    setShowEditFunc: Dispatch<SetStateAction<boolean>>;
    showEditFunc: boolean;
    funcionario?: Funcionario;
    setListaFuncionario: Dispatch<SetStateAction<Funcionario[]>>;
    listaServico: Servico[];
    setListaServico: Dispatch<SetStateAction<Servico[]>>;
}

const { Option } = Select;

function EditFuncionario(props: EditFuncionarioProps) {
    const { setShowEditFunc, showEditFunc, funcionario, setListaFuncionario, listaServico, setListaServico } = props;
    const [form] = Form.useForm();
    const [modalVisible, setModalVisible] = useState(false);
    const [futureServicos, setFutureServicos] = useState<Servico[]>([]);

    useEffect(() => {
        if (funcionario) {
            form.setFieldsValue({
                ...funcionario,
                dataAdmissao: dayjs(funcionario.dataAdmissao),
                tipoCNH: funcionario.tipoCNH,
                cpf: formatarCPF(funcionario.cpf.toString()),
            });
        }
    }, [funcionario, form]);

    const handleSave = async (values: Funcionario) => {
        if (values.status === 'Inativo') {
            const futureServices = listaServico.filter(servico =>
                (dayjs(servico?.dataInicio).isAfter(dayjs()) || dayjs(servico?.dataTermino).isAfter(dayjs())) &&
                servico?.funcionarios?.some(f => f.id === funcionario?.id)
            );

            if (futureServices.length > 0) {
                setFutureServicos(futureServices);
                setModalVisible(true);
            } else {
                await AtualizarFuncionario(values);
            }
        } else {
            await AtualizarFuncionario(values);
        }
    };

    const handleConfirmation = async () => {
        for (const servico of futureServicos) {
            const updatedService = {
                ...servico,
                funcionarios: servico.funcionarios.filter(f => f.id !== funcionario?.id)
            };

            await api.put(`${url}/servico`, updatedService);
            setListaServico(prev =>
                prev.map(s => s.id === servico.id ? updatedService : s)
            );
        }

        setModalVisible(false);
        await AtualizarFuncionario(form.getFieldsValue());
    };

    const AtualizarFuncionario = async (values: Funcionario) => {
        try {
            const formattedDate = dayjs(values.dataAdmissao).toISOString();
            const dataToSend = {
                ...values,
                id: funcionario?.id,
                cpf: removerMascaraCPF(values.cpf.toString()),
                dataAdmissao: formattedDate,
            };

            const response = await api.put(`${url}/Funcionario`, dataToSend);
            const funcionarioAtualizado = response.data;
            setListaFuncionario(prev =>
                prev.map(funcionario =>
                    funcionario.id === funcionarioAtualizado.id ? funcionarioAtualizado : funcionario
                )
            );
            message.success('Funcionário editado com sucesso!');
            setShowEditFunc(false);
        } catch (error) {
            console.error("Erro ao atualizar os dados:", error);
        }
    };

    const formatarCPF = (cpf: string) => {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    const removerMascaraCPF = (cpf: string) => {
        return cpf.replace(/[^\d]/g, '');
    };

    const handleClose = () => {
        if (funcionario) {
            form.setFieldsValue({
                ...funcionario,
                dataAdmissao: dayjs(funcionario.dataAdmissao),
                tipoCNH: funcionario.tipoCNH,
                cpf: formatarCPF(funcionario.cpf.toString()),
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
                    <Space style={{ position: 'absolute', bottom: '10px', left: '200px', zIndex: 3 }}>
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
                    onFinish={handleSave}
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="nome"
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

            <ModalDelecao
                title={`Inativar ${funcionario?.nome}?`}
                item="funcionário"
                futureServicos={futureServicos}
                modalVisible={modalVisible}
                handleConfirm={handleConfirmation}
                handleCancel={() => setModalVisible(false)}
            />
        </styled.EditFuncionarioContainer>
    );
}

export default EditFuncionario;
