package com.example.mountapp.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter
@NoArgsConstructor
@Table(name = "MOUNTAIN")
public class Mountain {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "mt_seq_gen")
    @SequenceGenerator(name = "mt_seq_gen", sequenceName = "MOUNTAIN_SEQ", allocationSize = 1)
    private Long id;

    private String name;
    private Integer height;
    private String location;
    private String difficulty; // 난이도

    @Column(length = 2000)
    private String description;

    @Column(length = 2000)
    private String trails; // 코스 정보

    @Column(name = "IMAGE_URL", length = 1000)
    private String imageUrl;

    private Double lat; // 위도
    private Double lon; // 경도

    @Column(length = 2000)
    private String notices; // 유의사항 (|로 구분)
}