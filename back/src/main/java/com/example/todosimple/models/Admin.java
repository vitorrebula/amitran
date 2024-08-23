package com.example.todosimple.models;

import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = Admin.TABLE_NAME)
public class Admin {
    public interface CreateAdmin {}
    public interface UpdateAdmin {}

    public static final String TABLE_NAME = "admin";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Long id;

    @Column(name = "email", length = 100, nullable = false, unique = true)
    @NotBlank(groups = CreateAdmin.class)
    @Size(groups = CreateAdmin.class, min = 15, max = 100)
    private String email;

    @Column(name = "password", length = 60, nullable = false, unique = true)
    @NotBlank(groups = CreateAdmin.class)
    @Size(groups = CreateAdmin.class, min = 8, max = 60)
    private String password;

    public Admin() {
    }


    public Admin(Long id, String email, String password) {
        this.id = id;
        this.email = email;
        this.password = password;
    }


    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public boolean equals(Object obj){
        if (obj == this) {
            return true;
        }
        if (!(obj instanceof Admin)) {
            return false;
        }
        Admin admin = (Admin) obj;

        return Objects.equals(id, admin.id) && Objects.equals(email, admin.email) && Objects.equals(password, admin.password);
    }

    @Override
    public int hashCode(){
        final int prime = 31;
        int result = 1;
        result = prime * result + ((this.id == null) ? 0 : this.id.hashCode());
        return result;
    }



}
