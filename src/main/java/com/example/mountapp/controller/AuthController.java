package com.example.mountapp.controller;

import com.example.mountapp.domain.User; // User 도메인 import 필요
import com.example.mountapp.dto.JoinRequestDto;
import com.example.mountapp.dto.UserUpdateDTO;
import com.example.mountapp.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    // ... (기존 회원가입, 로그인 코드는 그대로 유지) ...

    @PostMapping("/join")
    public ResponseEntity<String> join(@RequestBody JoinRequestDto joinRequestDto) {
        try {
            userService.join(joinRequestDto);
            return ResponseEntity.ok("회원가입이 성공적으로 완료되었습니다.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        try {
            String userid = loginData.get("userid");
            String password = loginData.get("password");
            String token = userService.login(userid, password);

            return ResponseEntity.ok(Map.of(
                    "message", "로그인 성공",
                    "token", token
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ▼▼▼ [추가된 부분] 내 정보 가져오기 API ▼▼▼
    @GetMapping("/me")
    public ResponseEntity<?> getMyInfo(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("로그인 정보가 유효하지 않습니다.");
        }

        // 1. 토큰에 담긴 userid로 유저 정보 조회
        User user = userService.getUserInfo(userDetails.getUsername());

        // 2. 보안상 비밀번호는 프론트로 보내지 않음 (null 처리)
        user.setPassword(null);

        // 3. 유저 객체 반환
        return ResponseEntity.ok(user);
    }
    // ▲▲▲ [추가된 부분 끝] ▲▲▲
    @PutMapping("/me")
    public ResponseEntity<?> updateMyProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestPart(value = "data") UserUpdateDTO dto, // JSON 데이터
            @RequestPart(value = "file", required = false) MultipartFile file // 이미지 파일 (선택)
    ) {
        try {
            if (userDetails == null) {
                return ResponseEntity.status(401).body("로그인이 필요합니다.");
            }

            User updatedUser = userService.updateProfile(userDetails.getUsername(), dto, file);

            // 보안상 비밀번호 제거 후 반환
            updatedUser.setPassword(null);

            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("수정 실패: " + e.getMessage());
        }
    }
    @DeleteMapping("/withdraw")
    public ResponseEntity<?> withdraw(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }
        String username = userDetails.getUsername();
        userService.deleteUser(username);
        return ResponseEntity.ok("회원 탈퇴 성공");
    }

    @GetMapping("/check-nickname")
    public ResponseEntity<Boolean> checkNickname(@RequestParam String nickname) {
        boolean isExist = userService.existsByNickname(nickname);
        return ResponseEntity.ok(!isExist);
    }

    @GetMapping("/check-userid")
    public ResponseEntity<Boolean> checkUserid(@RequestParam String userid) {
        boolean isExist = userService.existsByUserid(userid);
        return ResponseEntity.ok(!isExist);
    }
}