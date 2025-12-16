package com.example.mountapp.service;

import com.example.mountapp.domain.User;
import com.example.mountapp.dto.UserDetailResponseDto;
import com.example.mountapp.dto.UserListResponseDto;
import com.example.mountapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;

    // 1. 전체 회원 목록 조회
    @Transactional(readOnly = true)
    public List<UserListResponseDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserListResponseDto::new)
                .collect(Collectors.toList());
    }

    // 2. 특정 회원 상세 조회 (Long -> String 변경)
    @Transactional(readOnly = true)
    public UserDetailResponseDto getUserDetail(String id) { // ✅ 여기 수정됨
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저가 없습니다. id=" + id));
        return new UserDetailResponseDto(user);
    }

    // 3. 회원 삭제 (Long -> String 변경)
    @Transactional
    public void deleteUser(String id) { // ✅ 여기 수정됨
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저가 없습니다. id=" + id));
        userRepository.delete(user);
    }
}