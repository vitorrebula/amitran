package com.example.todosimple.services;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.todosimple.models.Funcionario;
import com.example.todosimple.repositories.FuncionarioRepository;
import com.example.todosimple.repositories.ServicoRepository;
import com.example.todosimple.dtos.FuncionarioDto;

import java.util.List;

@Service
public class FuncionarioService {

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    @Autowired
    private ServicoRepository servicoRepository;


    public List<FuncionarioDto> listarFuncionarios() {
        return funcionarioRepository.findAll().stream().map(FuncionarioDto::new).toList();

    }


    public FuncionarioDto buscarFuncionarioPorId(Long id) {
        return funcionarioRepository.findById(id)
                .map(FuncionarioDto::new)
                .orElseThrow(() -> new EntityNotFoundException("Funcionário com o ID " + id + " não encontrado."));
    }

    @Transactional
    public ResponseEntity<String>  cadastrarFuncionario(FuncionarioDto funcionarioDto) {
        Funcionario funcionario = new Funcionario();
        funcionario.setNome(funcionarioDto.nome());
        funcionario.setCpf(funcionarioDto.cpf());
        funcionario.setCargo(funcionarioDto.cargo());
        funcionario.setTipoCNH(funcionarioDto.tipoCNH());
        funcionario.setDataAdmissao(funcionarioDto.dataAdmissao());
        funcionario.setObservacoes(funcionarioDto.observacoes());
        funcionario.setStatus(funcionarioDto.status());

        funcionarioRepository.save(funcionario);

        return new ResponseEntity<>("Funcionário cadastrado com sucesso!", HttpStatus.CREATED);
    }

    @Transactional
    public ResponseEntity<String> atualizarFuncionario(Long id, FuncionarioDto funcionarioDto) {

        Funcionario funcionarioExistente = funcionarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Funcionário não encontrado"));

        funcionarioExistente.setNome(funcionarioDto.nome());
        funcionarioExistente.setCpf(funcionarioDto.cpf());
        funcionarioExistente.setCargo(funcionarioDto.cargo());
        funcionarioExistente.setTipoCNH(funcionarioDto.tipoCNH());
        funcionarioExistente.setDataAdmissao(funcionarioDto.dataAdmissao());
        funcionarioExistente.setObservacoes(funcionarioDto.observacoes());
        funcionarioExistente.setStatus(funcionarioDto.status());

        funcionarioRepository.save(funcionarioExistente);

        return new ResponseEntity<>("Funcionário atualizado com sucesso!", HttpStatus.OK);

    }

    public ResponseEntity<String> excluirFuncionario(Long id) {

        Funcionario funcionario = funcionarioRepository.findById(id).orElseThrow(() ->new RuntimeException("Funcionário não encontrado"));

        funcionarioRepository.delete(funcionario);

        return new ResponseEntity<>("Funcionário excluido com sucesso!", HttpStatus.OK);
    }
}