import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import PrivateRoute from './pages/PrivateRoute';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { Funcionarios } from './pages/Funcionarios';
import { ServicosPage } from './pages/Servicos';
import { Funcionario } from './pages/Funcionarios/Funcionarios';
import Veiculos, { Veiculo } from './pages/Veiculos/Veiculos';
import { Servico } from './pages/Servicos/ServicosPage';
import axios from 'axios';

function App() {

  const [listaFuncionario, setListaFuncionario] = useState<Funcionario[]>([]);
  const [listaVeiculo, setListaVeiculo] = useState<Veiculo[]>([]);
  const [listaServico, setListaServico] = useState<Servico[]>([]);
  const [lastRequestDate, setLastRequestDate] = useState<string>('');

  const buscaVeiculos = async () => {
    try {
      const response = await axios.get('http://192.168.0.230:8080/veiculo');
      setListaVeiculo(response.data);
    } catch (error) {
      console.error('Erro ao buscar a lista de veículos:', error);
      return [];
    }
  };

  useEffect(() => {
    buscaVeiculos();
  }, []);

  const buscaFuncionarios = async () => {
    try {
      const response = await axios.get('http://192.168.0.230:8080/Funcionario');
      setListaFuncionario(response.data);
    } catch (error) {
      console.error('Erro ao buscar a lista de funcionários:', error);
      return [];
    }
  };

  useEffect(() => {
    buscaFuncionarios();
  }, []);

  const buscaServicosPorFaixaDeData = async (data: string) => {
    try {
      const response = await axios.get<Servico[]>(`http://192.168.0.230:8080/servico/data/${data}`);
      setListaServico(prevLista => {
        const novosServicos = response.data.filter(novoServico => 
          !prevLista.some(servicoExistente => servicoExistente.id === novoServico.id)
        );
        return [...prevLista, ...novosServicos];
      });
      setLastRequestDate(data);
    } catch (error) {
      console.error('Erro ao buscar os serviços:', error);
    }
  };
  
  
  
  useEffect(() => {
    const dataHoje = new Date().toISOString();
    buscaServicosPorFaixaDeData(dataHoje);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<PrivateRoute><HomePage listaDeFuncionarios={listaFuncionario} setListaDeFuncionarios={setListaFuncionario} /></PrivateRoute>} />
        <Route path="/funcionarios" element={<PrivateRoute><Funcionarios listaServico={listaServico} setListaServico={setListaServico} listaFuncionario={listaFuncionario} setListaFuncionario={setListaFuncionario} /></PrivateRoute>} />
        <Route path="/veiculos" element={<PrivateRoute><Veiculos listaServico={listaServico} setListaServico={setListaServico} listaVeiculo={listaVeiculo} setListaVeiculo={setListaVeiculo} /></PrivateRoute>} />
        <Route path="/servicos" element={<PrivateRoute><ServicosPage buscaServicosPorFaixaDeData={buscaServicosPorFaixaDeData} lastRequestDate={lastRequestDate} setLastRequestDate={setLastRequestDate} listaFuncionario={listaFuncionario} listaVeiculo={listaVeiculo} setListaServico={setListaServico} listaServico={listaServico} /></PrivateRoute>} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
