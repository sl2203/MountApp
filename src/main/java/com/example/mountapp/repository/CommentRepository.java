package com.example.mountapp.repository;

import com.example.mountapp.domain.Comments;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comments, Long> {
    // 특정 게시글(postId)에 달린 댓글 목록 조회 (최신순 정렬 예시)
    // DB 컬럼이 아닌 Entity 필드명(postId) 기준입니다.
    List<Comments> findByPostIdOrderByCommentIdDesc(Long postId);
}