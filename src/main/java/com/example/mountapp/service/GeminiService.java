package com.example.mountapp.service; // 패키지명은 본인 프로젝트에 맞게 수정

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

@Slf4j // 로깅 라이브러리 (Lombok)
@Service
public class GeminiService {

    private final ChatClient chatClient;

    public GeminiService(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    public String getResponse(String message) {
        try {
            log.info("============== [Gemini 요청 시작] ==============");
            log.info("입력된 프롬프트: {}", message);

            // 실제 API 호출
            String response = chatClient.prompt()
                    .user(message)
                    .call()
                    .content();

            log.info("Gemini 응답: {}", response);
            log.info("============== [Gemini 요청 종료] ==============");

            return response;

        } catch (Exception e) {
            log.error("Gemini API 호출 중 에러 발생: ", e);
            return "에러가 발생했습니다: " + e.getMessage();
        }
    }
}