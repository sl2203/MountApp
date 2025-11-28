package com.example.mountapp.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "COMMENTS")
public class Comments {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "comment_seq")
    @SequenceGenerator(
            name = "comment_seq",
            sequenceName = "COMMENT_ID_SEQ",
            allocationSize = 1
    )
    // 사용자 고유 ID
    private long COMMENTID;

    @Column(name = "COMMENTCONTENTS", nullable = false)
    private String commentContents;

    @Column(name = "COMMENTDATE", nullable = false)
    private String commentDate;

    @Column(name = "USERID",  nullable = false)
    private String postdate;

    @Column(name = "POSTID", nullable = false)
    private String postid;


}