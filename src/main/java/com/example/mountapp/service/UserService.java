package com.example.mountapp.service;

import com.example.mountapp.config.JwtUtil;
import com.example.mountapp.domain.User;
import com.example.mountapp.dto.JoinRequestDto;
import com.example.mountapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor

public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

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
}