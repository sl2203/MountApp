package com.example.mountapp.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "LIKES")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Likes {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "LIKES_SEQ_GEN")
    @SequenceGenerator(name = "LIKES_SEQ_GEN", sequenceName = "LIKES_SEQ", allocationSize = 1)
    private Long id;

    @Column(name = "userid")
    private long userid; // User 엔티티와 연관관계를 맺어도 되지만, 간단히 ID만 저장해도 됨

    @Column(name = "postid")
    private Long postid;   // Post 엔티티 ID
}