package com.example.mountapp.dto;

import com.example.mountapp.domain.Comments;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentDTO {
    private Long commentId;
    private String commentContents;
    private String commentDate;
    private Long postId;
    private String userId; // ID도 필요하다면 유지

    // [추가] 화면에 보여줄 닉네임 필드
    private String nickname;

    // Entity -> DTO 변환 메서드
    public static CommentDTO fromEntity(Comments comments) {
        return CommentDTO.builder()
                .commentId(comments.getCommentId())
                .commentContents(comments.getCommentContents())
                .commentDate(comments.getCommentDate())
                .postId(comments.getPostId())

                // [핵심] comments.getUser()로 유저 객체에 접근해서 닉네임을 꺼냄
                .userId(comments.getUser().getUserid())
                .nickname(comments.getUser().getNickname())
                .build();
    }
}