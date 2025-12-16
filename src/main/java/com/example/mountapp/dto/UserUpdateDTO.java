package com.example.mountapp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdateDTO {
    private String name;
    private String birthdate;
    private String gender;
    private String phone;
    private String email;
    private String nickname;
}