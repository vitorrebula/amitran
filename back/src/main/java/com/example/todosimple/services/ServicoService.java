package com.example.todosimple.services;

import java.util.Optional;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.todosimple.models.Funcionario;
import com.example.todosimple.models.Servico;
import com.example.todosimple.models.Veiculo;
import com.example.todosimple.repositories.FuncionarioRepository;
import com.example.todosimple.repositories.ServicoRepository;
import com.example.todosimple.repositories.VeiculoRepository;

import jakarta.transaction.Transactional;

@Service
public class ServicoService {
    
    @Autowired
    private ServicoRepository servicoRepository;

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    @Autowired
    private VeiculoRepository veiculoRepository;

    public Servico findById(Long id) {
        Optional<Servico> servico = this.servicoRepository.findById(id);
        return servico.orElseThrow(() -> new RuntimeException(
            "Servico não encontrado para o ID: " + id
        ));
    }

    public List<Servico> findAll() {
        return servicoRepository.findAll();
    }

    public List<Servico> getServicoPorData(LocalDateTime data) {
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
        String dataInicio = data.minus(1, ChronoUnit.MONTHS).format(formatter);
        String dataTermino = data.plus(5, ChronoUnit.MONTHS).format(formatter);
        return servicoRepository.findByDataInicioBetween(dataInicio, dataTermino);
    }

    @Transactional
    public Servico create(Servico obj) {
        verificarConflitos(obj);
        obj.setId(null);
        obj = this.servicoRepository.save(obj);
        return obj;
    }

    @Transactional
    public Servico update(Servico obj) {
        verificarConflitos(obj);
        Servico newObj = findById(obj.getId());
        newObj.setNomeCliente(obj.getNomeCliente());
        newObj.setEnderecoOrigem(obj.getEnderecoOrigem());
        newObj.setEnderecoEntrega(obj.getEnderecoEntrega());
        newObj.setDataInicio(obj.getDataInicio());
        newObj.setDataTermino(obj.getDataTermino());
        newObj.setValor(obj.getValor());
        newObj.setDescricao(obj.getDescricao());
        newObj.setFuncionarios(obj.getFuncionarios());
        newObj.setVeiculos(obj.getVeiculos());
        return this.servicoRepository.save(newObj);
    }

    private void verificarConflitos(Servico obj) {
        List<Servico> servicosExistentes = servicoRepository.findByDataInicioBetween(
            obj.getDataInicio().toString(),
            obj.getDataTermino().toString()
        );
        
        for (Veiculo veiculo : obj.getVeiculos()) {
            for (Servico servico : servicosExistentes) {
                if (!servico.getId().equals(obj.getId()) && 
                    servico.getVeiculos().contains(veiculo)) {
                    throw new RuntimeException("Conflito: Veículo " + veiculo.getPlaca() + 
                        " já está alocado para o serviço " + servico.getNomeCliente() + 
                        " no período selecionado.");
                }
            }
        }
        
        for (Funcionario funcionario : obj.getFuncionarios()) {
            for (Servico servico : servicosExistentes) {
                if (!servico.getId().equals(obj.getId()) && 
                    servico.getFuncionarios().contains(funcionario)) {
                    throw new RuntimeException("Conflito: Funcionário " + funcionario.getUsername() + 
                        " já está alocado para o serviço " + servico.getNomeCliente() + 
                        " no período selecionado.");
                }
            }
        }
    }

    public void delete(Long id) {
        findById(id);
        try {
            this.servicoRepository.deleteById(id);
        } catch(Exception e) {
            throw new RuntimeException("Não é possível excluir o serviço pois há entidades relacionadas!");
        }
    }

    public Servico addFuncionarioToServico(Long servicoId, Long funcionarioId) {
        Funcionario funcionario = funcionarioRepository.findById(funcionarioId)
            .orElseThrow(() -> new RuntimeException("Funcionario não encontrado com ID: " + funcionarioId));
        
        Servico servico = findById(servicoId);
        servico.getFuncionarios().add(funcionario);

        return servicoRepository.save(servico);
    }

    public Servico addVeiculoToServico(Long servicoId, String veiculoId) {
        Veiculo veiculo = veiculoRepository.findById(veiculoId)
            .orElseThrow(() -> new RuntimeException("Veiculo não encontrado com Placa: " + veiculoId));
        
        Servico servico = findById(servicoId);
        servico.getVeiculos().add(veiculo);

        return servicoRepository.save(servico);
    }
}
