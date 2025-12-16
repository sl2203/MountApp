package com.example.mountapp.controller;

import com.example.mountapp.dto.UserDetailResponseDto;
import com.example.mountapp.dto.UserListResponseDto;
import com.example.mountapp.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // 회원 목록 조회 API
    @GetMapping("/users")
    public List<UserListResponseDto> getUserList() {
        return adminService.getAllUsers();
    }

    // 회원 상세 조회 API (Long -> String 변경)
    @GetMapping("/users/{id}")
    public UserDetailResponseDto getUserDetail(@PathVariable String id) { // ✅ 여기 수정됨
        return adminService.getUserDetail(id);
    }

    // 회원 삭제 API (Long -> String 변경)
    @DeleteMapping("/users/{id}")
    public String deleteUser(@PathVariable String id) { // ✅ 여기 수정됨
        adminService.deleteUser(id);
        return "삭제 완료";
    }
}