package com.example.mountapp.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter
@NoArgsConstructor
@Table(name = "TRAIL")
public class Trail {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "trail_seq_gen")
    @SequenceGenerator(name = "trail_seq_gen", sequenceName = "TRAIL_SEQ", allocationSize = 1)
    private Long id;

    private String name;        // 코스 이름 (예: A코스)
    private String description; // 코스 설명

    private String difficulty;  // 난이도 (예: 쉬움, 보통, 어려움)
    private String uptime;      // 소요 시간 (예: 2시간 30분)
    private String distance;    // 거리 (예: 5.4km)

    private boolean isPopular;  // 인기 코스 여부

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MOUNTAIN_ID")
    @JsonBackReference // 무한 참조 방지
    private Mountain mountain;
}