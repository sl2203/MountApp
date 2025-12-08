package com.example.mountapp.service;

import com.example.mountapp.domain.Post_Review;
import com.example.mountapp.dto.PostResponseDTO;
import com.example.mountapp.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;

    @Transactional(readOnly = true)
    public List<PostResponseDTO> getAllPosts() {
        return postRepository.findAllByOrderByPostidDesc().stream()
                .map(PostResponseDTO::new) // Entity -> DTO 변환
                .collect(Collectors.toList());
    }
}