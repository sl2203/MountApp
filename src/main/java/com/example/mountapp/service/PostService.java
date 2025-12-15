package com.example.mountapp.service;

import com.example.mountapp.domain.Post_Review;
import com.example.mountapp.domain.User;
import com.example.mountapp.dto.PostRequestDTO;
import com.example.mountapp.dto.PostResponseDTO;
import com.example.mountapp.repository.LikesRepository; // [추가]
import com.example.mountapp.repository.PostRepository;
import com.example.mountapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final LikesRepository likesRepository; // [추가] 좋아요 데이터 접근용

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Transactional(readOnly = true)
    public List<PostResponseDTO> getAllPosts() {
        return postRepository.findAll().stream()
                .map(entity -> {
                    PostResponseDTO dto = new PostResponseDTO(entity);
                    // 목록 조회 시에도 좋아요 개수를 보여주고 싶다면 아래 주석 해제
                    // dto.setLikeCount(likeRepository.countByPostid(entity.getPostid()));
                    return dto;
                })
                .collect(Collectors.toList());
    }

    /**
     * [수정됨] 게시글 상세 조회
     * - 게시글 내용뿐만 아니라 좋아요 개수, 로그인한 유저의 좋아요 여부를 포함하여 반환
     */
    @Transactional(readOnly = true)
    public PostResponseDTO getPostDetail(Long id, String currentUserIdStr) {
        // 1. 게시글 찾기
        Post_Review entity = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다. id=" + id));

        // 2. DTO 변환
        PostResponseDTO dto = new PostResponseDTO(entity);

        // 3. 좋아요 개수 세팅
        int likeCount = likesRepository.countByPostid(id);
        dto.setLikeCount(likeCount);

        // 4. 현재 로그인한 유저가 좋아요를 눌렀는지 세팅
        if (currentUserIdStr != null) {
            // (1) String 아이디("admin")로 유저 엔티티를 찾습니다.
            User user = userRepository.findByUserid(currentUserIdStr)
                    .orElse(null); // 유저가 없으면 null 처리

            if (user != null) {
                // (2) 찾은 유저의 고유 번호(PK, 예: 1)를 꺼냅니다.
                Long realUserId = user.getId();

                // (3) 그 번호로 좋아요 테이블을 조회합니다.
                boolean isLiked = likesRepository.countByUseridAndPostid(realUserId, id) > 0;
                dto.setLiked(isLiked);
            } else {
                dto.setLiked(false);
            }
        } else {
            dto.setLiked(false);
        }

        return dto;
    }

    @Transactional
    public boolean deletePost(Long id) {
        if (postRepository.existsById(id)) {
            postRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Transactional
    public void createPost(PostRequestDTO dto, List<MultipartFile> files, String userid) throws IOException {

        User user = userRepository.findByUserid(userid)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + userid));

        List<String> fileNames = new ArrayList<>();

        // ... (파일 저장 로직 기존과 동일) ...
        if (files != null && !files.isEmpty()) {
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    String originalName = file.getOriginalFilename();
                    String savedName = UUID.randomUUID() + "_" + originalName;
                    File dest = new File(dir, savedName);
                    file.transferTo(dest);
                    fileNames.add(savedName);
                }
            }
        }
        // ...

        String imagePathString = String.join(",", fileNames);

        Post_Review post = new Post_Review();
        post.setTitle(dto.getTitle());
        post.setPostcontents(dto.getContent());
        post.setRating(dto.getRating() != null ? dto.getRating() : 0.0);
        post.setCategory(dto.getCategory());
        post.setImagePath(imagePathString.isEmpty() ? null : imagePathString);
        post.setUser(user);

        postRepository.save(post);
    }
    @Transactional(readOnly = true)
    public long getMyPostCount(String userid) {
        return postRepository.countByUser_Userid(userid);
    }
}