package com.example.todosimple.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.todosimple.models.Admin;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long>{
    
}
