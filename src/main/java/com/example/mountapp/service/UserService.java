package com.example.mountapp.service;

import com.example.mountapp.config.JwtUtil;
import com.example.mountapp.domain.User;
import com.example.mountapp.dto.JoinRequestDto;
import com.example.mountapp.dto.UserUpdateDTO; // ★ 추가됨: DTO import 확인하세요
import com.example.mountapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile; // ★ 추가됨: 파일 업로드용

import java.io.File;
import java.util.ArrayList;
import java.util.Collection;
import java.util.UUID;
import java.io.IOException;
@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    // private final FileService fileService; // ★ 만약 파일 저장 서비스가 따로 있다면 주석 해제
    @Value("${file.upload-dir}")
    private String uploadDir;
    // 1. 회원가입 (동료분 코드)
    public User join(JoinRequestDto dto) {
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

        // user.setAdmin("N"); // 필요 시 주석 해제

        return userRepository.save(user);
    }

    // 2. 로그인 (동료분 코드)
    public String login(String userid, String password) {
        User user = userRepository.findByUserid(userid)
                .orElseThrow(() -> new RuntimeException("가입되지 않은 아이디입니다."));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }
        return jwtUtil.generateToken(userid);
    }

    // 3. 회원 탈퇴 (동료분 코드)
    @Transactional
    public void deleteUser(String userid) {
        User user = userRepository.findByUserid(userid)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        userRepository.delete(user);
    }

    // 4. 시큐리티 로그인 처리 (동료분 코드)
    @Override
    public UserDetails loadUserByUsername(String userid) throws UsernameNotFoundException {
        System.out.println("=== [로그인 시도] ID: " + userid + " ===");

        User user = userRepository.findByUserid(userid)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + userid));

        Collection<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));

        System.out.println("=== [DB admin 값] : " + user.getAdmin() + " ===");

        if ("Y".equals(user.getAdmin())) {
            System.out.println("=== [관리자 권한 부여됨] ===");
            authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
        }

        return new org.springframework.security.core.userdetails.User(
                user.getUserid(),
                user.getPassword(),
                authorities
        );
    }

    // ▼▼▼ [추가된 부분] 님 코드를 위해 필요한 메서드들 ▼▼▼

    // 5. 내 정보 조회 (AuthController의 /me에서 사용)
    public User getUserInfo(String userid) {
        return userRepository.findByUserid(userid)
                .orElseThrow(() -> new RuntimeException("사용자 정보를 찾을 수 없습니다."));
    }

    // 6. 프로필 수정 (AuthController의 put /me에서 사용)
    @Transactional
    public User updateProfile(String userid, UserUpdateDTO dto, MultipartFile file) throws IOException { // ★ 여기 throws IOException 추가!
        User user = userRepository.findByUserid(userid)
                .orElseThrow(() -> new RuntimeException("사용자 정보를 찾을 수 없습니다."));

        // (1) 텍스트 정보 수정
        if (dto.getNickname() != null) user.setNickname(dto.getNickname());
        if (dto.getEmail() != null) user.setEmail(dto.getEmail());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getBirthdate() != null) user.setBirthdate(dto.getBirthdate());
        if (dto.getGender() != null) user.setGender(dto.getGender());

        // (2) 파일 업로드 처리
        if (file != null && !file.isEmpty()) {
            File saveFolder = new File(uploadDir);
            if (!saveFolder.exists()) {
                saveFolder.mkdirs();
            }

            String uuid = UUID.randomUUID().toString();
            String fileName = uuid + "_" + file.getOriginalFilename();
            File saveFile = new File(saveFolder, fileName);

            // ★ 이제 throws IOException이 있어서 여기서 에러가 안 납니다.
            file.transferTo(saveFile);

            user.setProfileImage("/uploads/" + fileName);
            System.out.println("이미지 저장 경로: " + saveFile.getAbsolutePath());
        }

        return user;
    }
    // ▲▲▲ [추가 완료] ▲▲▲

    // 7. 중복 체크 (동료분 코드)
    public boolean existsByNickname(String nickname) {
        return userRepository.countByNickname(nickname) > 0;
    }

    public boolean existsByUserid(String userid) {
        return userRepository.countByUserid(userid) > 0;
    }
}