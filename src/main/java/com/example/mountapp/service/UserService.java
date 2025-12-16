package com.example.mountapp.service;

import com.example.mountapp.config.JwtUtil;
import com.example.mountapp.domain.User;
import com.example.mountapp.dto.JoinRequestDto;
import com.example.mountapp.dto.UserUpdateDTO; // ★ 추가됨: DTO import 확인하세요
import com.example.mountapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile; // ★ 추가됨: 파일 업로드용

import java.util.ArrayList;
import java.util.Collection;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    // private final FileService fileService; // ★ 만약 파일 저장 서비스가 따로 있다면 주석 해제

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
    public User updateProfile(String userid, UserUpdateDTO dto, MultipartFile file) {
        User user = userRepository.findByUserid(userid)
                .orElseThrow(() -> new RuntimeException("사용자 정보를 찾을 수 없습니다."));

        // (1) 텍스트 정보 수정 (DTO에 있는 필드만 수정)
        if (dto.getNickname() != null) user.setNickname(dto.getNickname());
        if (dto.getEmail() != null) user.setEmail(dto.getEmail());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        // 비밀번호 변경이 필요한 경우 로직 추가 가능

        // (2) 파일 업로드 처리
        // ★ 주의: 실제 파일 저장 로직은 프로젝트 환경(S3, 로컬 등)에 맞춰 구현해야 합니다.
        if (file != null && !file.isEmpty()) {
            // 예시: String imageUrl = fileService.upload(file);
            // user.setProfileImage(imageUrl);
            System.out.println("프로필 이미지 파일이 감지되었습니다: " + file.getOriginalFilename());
        }

        return user; // 변경 감지(Dirty Checking)에 의해 자동 저장됨
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