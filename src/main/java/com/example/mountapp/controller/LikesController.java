package com.example.mountapp.controller;

import com.example.mountapp.domain.Likes;
import com.example.mountapp.domain.Post_Review; // ★ [추가] Post 엔티티 import
import com.example.mountapp.domain.User;
import com.example.mountapp.repository.LikesRepository;
import com.example.mountapp.repository.PostRepository; // ★ [추가] PostRepository import
import com.example.mountapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/likes")
@RequiredArgsConstructor
public class LikesController {

    private final LikesRepository likesRepository;
    private final UserRepository userRepository;

    // ★ [추가] 게시글 정보를 업데이트하기 위해 Repository 주입
    private final PostRepository postRepository;

    // 좋아요 토글 (누르면 ON/OFF 되고, 최신 개수 반환)
    @PostMapping("/{postId}")
    public ResponseEntity<Map<String, Object>> toggleLike(
            @PathVariable Long postId,
            @AuthenticationPrincipal Object principal
    ) {
        if (principal == null) return ResponseEntity.status(401).build();

        // 1. 로그인한 유저의 실제 PK(Long) 찾기
        String username = ((UserDetails) principal).getUsername();
        User user = userRepository.findByUserid(username)
                .orElseThrow(() -> new IllegalArgumentException("유저 없음"));
        Long userId = user.getId();

        // 2. 좋아요 여부 확인 및 토글 (Likes 테이블 처리)
        Optional<Likes> existingLike = likesRepository.findByUseridAndPostid(userId, postId);

        boolean isLiked;
        if (existingLike.isPresent()) {
            likesRepository.delete(existingLike.get());
            isLiked = false;
        } else {
            Likes newLike = Likes.builder()
                    .userid(userId)
                    .postid(postId)
                    .build();
            likesRepository.save(newLike);
            isLiked = true;
        }

        // 3. 최신 좋아요 개수 다시 세기
        int newCount = likesRepository.countByPostid(postId);

        // ==========================================
        // ★ [추가된 부분] Post 테이블에도 개수 반영 (영구 저장)
        // ==========================================
        Post_Review post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        // Post 엔티티에 setLikes(int count) 메서드가 있어야 합니다.
        post.setLikes(newCount);

        // 변경된 Post 정보를 DB에 업데이트
        postRepository.save(post);
        // ==========================================

        // 4. 결과 반환 (상태 + 개수)
        Map<String, Object> response = new HashMap<>();
        response.put("liked", isLiked);
        response.put("count", newCount);

        return ResponseEntity.ok(response);
    }

    // 상세 페이지 들어갈 때 "내가 좋아요 눌렀는지" 확인용 API
    @GetMapping("/{postId}/status")
    public ResponseEntity<Boolean> checkLikeStatus(
            @PathVariable Long postId,
            @AuthenticationPrincipal Object principal
    ) {
        // 1. 비로그인 처리
        if (principal == null || principal instanceof String) {
            return ResponseEntity.ok(false);
        }

        // 2. 로그인 유저 처리
        UserDetails userDetails = (UserDetails) principal;

        // 3. 유저 ID 찾기
        User user = userRepository.findByUserid(userDetails.getUsername()).orElse(null);
        if (user == null) return ResponseEntity.ok(false);

        // 4. 좋아요 여부 확인
        boolean status = likesRepository.countByUseridAndPostid(user.getId(), postId) > 0;

        return ResponseEntity.ok(status);
    }
    @GetMapping("/my/count")
    public ResponseEntity<Long> getMyLikeCount(@AuthenticationPrincipal Object principal) {

        // 1. 비로그인 처리
        if (principal == null) {
            return ResponseEntity.ok(0L);
        }

        try {
            // 2. 로그인 유저 정보 추출 (Security Context)
            String useridStr;
            if (principal instanceof UserDetails) {
                useridStr = ((UserDetails) principal).getUsername();
            } else if (principal instanceof String) {
                useridStr = (String) principal;
            } else {
                return ResponseEntity.ok(0L);
            }

            // 3. String 아이디로 실제 DB의 User 엔티티 조회 (PK인 Long id가 필요함)
            User user = userRepository.findByUserid(useridStr)
                    .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));

            // 4. Repository 호출 (내 PK로 카운트 조회)
            long myLikeCount = likesRepository.countByUserid(user.getId());

            return ResponseEntity.ok(myLikeCount);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(0L); // 에러 시 0 반환
        }
    }
}