package com.example.mountapp.repository;

import com.example.mountapp.domain.Comments;
import com.example.mountapp.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comments, Long> {

    // ▼▼▼ [수정] 정렬을 ASC -> DESC(최신순)로 변경 (기존 로직 유지 목적) ▼▼▼
    @Query("SELECT c FROM Comments c JOIN FETCH c.user WHERE c.postId = :postId ORDER BY c.commentId DESC")
    List<Comments> findByPostIdWithUser(@Param("postId") Long postId);
    int countByPostId(Long postId);
    void deleteAllByUser(User user);
}