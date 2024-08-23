import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import * as styled from './Funcionarios.styles';
import { Navbar } from '../../components/Navbar';
import { MenuDeAcoes } from '../components/MenuDeAcoes';
import { FloatButton } from 'antd';
import { AddFuncionario } from './components/AddFuncionario';
import axios from 'axios';
import { CardFuncionario } from './components/CardFuncionario';
import { EditFuncionario } from './components/EditFuncionario';

export interface Funcionario {
    id: number;
    username: string;
    cargo: string;
    cpf: number;
    tipoCNH: string;
    status: string;
    dataAdmissao: string;
    observacoes: string;
}

export interface FuncionariosProps {
    listaFuncionario: Funcionario[];
    setListaFuncionario: Dispatch<SetStateAction<Funcionario[]>>
}

function Funcionarios(props: FuncionariosProps) {
    const [showAddFunc, setShowAddFunc] = useState(false);
    const [showEditFunc, setShowEditFunc] = useState(false);
    const [showInativos, setShowInativos] = useState(false);
    const [searchText, setSearchText] = useState('');
    const {listaFuncionario, setListaFuncionario} = props;
    const [funcionarioSelecionado, setFuncionarioSelecionado] = useState<Funcionario | null>(null);

    const buscaFuncionarios = async () => {
        try {
            const response = await axios.get('http://localhost:8080/Funcionario');
            setListaFuncionario(response.data);
        } catch (error) {
            console.error('Erro ao buscar a lista de funcionários:', error);
            return [];
        }
    };

    useEffect(() => {
        buscaFuncionarios();
    }, []);

    const handleEdit = (funcionario: Funcionario) => {
        setFuncionarioSelecionado(funcionario);
        setShowEditFunc(true);
    };

    return (
        <styled.FuncionariosContainer>
            <Navbar />
            <MenuDeAcoes setShowAddModal={setShowAddFunc} showCheckBox={true} setCheckBoxEvent={setShowInativos} setSearchText={setSearchText} AddText='Adicionar Funcionário' />
            <AddFuncionario setListaFuncionario={setListaFuncionario} setShowAddFunc={setShowAddFunc} showAddFunc={showAddFunc} />
            <EditFuncionario setListaFuncionario={setListaFuncionario} setShowEditFunc={setShowEditFunc} showEditFunc={showEditFunc} funcionario={funcionarioSelecionado ? funcionarioSelecionado : undefined} />
            <styled.ListaFuncionarios>
            {showInativos ? (
                    listaFuncionario
                        .filter(funcionario => funcionario.username.toLowerCase().includes(searchText.toLowerCase()))
                        .sort((a, b) => a.username.localeCompare(b.username))
                        .map(funcionario => (
                            <CardFuncionario
                                key={funcionario.id}
                                funcionario={funcionario}
                                setListaFuncionario={setListaFuncionario}
                                setShowEditFunc={() => handleEdit(funcionario)}
                            />
                        ))
                ) : (
                    listaFuncionario
                        .filter(funcionario => funcionario.status === 'Ativo' && funcionario.username.toLowerCase().includes(searchText.toLowerCase()))
                        .sort((a, b) => a.username.localeCompare(b.username))
                        .map(funcionario => (
                            <CardFuncionario
                                key={funcionario.id}
                                funcionario={funcionario}
                                setListaFuncionario={setListaFuncionario}
                                setShowEditFunc={() => handleEdit(funcionario)}
                            />
                        ))
                )}
            </styled.ListaFuncionarios>
            <FloatButton.BackTop />
        </styled.FuncionariosContainer>
    );
}

export default Funcionarios;