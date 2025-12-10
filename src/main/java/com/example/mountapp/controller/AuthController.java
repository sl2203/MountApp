package com.example.mountapp.controller;

import com.example.mountapp.dto.JoinRequestDto;
import com.example.mountapp.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import java.util.Map;

@RestController
@RequestMapping("/api/auth") // 이 클래스의 모든 API는 /api/auth로 시작
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;


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

            // 서비스에게 검사 맡기고 토큰 받아오기
            String token = userService.login(userid, password);

            // 성공하면 토큰을 JSON으로 응답
            return ResponseEntity.ok(Map.of(
                    "message", "로그인 성공",
                    "token", token
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
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
        // DB에 존재하면 true, 없으면 false를 반환하는 서비스 로직
        boolean isExist = userService.existsByNickname(nickname);

        // 프론트 로직상 "사용 가능"이 true여야 하므로, 존재하지 않아야(!isExist) true 반환
        return ResponseEntity.ok(!isExist);
    }

    @GetMapping("/check-userid")
    public ResponseEntity<Boolean> checkUserid(@RequestParam String userid) {
        boolean isExist = userService.existsByUserid(userid);

        // 존재하지 않아야 사용 가능
        return ResponseEntity.ok(!isExist);
    }
}