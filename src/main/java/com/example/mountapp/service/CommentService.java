package com.example.mountapp.service;

import com.example.mountapp.domain.Comments;
import com.example.mountapp.domain.User;
import com.example.mountapp.dto.CommentDTO;
import com.example.mountapp.repository.CommentRepository;
import com.example.mountapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository; // [추가] 유저를 찾아야 함

    // 조회는 수정할 필요 없음 (JPA가 알아서 닉네임 가져옴)
    @Transactional(readOnly = true)
    public List<CommentDTO> getCommentsByPostId(Long postId) {
        List<Comments> comments = commentRepository.findByPostIdOrderByCommentIdDesc(postId);
        return comments.stream()
                .map(CommentDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // 작성
    @Transactional
    public void createComment(Long postId, CommentDTO dto) {
        // 1. DTO에 있는 userId(String)로 진짜 유저 객체를 찾음
        User user = userRepository.findByUserid(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));

        Comments comments = new Comments();
        comments.setPostId(postId);
        comments.setCommentContents(dto.getCommentContents());

        String nowDate = LocalDate.now().toString();
        comments.setCommentDate(nowDate);// 필수 컬럼

        // [수정] String ID 대신 User 객체 자체를 저장
        comments.setUser(user);

        commentRepository.save(comments);
    }
}