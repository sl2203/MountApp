package com.example.mountapp.repository;

import com.example.mountapp.domain.Likes;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface LikesRepository extends JpaRepository<Likes, Long> {
    // 이미 좋아요를 눌렀는지 확인용
    Optional<Likes> findByUseridAndPostid(Long userid, Long postid);

    // 해당 게시글의 총 좋아요 수 카운트
    int countByPostid(Long postid);

    // 유저가 해당 글에 좋아요 눌렀는지 여부 (true/false)
    int countByUseridAndPostid(Long userid, Long postid);

    long countByUserid(Long userid);
}