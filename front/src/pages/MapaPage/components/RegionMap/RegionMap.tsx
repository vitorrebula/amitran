import React, { useState, useEffect } from 'react';
import { DatePicker, Modal, List, Select, Typography, Row, Col } from 'antd';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import dayjs, { Dayjs } from 'dayjs';
import { MapaPageProps } from '../../MapaPage';
import 'leaflet/dist/leaflet.css';
import { Servico } from '../../../Servicos/ServicosPage';
import * as styled from './RegionMap.styles';
import { getCoordinatesFromAddress } from '../utils/getCoordinatesFromAddress';
import { Funcionario } from '../../../Funcionarios/Funcionarios';
import { Veiculo } from '../../../Veiculos/Veiculos';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title } = Typography;

export interface RegionMarker {
    region: string;
    services: Servico[];
    coordinates: [number, number];
}

function DateTimeRangePickerMap(props: MapaPageProps) {
    const { setListaServico, lastRequestDate, setLastRequestDate, buscaServicosPorFaixaDeData, listaServico, listaVeiculo } = props;
    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
    const [filteredServices, setFilteredServices] = useState<Servico[]>([]);
    const [selectedVeiculo, setSelectedVeiculo] = useState<string | null>(null);
    const [routeCoordinates, setRouteCoordinates] = useState<{ coords: [number, number][], name: string, origem: [number, number], destino: [number, number], serviceData: Servico }[]>([]);
    const [selectedService, setSelectedService] = useState<Servico | null>(null);
    const [selectedRegion, setSelectedRegion] = useState<RegionMarker | null>(null);
    const [regionMarkers, setRegionMarkers] = useState<RegionMarker[]>([
        { region: 'Norte', coordinates: [-3.4653, -62.2159], services: [] },
        { region: 'Nordeste', coordinates: [-12.9714, -38.5014], services: [] },
        { region: 'Centro-Oeste', coordinates: [-12.646, -55.423], services: [] },
        { region: 'Sudeste', coordinates: [-18.5122, -44.5550], services: [] },
        { region: 'Sul', coordinates: [-25.4284, -49.2733], services: [] },
    ]);
    const dayJsLastRequestDate = dayjs(lastRequestDate);

    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#A833FF'];

    useEffect(() => {
        if (dateRange[0] && dateRange[1]) {
            const filtered = listaServico
                .filter(service => {
                    const dataInicio = dayjs(service.dataInicio);
                    const dataTermino = dayjs(service.dataTermino);
                    return (
                        dataInicio.isBetween(dateRange[0], dateRange[1], 'day', '[]') ||
                        dataTermino.isBetween(dateRange[0], dateRange[1], 'day', '[]')
                    );
                })
                .sort((servicoA, servicoB) => 
                    dayjs(servicoA.dataInicio).isBefore(dayjs(servicoB.dataInicio)) ? -1 : 1
                );
            setFilteredServices(filtered);
        }
    }, [dateRange, listaServico]);

    useEffect(() => {
        if (selectedVeiculo) {
            const veiculoServicos = filteredServices.filter(service => service.veiculos?.find((veiculo) => veiculo.placa === selectedVeiculo));

            const fetchCoordinates = async () => {
                const coordinates: { coords: [number, number][], name: string, origem: [number, number], destino: [number, number], serviceData: Servico }[] = [];
                
                for (let service of veiculoServicos) {
                    const origemCoords = await getCoordinatesFromAddress(service.enderecoOrigem);
                    const destinoCoords = await getCoordinatesFromAddress(service.enderecoEntrega);
                    
                    if (origemCoords && destinoCoords) {
                        coordinates.push({ coords: [origemCoords, destinoCoords], name: service.nomeCliente, origem: origemCoords, destino: destinoCoords, serviceData: service });
                    }
                }
                
                setRouteCoordinates(coordinates);
            };

            fetchCoordinates();
        } else {
            setRouteCoordinates([]);
        }
    }, [selectedVeiculo, filteredServices]);

    useEffect(() => {
        if (!selectedVeiculo) {
            const updatedRegionMarkers = regionMarkers.map(marker => {
                return {
                    ...marker,
                    services: filteredServices.filter(service => service.regiao === marker.region)
                };
            });
            
            setRegionMarkers(updatedRegionMarkers);
        }
    }, [filteredServices, selectedVeiculo]);

    const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
        if (dates) {
            setDateRange(dates);
    
            const [startDate, endDate] = dates;
    
            if (startDate && endDate) {
                const isBeyondLimit =
                    startDate.isBefore(dayJsLastRequestDate.subtract(1, 'month')) ||
                    endDate.isAfter(dayJsLastRequestDate.add(4, 'months'));
    
                if (isBeyondLimit) {
                    if(startDate.isBefore(dayJsLastRequestDate.subtract(1, 'month'))) {
                        buscaServicosPorFaixaDeData(startDate.toISOString())
                        setLastRequestDate(startDate.toISOString());
                    }else{
                        buscaServicosPorFaixaDeData(endDate.toISOString())
                        setLastRequestDate(endDate.toISOString());
                    }
                }
            }
        } else {
            setDateRange([null, null]);
        }
    };

    const handleVehicleSelect = (value: string) => setSelectedVeiculo(value);

    const handleRouteClick = (service: Servico) => setSelectedService(service);

    const renderVeiculos = (veiculos: Veiculo[] | undefined) => veiculos?.map(veiculo => <span key={veiculo.placa}>{veiculo.placa} </span>);
    const renderFuncionarios = (funcionarios: Funcionario[] | undefined) => funcionarios?.map(func => <span key={func.id}>{func.nome}<br /></span>);

    return (
        <styled.RegionMapContainer>
            <Title level={3} style={{marginTop: '-15px'}}>Visualize rotas e se programe!</Title>
            <p style={{fontSize: '13px'}}>Caso não escolha um veículo, poderá ver os serviços por Região, para as datas selecionadas.</p>
            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={12}>
                    <label>Selecione o intervalo de datas:</label>
                    <RangePicker onChange={handleDateRangeChange} style={{ width: '100%' }} />
                </Col>
                <Col span={12}>
                    <label>Selecione um Veículo(opcional):</label>
                    <Select
                        placeholder="Selecione um Veículo"
                        onChange={handleVehicleSelect}
                        style={{ width: '100%' }}
                        allowClear
                        onClear={() => setSelectedVeiculo(null)}
                    >
                        {listaVeiculo.map(veiculo => (
                            <Option key={veiculo.placa} value={veiculo.placa}>
                                {veiculo.placa}
                            </Option>
                        ))}
                    </Select>
                </Col>
            </Row>

            <MapContainer center={[-15.7801, -47.9292]} zoom={4} style={{ height: '500px', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />

                {selectedVeiculo ? (
                    <>
                        {routeCoordinates.map((route, index) => (
                            <React.Fragment key={index}>
                                <Polyline
                                    positions={route.coords}
                                    color={colors[index % colors.length]}
                                    eventHandlers={{
                                        click: () => handleRouteClick(route.serviceData),
                                    }}
                                />
                                <Marker
                                    position={route.origem}
                                    icon={L.icon({
                                        iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-orange.png',
                                        iconSize: [25, 41],
                                        iconAnchor: [12, 41],
                                    })}
                                    eventHandlers={{
                                        click: () => handleRouteClick(route.serviceData),
                                    }}
                                />
                                <Marker
                                    position={route.destino}
                                    icon={L.icon({
                                        iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-orange.png',                                        
                                        iconSize: [25, 41],
                                        iconAnchor: [12, 41],
                                    })}
                                    eventHandlers={{
                                        click: () => handleRouteClick(route.serviceData),
                                    }}
                                />
                            </React.Fragment>
                        ))}
                    </>
                ) : (
                    regionMarkers.map(marker => (
                        <Marker
                            key={marker.region}
                            position={marker.coordinates}
                            eventHandlers={{
                                click: () => setSelectedRegion(marker),
                            }}
                            icon={L.icon({
                                iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-orange.png',
                                iconSize: [25, 41],
                                iconAnchor: [12, 41],
                            })}
                        />
                    ))
                )}
            </MapContainer>


            <Modal
                title={selectedService ? `Detalhes do Serviço` : "Detalhes"}
                visible={!!selectedService}
                onCancel={() => setSelectedService(null)}
                footer={null}
            >
                {selectedService && (
                    <List.Item>
                        <strong>{`${selectedService.nomeCliente}`}</strong>
                        <br />
                        {`Inicia em ${selectedService.enderecoOrigem}, no dia: ${dayjs(selectedService.dataInicio).format('DD/MM/YYYY')}`}
                        <br />
                        {`Vai até ${selectedService.enderecoEntrega} na data ${dayjs(selectedService.dataInicio).format('DD/MM/YYYY')}`}
                        <br/>
                        Veículo(s): {renderVeiculos(selectedService.veiculos)}
                        <br/>
                        Funcionario(s): {renderFuncionarios(selectedService.funcionarios)}
                    </List.Item>
                )}
            </Modal>

            <Modal
                title={selectedRegion ? `Serviços na Região ${selectedRegion.region}` : ''}
                visible={!!selectedRegion}
                onCancel={() => setSelectedRegion(null)}
                footer={null}
            >
                {selectedRegion && selectedRegion.services.length > 0 ? (
                    <List
                        dataSource={selectedRegion.services}
                        renderItem={service => (
                            <List.Item>
                                <strong>{`${service.nomeCliente}`}</strong>
                                <br />
                                {`Inicia em ${service.enderecoOrigem}, no dia: ${dayjs(service.dataInicio).format('DD/MM/YYYY')}`}
                                <br />
                                {`Vai até ${service.enderecoEntrega} na data ${dayjs(service.dataInicio).format('DD/MM/YYYY')}`}
                                <br/>
                                Veículo(s): {renderVeiculos(service.veiculos)}
                                <br/>
                                Funcionario(s): {renderFuncionarios(service.funcionarios)}
                            </List.Item>
                        )}
                    />
                ) : (
                    <p>Nenhum serviço nesta região</p>
                )}
            </Modal>
        </styled.RegionMapContainer>
    );
}

export default DateTimeRangePickerMap;
