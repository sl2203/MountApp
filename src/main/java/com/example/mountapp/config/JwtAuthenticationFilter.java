package com.example.mountapp.config;

import com.example.mountapp.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserService userService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. 헤더에서 Authorization 키 값 가져오기
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        // 2. 토큰이 없거나 "Bearer "로 시작하지 않으면 통과 (비로그인 요청)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. "Bearer " 이후의 토큰 값만 추출
        jwt = authHeader.substring(7);
        username = jwtUtil.extractUsername(jwt); // 토큰에서 아이디 꺼내기

        // 4. 아이디가 있고, 현재 인증되지 않은 상태라면 인증 처리 시도
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userService.loadUserByUsername(username);

            // 5. 토큰이 유효하다면 인증 객체(Authentication) 생성 후 저장
            if (jwtUtil.validateToken(jwt, userDetails.getUsername())) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // [핵심] Spring Security에게 "이 사람 로그인 됐어!"라고 알려줌
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // 6. 다음 필터로 넘기기
        filterChain.doFilter(request, response);
    }
}