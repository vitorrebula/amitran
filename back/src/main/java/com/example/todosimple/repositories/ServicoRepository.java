package com.example.todosimple.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.todosimple.models.Servico;

@Repository
public interface ServicoRepository extends JpaRepository<Servico, Long>{

    
} 
