package com.example.todosimple.models;

import java.util.Collection;
import java.util.List;
import java.util.Objects;

import java.util.Date;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.todosimple.enums.UserRole;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = Admin.TABLE_NAME)
public class Admin implements UserDetails {
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
        
    @Enumerated(EnumType.STRING)
    private UserRole userRole;

    
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at", nullable = false, updatable = false)
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "updated_at", nullable = true)
    private Date updatedAt;


    public Admin() {
    }


    public Admin(String email, String password, UserRole userRole) {
    
        this.email = email;
        this.password = password;
        this.userRole= userRole;
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


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
                if (this.userRole == UserRole.ADMIN) return List.of(new SimpleGrantedAuthority("ROLE_ADMIN"));
        else return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }


    @Override
    public String getUsername() {

        throw new UnsupportedOperationException("Unimplemented method 'getUsername'");
    }



}
