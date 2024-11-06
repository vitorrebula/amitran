import ReactECharts from 'echarts-for-react';
import * as styled from './Grafico.style';
import { useEffect, useState } from 'react';
import { url } from '../../../../url';
import { getToken } from '../../../../auth'; // Importa a função getToken

interface ServicoData {
    mes: string;
    quantidade: number;
}

const Graficos = () => {
    const [funcionariosData, setFuncionariosData] = useState({ ativos: 0, inativos: 0 });
    const [servicosData, setServicosData] = useState<ServicoData[]>([]);

    // Obtém o token do localStorage usando a função getToken
    const token = getToken();

    useEffect(() => {
        // Verifica se o token está presente antes de fazer a requisição
        if (token) {
            fetch(`${url}/Funcionario/buscarFuncionariosAtivos`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Adiciona o token no header
                    'Content-Type': 'application/json',
                },
            })
                .then(response => response.json())
                .then(data => setFuncionariosData(data))
                .catch(error => console.error("Erro ao buscar dados de funcionários:", error));
        }
    }, [token]);

    useEffect(() => {
        // Verifica se o token está presente antes de fazer a requisição
        if (token) {
            fetch(`${url}/servico/buscarServicosporMes`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Adiciona o token no header
                    'Content-Type': 'application/json',
                },
            })
                .then(response => response.json())
                .then(data => setServicosData(data))
                .catch(error => console.error("Erro ao buscar dados de serviços:", error));
        }
    }, [token]);

    const servicosMes = {
        xAxis: {
            type: 'category',
            data: servicosData.map(item => item.mes),
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                data: servicosData.map(item => item.quantidade),
                type: 'bar',
            },
        ],
    };

    const funcAtivos = {
        tooltip: { trigger: 'item' },
        legend: { top: '5%', left: 'center' },
        series: [
            {
                name: 'Status dos Funcionários',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                label: { show: false, position: 'center' },
                emphasis: {
                    label: { show: true, fontSize: 40, fontWeight: 'bold' },
                },
                labelLine: { show: false },
                data: [
                    { value: funcionariosData.ativos, name: 'Ativos' },
                    { value: funcionariosData.inativos, name: 'Inativos' },
                ],
            },
        ],
    };

    return (
        <div className="graficos-container">
            <styled.GraficosTitle>Relatórios:</styled.GraficosTitle>

            <styled.ContentGraficos>
                <styled.GraficoServicos>
                    <h4>Quantidade de Serviço por mês</h4>
                    <ReactECharts option={servicosMes} />
                </styled.GraficoServicos>

                <styled.GraficoServicos>
                    <h4>Funcionários Ativos</h4>
                    <ReactECharts option={funcAtivos} />
                </styled.GraficoServicos>
            </styled.ContentGraficos>
        </div>
    );
};

export default Graficos;
