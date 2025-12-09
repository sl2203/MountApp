package com.example.mountapp.service;

import com.example.mountapp.domain.Post_Review;
import com.example.mountapp.domain.User;
import com.example.mountapp.dto.PostRequestDTO;
import com.example.mountapp.dto.PostResponseDTO;
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

    // ★ 이미지가 저장될 로컬 경로 (본인 컴퓨터 환경에 맞게 반드시 수정!)
    // 윈도우 예시: "C:/mountapp/images/"
    // 맥/리눅스 예시: "/Users/내이름/mountapp/images/"
    @Value("${file.upload-dir}")
    private String uploadDir;

    // (기존 getAllPosts, getPostById, deletePost 코드는 그대로 유지...)
    @Transactional(readOnly = true)
    public List<PostResponseDTO> getAllPosts() {
        return postRepository.findAll().stream()
                .map(PostResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PostResponseDTO getPostById(Long id) {
        Post_Review entity = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다. id=" + id));
        return new PostResponseDTO(entity);
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

        // 1. 유저 조회 (findByUserid 사용)
        User user = userRepository.findByUserid(userid)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + userid));

        // 2. 이미지 파일 저장 로직
        List<String> fileNames = new ArrayList<>();

        System.out.println("================ 파일 업로드 시작 ================");
        System.out.println("저장 경로(설정값): " + uploadDir);

        if (files != null && !files.isEmpty()) {
            File dir = new File(uploadDir);

            // 폴더가 없으면 생성하고 로그 출력
            if (!dir.exists()) {
                boolean created = dir.mkdirs();
                System.out.println("폴더가 없어서 생성했습니다. 결과: " + created);
            } else {
                System.out.println("폴더가 이미 존재합니다.");
            }

            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    String originalName = file.getOriginalFilename();
                    String savedName = UUID.randomUUID() + "_" + originalName;

                    // 전체 경로 생성
                    File dest = new File(dir, savedName);

                    try {
                        // ★★★ 여기서 실제로 저장이 일어납니다 ★★★
                        file.transferTo(dest);

                        System.out.println("파일 저장 성공! -> " + dest.getAbsolutePath());
                        fileNames.add(savedName);
                    } catch (IOException e) {
                        System.err.println("파일 저장 실패: " + e.getMessage());
                        throw e; // 에러를 다시 던져서 트랜잭션 롤백
                    }
                }
            }
        } else {
            System.out.println("전송된 파일이 없습니다.");
        }
        System.out.println("==============================================");

        // 이미지 경로들을 콤마(,)로 연결하여 문자열로 변환 (DB 저장용)
        String imagePathString = String.join(",", fileNames);

        // 3. 엔티티 생성 및 값 세팅
        Post_Review post = new Post_Review();
        post.setTitle(dto.getTitle());
        post.setPostcontents(dto.getContent());
        // 리뷰가 아니면 평점 0점
        post.setRating(dto.getRating() != null ? dto.getRating() : 0.0);
        post.setCategory(dto.getCategory());
        post.setImagePath(imagePathString.isEmpty() ? null : imagePathString);
        post.setUser(user); // 작성자 정보 주입

        // 날짜 등은 @PrePersist나 DB 기본값으로 처리됨

        // 4. DB 저장
        postRepository.save(post);
    }
}