package com.example.mountapp.repository;

import com.example.mountapp.domain.Mountain;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MountainRepository extends JpaRepository<Mountain, Long> {
    // 아무것도 안 적어도 findAll, findById 기능이 자동으로 생깁니다.
}