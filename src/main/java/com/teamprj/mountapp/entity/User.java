package com.teamprj.mountapp.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "USER") // 실제 오라클 테이블 이름
@Getter @Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 혹은 Oracle 시퀀스 사용 시 SEQUENCE 전략 사용
    @Column(name = "USERID")
    private String id;

    @Column(name = "NICKNAME")
    private String nickname;

    @Column(name = "EMAIL")
    private String email;

    @Column(name = "NAME")
    private String name;

    @Column(name = "ADDRESS")
    private String address;

    @Column(name = "PHONENUMBER")
    private String phonenumber;

    @Column(name = "ADMIN")
    private String admin;
}