package com.example.mountapp.controller;

import com.example.mountapp.dto.PostRequestDTO;
import com.example.mountapp.dto.PostResponseDTO;
import com.example.mountapp.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping("/posts")
    public List<PostResponseDTO> getAllPosts() {
        return postService.getAllPosts();
    }

    // ▼▼▼ [수정된 부분: 상세 조회] ▼▼▼
    @GetMapping("/posts/{id}")
    public ResponseEntity<PostResponseDTO> getPostById(
            @PathVariable Long id,
            @AuthenticationPrincipal Object principal // 로그인 정보를 받아옵니다
    ) {
        try {
            // 1. 현재 로그인한 유저 아이디 추출
            String userid = null;

            if (principal instanceof UserDetails) {
                userid = ((UserDetails) principal).getUsername();
            } else if (principal instanceof String) {
                userid = (String) principal;
            }
            // principal이 null이면 비로그인 유저 (userid = null 상태로 서비스 전달)

            // 2. 서비스 호출 (getPostById -> getPostDetail로 변경)
            // 파라미터로 id와 userid를 같이 넘겨야 "내가 좋아요 눌렀는지" 확인 가능
            PostResponseDTO postDto = postService.getPostDetail(id, userid);

            return ResponseEntity.ok(postDto);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    // ▲▲▲ [수정 끝] ▲▲▲

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        boolean isDeleted = postService.deletePost(id);
        return isDeleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @PostMapping(value = "/posts", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> createPost(
            @RequestPart(value = "data") PostRequestDTO postRequestDTO,
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            @AuthenticationPrincipal Object principal
    ) {
        String userid;

        if (principal instanceof UserDetails) {
            userid = ((UserDetails) principal).getUsername();
        } else if (principal instanceof String) {
            userid = (String) principal;
        } else {
            return ResponseEntity.status(403).body("로그인 정보가 올바르지 않습니다.");
        }

        try {
            postService.createPost(postRequestDTO, files, userid);
            return ResponseEntity.ok("게시글 등록 성공");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("파일 업로드 실패");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("등록 실패: " + e.getMessage());
        }
    }
}