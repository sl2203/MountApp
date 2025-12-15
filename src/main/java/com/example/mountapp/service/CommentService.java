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
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<CommentDTO> getCommentsByPostId(Long postId) {
        // ▼▼▼ [수정] 성능 최적화를 위해 Fetch Join 쿼리 사용 ▼▼▼
        // 기존: findByPostIdOrderByCommentIdDesc(postId)
        List<Comments> comments = commentRepository.findByPostIdWithUser(postId);

        return comments.stream()
                .map(CommentDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // createComment 등 나머지 코드는 그대로 유지...
    @Transactional
    public void createComment(Long postId, CommentDTO dto) {
        User user = userRepository.findByUserid(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));

        Comments comments = new Comments();
        comments.setPostId(postId);
        comments.setCommentContents(dto.getCommentContents());
        comments.setCommentDate(LocalDate.now().toString());
        comments.setUser(user);

        commentRepository.save(comments);
    }
}