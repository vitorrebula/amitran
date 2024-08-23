package com.example.todosimple.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = Veiculo.TABLE_NAME)
public class Veiculo {
    public interface ICreateVeiculo {}
    public interface IUpdateVeiculo {}

    public static final String TABLE_NAME = "Veiculo";

    @Id
    @Column(name = "placa", length = 7, nullable = false, unique = true)
    @NotNull(groups = ICreateVeiculo.class)
    @NotEmpty(groups = ICreateVeiculo.class)
    @Size(groups = ICreateVeiculo.class, min = 7, max = 7)
    private String placa;

    @Column(name = "modelo", length = 50, nullable = false)
    @NotNull(groups = ICreateVeiculo.class)
    @NotEmpty(groups = ICreateVeiculo.class)
    @Size(groups = ICreateVeiculo.class, min = 2, max = 50)
    private String modelo;

    @Column(name = "ano", length = 4, nullable = false)
    @NotNull(groups = ICreateVeiculo.class)
    @Min(groups = ICreateVeiculo.class, value = 1)
    @Max(groups = ICreateVeiculo.class, value = 2025)
    private Long ano;

    @Column(name = "status", length = 10, nullable = false)
    @NotNull(groups = { ICreateVeiculo.class, IUpdateVeiculo.class })
    private String status;

    @Column(name = "tipo_veiculo", length = 20, nullable = false)
    @NotNull(groups = ICreateVeiculo.class)
    @NotEmpty(groups = ICreateVeiculo.class)
    @Size(groups = ICreateVeiculo.class, min = 3, max = 20)
    private String tipoVeiculo;

    @ManyToMany(mappedBy = "veiculos")
    @JsonIgnoreProperties({"veiculos"})
    private Set<Servico> servicos = new HashSet<>();

    // Construtores
    public Veiculo() {}

    public Veiculo(String placa, String modelo, Long ano, String status, String tipoVeiculo) {
        this.placa = placa;
        this.modelo = modelo;
        this.ano = ano;
        this.status = status;
        this.tipoVeiculo = tipoVeiculo;
    }

    // Getters e Setters
    public String getPlaca() {
        return placa;
    }

    public void setPlaca(String placa) {
        this.placa = placa;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public Long getAno() {
        return ano;
    }

    public void setAno(Long ano) {
        this.ano = ano;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTipoVeiculo() {
        return tipoVeiculo;
    }

    public void setTipoVeiculo(String tipoVeiculo) {
        this.tipoVeiculo = tipoVeiculo;
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
        Veiculo veiculo = (Veiculo) obj;
        return Objects.equals(placa, veiculo.placa);
    }

    @Override
    public int hashCode() {
        return Objects.hash(placa);
    }
}
