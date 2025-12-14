package com.example.mountapp.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "COMMENTS")
public class Comments {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "comment_seq_gen")
    @SequenceGenerator(name = "comment_seq_gen", sequenceName = "COMMENT_SEQ", allocationSize = 1)
    @Column(name = "COMMENTID")
    private Long commentId;

    @Column(name = "COMMENTCONTENTS")
    private String commentContents;

    @Column(name = "COMMENTDATE")
    private String commentDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USERID", referencedColumnName = "USERID")
    private User user;

    @Column(name = "POSTID")
    private Long postId;
}