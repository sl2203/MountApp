package com.example.mountapp.controller;

import com.example.mountapp.domain.Post_Review;
import com.example.mountapp.repository.PostRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @GetMapping("/posts")
    public List<Post_Review> getAllPosts() {
        return postRepository.findAll(); // 모든 게시글 리턴
    }
    @GetMapping("/posts/{id}")
    public ResponseEntity<Post_Review> getPostById(@PathVariable Long id) {
        Optional<Post_Review> post = postRepository.findById(id);

        // 데이터가 있으면 200 OK와 함께 데이터 반환, 없으면 404 Not Found 반환
        return post.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 3. 특정 게시글 삭제 (DetailPage 삭제 버튼용)
    // 요청 URL: DELETE /api/posts/1
    @DeleteMapping("/posts/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        if (postRepository.existsById(id)) {
            postRepository.deleteById(id);
            return ResponseEntity.ok().build(); // 삭제 성공 (200)
        } else {
            return ResponseEntity.notFound().build(); // 삭제할 대상 없음 (404)
        }
    }
}