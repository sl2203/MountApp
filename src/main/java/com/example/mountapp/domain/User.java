package com.example.mountapp.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "USERS")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_seq")
    @SequenceGenerator(
            name = "user_seq",
            sequenceName = "USER_ID_SEQ",
            allocationSize = 1
    )
     // 사용자 고유 ID
    private long id;

    @Column(name = "USERID", unique = true, nullable = false)
    private String userid; // 로그인 ID (유니크)

    @Column(name = "PASSWORD", nullable = false)
    private String password; // 암호화된 비밀번호

    @Column(name = "EMAIL")
    private String email;

    @Column(name = "NAME")
    private String name;

    @Column(name = "PHONENUMBER")
    private String phone;

    @Column(name = "BIRTHDATE")
    private String birthdate;

    @Column(name = "GENDER" )
    private String gender;

    @Column(name = "ADMIN")
    private String admin = "N";

    @Column(name = "NICKNAME")
    private String nickname;
}