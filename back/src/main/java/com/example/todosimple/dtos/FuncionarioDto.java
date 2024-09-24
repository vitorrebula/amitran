package com.example.todosimple.dtos;

import com.example.todosimple.models.Funcionario;

public record FuncionarioDto(Long id, String nome, String cpf, String cargo, String tipoCNH, String dataAdmissao, String status, String observacoes) {

    public FuncionarioDto (Funcionario funcionario) {
        this(funcionario.getId(), funcionario.getNome(), funcionario.getCpf(), funcionario.getCargo(),funcionario.getTipoCNH(), funcionario.getDataAdmissao(), funcionario.getStatus(), funcionario.getObservacoes());
    }
}
