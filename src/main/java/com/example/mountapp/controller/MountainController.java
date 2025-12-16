package com.example.mountapp.controller;

import com.example.mountapp.domain.Mountain;
import com.example.mountapp.dto.MountainDetailDTO;
import com.example.mountapp.repository.MountainRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/mountains")
@RequiredArgsConstructor
public class MountainController {

    private final MountainRepository mountainRepository;

    // 1. 목록 조회 (GET /api/mountains)
    @GetMapping
    public List<Mountain> getAllMountains() {
        return mountainRepository.findAll();
    }

    // 2. 상세 조회 (GET /api/mountains/1)
    @GetMapping("/{id}")
    public ResponseEntity<MountainDetailDTO> getMountainById(@PathVariable Long id) {
        return mountainRepository.findById(id)
                .map(mountain -> ResponseEntity.ok(new MountainDetailDTO(mountain)))
                .orElse(ResponseEntity.notFound().build());
    }
}