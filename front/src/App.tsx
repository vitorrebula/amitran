import React, { useState } from 'react';
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

function App() {

  const [listaFuncionario, setListaFuncionario] = useState<Funcionario[]>([]);
  const [listaVeiculo, setListaVeiculo] = useState<Veiculo[]>([]);
  const [listaServico, setListaServico] = useState<Servico[]>([]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/funcionarios" element={<PrivateRoute><Funcionarios listaFuncionario={listaFuncionario} setListaFuncionario={setListaFuncionario}/></PrivateRoute>} />
        <Route path="/veiculos" element={<PrivateRoute><Veiculos listaVeiculo={listaVeiculo} setListaVeiculo={setListaVeiculo} /></PrivateRoute>} />
        <Route path="/servicos" element={<PrivateRoute><ServicosPage listaFuncionario={listaFuncionario} listaVeiculo={listaVeiculo} setListaServico={setListaServico} listaServico={listaServico}/></PrivateRoute>} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
