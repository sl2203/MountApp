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

    // (기존 GET, DELETE 메서드들...)
    @GetMapping("/posts")
    public List<PostResponseDTO> getAllPosts() {
        return postService.getAllPosts();
    }

    @GetMapping("/posts/{id}")
    public ResponseEntity<PostResponseDTO> getPostById(@PathVariable Long id) {
        try {
            PostResponseDTO postDto = postService.getPostById(id);
            return ResponseEntity.ok(postDto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        boolean isDeleted = postService.deletePost(id);
        return isDeleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    // ▼▼▼ [게시글 작성 API 추가] ▼▼▼
    // Multipart 요청(이미지+JSON)을 받기 위한 설정
    @PostMapping(value = "/posts", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> createPost(
            // 1. JSON 데이터 ("data" 라는 키값으로 옴)
            @RequestPart(value = "data") PostRequestDTO postRequestDTO,
            // 2. 이미지 파일들 ("files" 라는 키값으로 옴)
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            // 3. 현재 로그인한 유저 ID (JWT 필터에서 넣어준 값)
            @AuthenticationPrincipal Object principal
    ) {
        String userid;

        // Principal 타입 체크 후 ID 추출
        if (principal instanceof UserDetails) {
            userid = ((UserDetails) principal).getUsername(); // UserDetails인 경우
        } else if (principal instanceof String) {
            userid = (String) principal; // String인 경우
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