    package com.example.mountapp.repository;

    import com.example.mountapp.domain.Post_Review;
    import com.example.mountapp.domain.User;
    import org.springframework.data.jpa.repository.JpaRepository;

    import java.util.List;

    public interface PostRepository extends JpaRepository<Post_Review, Long> {
        long countByUser_Userid(String userid);
        List<Post_Review> findByUser_UseridOrderByPostidDesc(String userid);

        List<Post_Review> findAllByOrderByPostidDesc();
        void deleteAllByUser(User user);
    }