package com.example.mountapp.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "POST/REVIEW")
public class Post_Review {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "post_seq")
    @SequenceGenerator(
            name = "post_seq",
            sequenceName = "POST_ID_SEQ",
            allocationSize = 1
    )
    // 사용자 고유 ID
    private long postid;

    @Column(name = "TITLE", nullable = false)
    private String title;

    @Column(name = "POSTCONTENTS", nullable = false)
    private String postcontents;

    @Column(name = "POSTDATE",  nullable = false)
    private String postdate;

    @Column(name = "VIEWS")
    private long views = 0;

    @Column(name = "USERID", nullable = false)
    private String userid;

    @Column(name = "RATING")
    private long rating;
}