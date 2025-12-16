package com.example.mountapp.dto;

import com.example.mountapp.domain.User;
import lombok.Getter;

@Getter
public class UserDetailResponseDto {
    private Long id;
    private String userid;    // 아이디
    private String name;      // 이름
    private String birthdate; // 생년월일
    private String gender;    // 성별
    private String phone;     // 전화번호
    private String email;     // 이메일

    public UserDetailResponseDto(User user) {
        this.id = user.getId();
        this.userid = user.getUserid();
        this.name = user.getName();
        this.birthdate = user.getBirthdate();
        this.gender = user.getGender();
        this.phone = user.getPhone();
        this.email = user.getEmail();
    }
}