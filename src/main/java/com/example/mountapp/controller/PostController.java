package com.example.mountapp.controller;

import com.example.mountapp.domain.Post_Review;
import com.example.mountapp.repository.PostRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/comm")
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @GetMapping("/posts")
    public List<Post_Review> getAllPosts() {
        return postRepository.findAll(); // 모든 게시글 리턴
    }
}