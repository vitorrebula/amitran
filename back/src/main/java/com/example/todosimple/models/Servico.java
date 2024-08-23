package com.example.todosimple.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = Servico.TABLE_NAME)
public class Servico {
    public interface CreateServico {}
    public interface UpdateServico {}

    public static final String TABLE_NAME = "servico";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Long id;

    @Column(name = "nomeCliente", length = 100, nullable = false)
    @NotBlank(groups = CreateServico.class)
    @Size(groups = CreateServico.class, min = 2, max = 100)
    private String nomeCliente;

    @Column(name = "enderecoOrigem", length = 100, nullable = false)
    @NotBlank(groups = CreateServico.class)
    @Size(groups = CreateServico.class, min = 5, max = 100)
    private String enderecoOrigem;

    @Column(name = "enderecoEntrega", length = 100, nullable = false)
    @NotBlank(groups = CreateServico.class)
    @Size(groups = CreateServico.class, min = 5, max = 100)
    private String enderecoEntrega;

    @Column(name = "dataInicio", nullable = false)
    @NotBlank(groups = CreateServico.class)
    private String dataInicio;

    @Column(name = "dataTermino", nullable = false)
    @NotBlank(groups = CreateServico.class)
    private String dataTermino;

    @Column(name = "valor", nullable = false)
    @NotNull(message = "O valor não pode ser nulo")
    private Float valor;

    @Column(name = "descricao", length = 255, nullable = true)
    @Size(groups = CreateServico.class, min = 5, max = 255)
    private String descricao;

    @ManyToMany
    @JoinTable(
        name = "servico_funcionario",
        joinColumns = @JoinColumn(name = "servico_id"),
        inverseJoinColumns = @JoinColumn(name = "funcionario_id"))
    @JsonIgnoreProperties({"servicos"})
    private Set<Funcionario> funcionarios = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "servico_veiculo",
        joinColumns = @JoinColumn(name = "servico_id"),
        inverseJoinColumns = @JoinColumn(name = "veiculo_id"))
    @JsonIgnoreProperties({"servicos"})
    private Set<Veiculo> veiculos = new HashSet<>();

    // Construtores
    public Servico() {}

    public Servico(Long id, String nomeCliente, String enderecoOrigem, String enderecoEntrega, String dataInicio, String dataTermino, Float valor, String descricao) {
        this.id = id;
        this.nomeCliente = nomeCliente;
        this.enderecoOrigem = enderecoOrigem;
        this.enderecoEntrega = enderecoEntrega;
        this.dataInicio = dataInicio;
        this.dataTermino = dataTermino;
        this.valor = valor;
        this.descricao = descricao;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomeCliente() {
        return nomeCliente;
    }

    public void setNomeCliente(String nomeCliente) {
        this.nomeCliente = nomeCliente;
    }

    public String getEnderecoOrigem() {
        return enderecoOrigem;
    }

    public void setEnderecoOrigem(String enderecoOrigem) {
        this.enderecoOrigem = enderecoOrigem;
    }

    public String getEnderecoEntrega() {
        return enderecoEntrega;
    }

    public void setEnderecoEntrega(String enderecoEntrega) {
        this.enderecoEntrega = enderecoEntrega;
    }

    public String getDataInicio() {
        return dataInicio;
    }

    public void setDataInicio(String dataInicio) {
        this.dataInicio = dataInicio;
    }

    public String getDataTermino() {
        return dataTermino;
    }

    public void setDataTermino(String dataTermino) {
        this.dataTermino = dataTermino;
    }

    public Float getValor() {
        return valor;
    }

    public void setValor(Float valor) {
        this.valor = valor;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Set<Funcionario> getFuncionarios() {
        return funcionarios;
    }

    public void setFuncionarios(Set<Funcionario> funcionarios) {
        this.funcionarios = funcionarios;
    }

    public Set<Veiculo> getVeiculos() {
        return veiculos;
    }

    public void setVeiculos(Set<Veiculo> veiculos) {
        this.veiculos = veiculos;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Servico servico = (Servico) obj;
        return Objects.equals(id, servico.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
