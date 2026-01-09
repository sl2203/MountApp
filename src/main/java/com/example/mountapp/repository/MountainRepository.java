package com.example.mountapp.repository;

import com.example.mountapp.domain.Mountain;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MountainRepository extends JpaRepository<Mountain, Long> {

}