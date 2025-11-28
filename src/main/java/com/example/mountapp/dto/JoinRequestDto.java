package com.example.mountapp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JoinRequestDto {
    private String userid;
    private String password;
    private String email;
    private String phone;
    private String birthdate;
    private String gender;
    private String name;
    private String nickname;
    //test
}