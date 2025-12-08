package com.example.mountapp.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Getter
@Setter
@Entity
@Table(name = "POST_REVIEW")
public class Post_Review {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "post_seq")
    @SequenceGenerator(name = "post_seq", sequenceName = "POST_ID_SEQ", allocationSize = 1)
    private long postid;

    @Column(nullable = false)
    private String title;

    @Column(name = "POSTCONTENTS", nullable = false)
    private String postcontents;

    @Column(nullable = false)
    private String postdate;

    private long views = 0;

    @Column(nullable = false)
    private String userid;

    // 0이면 일반 게시글, 1 이상이면 리뷰로 간주
    private Double rating;

    // 카테고리 (예: "자유게시판", "맛집", "산" 등)
    private String category;

    @Column(name = "IMAGE_PATH")
    private String imagePath; // 이미지 파일명 (콤마로 구분된 문자열)

    @PrePersist
    public void onPrePersist() {
        this.postdate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }
}