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
import { url } from './url';
import { api, setAuthHandler } from './axios';

function App() {

  const [listaFuncionario, setListaFuncionario] = useState<Funcionario[]>([]);
  const [listaVeiculo, setListaVeiculo] = useState<Veiculo[]>([]);
  const [listaServico, setListaServico] = useState<Servico[]>([]);
  const [lastRequestDate, setLastRequestDate] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    setAuthHandler(setIsAuthenticated);
  }, []);

  const buscaVeiculos = async () => {
    try {
      const response = await api.get(`${url}/veiculo`);
      setListaVeiculo(response.data);
    } catch (error) {
      console.error('Erro ao buscar a lista de veículos:', error);
      return [];
    }
  };

  useEffect(() => {
    buscaVeiculos();
  }, [isAuthenticated]);

  const buscaFuncionarios = async () => {
    try {
      const response = await api.get(`${url}/Funcionario`);
      setListaFuncionario(response.data);
    } catch (error) {
      console.error('Erro ao buscar a lista de funcionários:', error);
      return [];
    }
  };

  useEffect(() => {
    buscaFuncionarios();
  }, [isAuthenticated]);

  const buscaServicosPorFaixaDeData = async (data: string) => {
    try {
      const response = await api.get<Servico[]>(`${url}/servico/data/${data}`);
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
  }, [isAuthenticated]);

  const handleLoginSucces = () => {
    setIsAuthenticated(true);
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSucces} />} />
        <Route path="/home" element={<PrivateRoute><HomePage listaFuncionario={listaFuncionario} setListaServico={setListaServico} setListaFuncionario={setListaFuncionario} setListaVeiculo={setListaVeiculo} listaServico={listaServico} listaVeiculo={listaVeiculo} /></PrivateRoute>} />
        <Route path="/funcionarios" element={<PrivateRoute><Funcionarios listaServico={listaServico} setListaServico={setListaServico} listaFuncionario={listaFuncionario} setListaFuncionario={setListaFuncionario} /></PrivateRoute>} />
        <Route path="/veiculos" element={<PrivateRoute><Veiculos listaServico={listaServico} setListaServico={setListaServico} listaVeiculo={listaVeiculo} setListaVeiculo={setListaVeiculo} /></PrivateRoute>} />
        <Route path="/servicos" element={<PrivateRoute><ServicosPage buscaServicosPorFaixaDeData={buscaServicosPorFaixaDeData} lastRequestDate={lastRequestDate} setLastRequestDate={setLastRequestDate} listaFuncionario={listaFuncionario} listaVeiculo={listaVeiculo} setListaServico={setListaServico} listaServico={listaServico} /></PrivateRoute>} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
