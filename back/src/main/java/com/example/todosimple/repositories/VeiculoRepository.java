package com.example.todosimple.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.todosimple.models.Veiculo;

@Repository
public interface VeiculoRepository extends JpaRepository<Veiculo, String> {

}
