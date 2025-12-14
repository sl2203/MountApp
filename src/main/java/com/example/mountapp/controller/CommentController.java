package com.example.mountapp.controller;

import com.example.mountapp.dto.CommentDTO;
import com.example.mountapp.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication; // [필수] import 추가
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    // 댓글 목록 조회 (GET)
    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<List<CommentDTO>> getComments(@PathVariable Long postId) {
        List<CommentDTO> comments = commentService.getCommentsByPostId(postId);
        return ResponseEntity.ok(comments);
    }

    // [수정] 댓글 작성 (POST) - Authentication 객체 추가
    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<String> createComment(
            @PathVariable Long postId,
            @RequestBody CommentDTO dto,
            Authentication authentication // <--- [핵심] 여기에 토큰 해석된 정보가 들어있습니다.
    ) {
        // 1. 토큰에서 로그인한 사람의 ID(username)를 꺼냅니다.
        String userId = authentication.getName();

        // 2. DTO에 강제로 집어넣습니다. (프론트에서 null로 보내도 여기서 채워짐)
        dto.setUserId(userId);

        // 3. 서비스로 넘깁니다.
        commentService.createComment(postId, dto);

        return ResponseEntity.ok("댓글 등록 완료");
    }
}