package com.example.mountapp.service;

import com.example.mountapp.config.JwtUtil;
import com.example.mountapp.domain.User;
import com.example.mountapp.dto.JoinRequestDto;
import com.example.mountapp.dto.UserUpdateDTO;
import com.example.mountapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.UUID;

@Service
@RequiredArgsConstructor

public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    @Value("${file.upload-dir}")
    private String uploadDir;
    // 1. 회원가입
    public User join(JoinRequestDto dto) {
        // 중복 검사
        if (userRepository.findByUserid(dto.getUserid()).isPresent()) {
            throw new RuntimeException("이미 존재하는 아이디입니다.");
        }

        User user = new User();
        user.setUserid(dto.getUserid());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setBirthdate(dto.getBirthdate());
        user.setGender(dto.getGender());
        user.setNickname(dto.getNickname());
        return userRepository.save(user);
    }

    // 2. 로그인
    public String login(String userid, String password) {
        User user = userRepository.findByUserid(userid)
                .orElseThrow(() -> new RuntimeException("가입되지 않은 아이디입니다."));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }
        return jwtUtil.generateToken(userid);
    }

    // 3. 회원 탈퇴
    @Transactional
    public void deleteUser(String userid) {
        User user = userRepository.findByUserid(userid)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        userRepository.delete(user);
    }


    @Override
    public UserDetails loadUserByUsername(String userid) throws UsernameNotFoundException {
        User user = userRepository.findByUserid(userid)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + userid));


        return new org.springframework.security.core.userdetails.User(
                user.getUserid(),
                user.getPassword(),
                new ArrayList<>()
        );
    }
    public boolean existsByNickname(String nickname) {
        // 개수가 0보다 크면 true(존재함), 아니면 false
        return userRepository.countByNickname(nickname) > 0;
    }
    public User getUserInfo(String userid) {
        return userRepository.findByUserid(userid)
                .orElseThrow(() -> new RuntimeException("유저 정보가 없습니다."));
    }
    @Transactional
    public User updateProfile(String userid, UserUpdateDTO dto, MultipartFile file) {
        User user = userRepository.findByUserid(userid)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // 1. 텍스트 정보 업데이트
        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getBirthdate() != null) user.setBirthdate(dto.getBirthdate());
        if (dto.getGender() != null) user.setGender(dto.getGender());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        if (dto.getEmail() != null) user.setEmail(dto.getEmail());

        // 2. 이미지 파일 처리
        if (file != null && !file.isEmpty()) {
            try {
                // 실제 저장될 폴더 객체 생성
                File dir = new File(uploadDir);
                if (!dir.exists()) {
                    dir.mkdirs(); // 폴더가 없으면 생성
                }

                // 파일명 중복 방지 (UUID 사용)
                String originalFilename = file.getOriginalFilename();
                String savedFilename = UUID.randomUUID().toString() + "_" + originalFilename;

                // 실제 경로에 파일 저장
                // uploadDir + File.separator + savedFilename
                File saveFile = new File(dir, savedFilename);
                file.transferTo(saveFile);

                // DB에는 웹 접근용 URL 저장 ("/images/" 경로 매핑 사용)
                user.setProfileImage("/images/" + savedFilename);

            } catch (IOException e) {
                throw new RuntimeException("이미지 업로드 실패: " + e.getMessage());
            }
        }

        return user;
    }

    public boolean existsByUserid(String userid) {
        return userRepository.countByUserid(userid) > 0;
    }
}