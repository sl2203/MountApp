package com.example.mountapp.domain;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

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

    @OneToMany(mappedBy = "mountain", cascade = CascadeType.ALL)
    @JsonManagedReference // 순환 참조 방지 (이 쪽 데이터를 보여줌)
    private List<Trail> trails = new ArrayList<>();

    @Column(name = "IMAGE_URL", length = 1000)
    private String imageUrl;

    private Double lat; // 위도
    private Double lon; // 경도

    @Column(length = 2000)
    private String notices; // 유의사항 (|로 구분)
}