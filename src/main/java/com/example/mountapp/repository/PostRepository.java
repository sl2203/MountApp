    package com.example.mountapp.repository;

    import com.example.mountapp.domain.Post_Review;
    import org.springframework.data.jpa.repository.JpaRepository;

    import java.util.List;

    public interface PostRepository extends JpaRepository<Post_Review, Long> {
        // 게시글 ID 내림차순(최신순)으로 전체 조회
        List<Post_Review> findAllByOrderByPostidDesc();
        long countByUser_Userid(String userid);

    }