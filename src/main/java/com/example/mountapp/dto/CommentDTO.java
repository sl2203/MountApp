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
    private String userId;
    private String nickname;

    // ▼▼▼ [추가] 프로필 이미지 필드 ▼▼▼
    private String profileImage;

    public static CommentDTO fromEntity(Comments comments) {
        return CommentDTO.builder()
                .commentId(comments.getCommentId())
                .commentContents(comments.getCommentContents())
                .commentDate(comments.getCommentDate())
                .postId(comments.getPostId())
                .userId(comments.getUser().getUserid())
                .nickname(comments.getUser().getNickname())

                // ▼▼▼ [추가] User 엔티티에서 이미지 경로 꺼내오기 ▼▼▼
                // User 엔티티에 getProfileImage() 메서드가 있어야 함
                .profileImage(comments.getUser().getProfileImage())
                .build();
    }
}