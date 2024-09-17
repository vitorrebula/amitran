package com.example.todosimple.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = Funcionario.TABLE_NAME)
public class Funcionario {
    public interface ICreateFuncionario {}

    public interface IUpdateFuncionario {}

    public static final String TABLE_NAME = "Funcionario";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Long id;

    @Column(name = "nome", length = 100, nullable = false)
    @NotNull(groups = { ICreateFuncionario.class })
    @NotEmpty(groups = { ICreateFuncionario.class })
    @Size(groups = ICreateFuncionario.class, min = 2, max = 100)
    private String nome;

    @Column(name = "CPF", length = 11, nullable = false, unique = true)
    @NotNull(groups = { ICreateFuncionario.class, IUpdateFuncionario.class })
    @NotEmpty(groups = { ICreateFuncionario.class })
    @Size(groups = ICreateFuncionario.class, min = 11, max = 11)
    private String cpf;

    @Column(name = "cargo", length = 100, nullable = false)
    @NotNull(groups = { ICreateFuncionario.class, IUpdateFuncionario.class })
    @NotEmpty(groups = { ICreateFuncionario.class })
    @Size(groups = ICreateFuncionario.class, min = 2, max = 60)
    private String cargo;

    @Column(name = "tipoCNH")
    @NotNull(groups = { ICreateFuncionario.class, IUpdateFuncionario.class })
    private String tipoCNH;

    @Column(name = "DataAdmissao")
    @NotEmpty(groups = { ICreateFuncionario.class, IUpdateFuncionario.class })
    @NotNull(groups = { ICreateFuncionario.class, IUpdateFuncionario.class })
    private String dataAdmissao; 

    @Column(name = "Status", length = 20)
    @NotEmpty(groups = { ICreateFuncionario.class, IUpdateFuncionario.class })
    @NotNull(groups = { ICreateFuncionario.class, IUpdateFuncionario.class })
    private String status;

    @Column(name = "Observações")
    @Size(groups = ICreateFuncionario.class, max = 200)
    private String observacoes;

    @ManyToMany(mappedBy = "funcionarios")
    @JsonIgnoreProperties({"funcionarios"})
    private Set<Servico> servicos = new HashSet<>();

    public Funcionario() {}

    public Funcionario(Long id, String nome, String cpf, String cargo, String tipoCNH, String dataAdmissao, String status, String observacoes) {
        this.id = id;
        this.nome = nome;
        this.cpf = cpf;
        this.cargo = cargo;
        this.tipoCNH = tipoCNH;
        this.dataAdmissao = dataAdmissao;
        this.status = status;
        this.observacoes = observacoes;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getCargo() {
        return cargo;
    }

    public void setCargo(String cargo) {
        this.cargo = cargo;
    }

    public String getTipoCNH() {
        return tipoCNH;
    }

    public void setTipoCNH(String tipoCNH) {
        this.tipoCNH = tipoCNH;
    }

    public String getDataAdmissao() {
        return dataAdmissao;
    }

    public void setDataAdmissao(String dataAdmissao) {
        this.dataAdmissao = dataAdmissao;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }

    public Set<Servico> getServicos() {
        return servicos;
    }

    public void setServicos(Set<Servico> servicos) {
        this.servicos = servicos;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Funcionario that = (Funcionario) obj;
        return Objects.equals(id, that.id) &&
                Objects.equals(nome, that.nome) &&
                Objects.equals(cpf, that.cpf);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, nome, cpf);
    }
}
