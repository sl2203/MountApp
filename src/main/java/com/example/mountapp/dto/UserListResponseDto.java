package com.example.mountapp.dto;

import com.example.mountapp.domain.User;
import lombok.Getter;

@Getter
public class UserListResponseDto {
    private Long id;        // DB PK (예: 1, 2...)
    private String name;    // 이름 (예: 김등산)
    private String email;   // 이메일

    public UserListResponseDto(User user) {
        this.id = user.getId(); // User 엔티티에 Long id가 있다고 가정
        this.name = user.getName();
        this.email = user.getEmail();
    }
}