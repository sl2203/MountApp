package com.example.mountapp.service;

import com.example.mountapp.domain.User;
import com.example.mountapp.dto.UserDetailResponseDto;
import com.example.mountapp.dto.UserListResponseDto;
import com.example.mountapp.repository.CommentRepository;
import com.example.mountapp.repository.LikesRepository;
import com.example.mountapp.repository.PostRepository;
import com.example.mountapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;       // 이름 확인
    private final CommentRepository commentRepository; // 이름 확인
    private final LikesRepository likesRepository;
    // 1. 전체 회원 목록 조회
    @Transactional(readOnly = true)
    public List<UserListResponseDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserListResponseDto::new)
                .collect(Collectors.toList());
    }

    // 2. 특정 회원 상세 조회 (Long -> String 변경)
    @Transactional(readOnly = true)
    public UserDetailResponseDto getUserDetail(String id) { // ✅ 여기 수정됨
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저가 없습니다. id=" + id));
        return new UserDetailResponseDto(user);
    }

    // 3. 회원 삭제 (Long -> String 변경)
    @Transactional
    public void deleteUser(String useridStr) { // Controller에서 넘어온 ID (String이면 변환 필요)

        // 1. String ID로 유저 찾기 (만약 Controller가 Long을 넘긴다면 바로 사용)
        // User 엔티티의 PK가 Long id이므로, findById는 Long을 받아야 합니다.
        // 하지만 관리자 페이지에서 String(userid)을 넘기는지, Long(pk)을 넘기는지에 따라 다릅니다.
        // 여기서는 Long id를 기준으로 작성합니다. (앞선 질문의 에러 로그가 97(숫자)이었으므로)

        String pk = useridStr; // String으로 받았다면 변환

        User user = userRepository.findById(pk)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저가 없습니다."));

        // 2. [수동 삭제 1] 좋아요 삭제 (객체 연결이 아니므로 ID로 삭제)
        // Likes 엔티티의 userid는 User의 PK(long id)를 의미하는 것으로 보입니다.
        likesRepository.deleteAllByUserid(user.getId());

        // 3. [수동 삭제 2] 댓글 삭제 (객체 연결)
        commentRepository.deleteAllByUser(user);

        // 4. [수동 삭제 3] 게시글 삭제 (객체 연결)
        postRepository.deleteAllByUser(user);

        // 5. [마지막] 유저 삭제 (이제 자식들이 없어서 삭제됨!)
        userRepository.delete(user);
    }
}