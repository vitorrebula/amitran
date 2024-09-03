package com.example.todosimple.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.todosimple.models.Servico;

@Repository
public interface ServicoRepository extends JpaRepository<Servico, Long>{
    @Query("SELECT s FROM Servico s WHERE s.dataInicio >= :dataInicio AND s.dataInicio <= :dataTermino")
    List<Servico> findByDataInicioBetween(@Param("dataInicio") String dataInicio, @Param("dataTermino") String dataTermino);
} 
