package com.example.mountapp.controller;

import com.example.mountapp.service.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/gemini")
@RequiredArgsConstructor
public class ChatController {

    private final GeminiService geminiService;

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> request) {

        String message = request.get("message");

        if (message == null || message.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "메시지를 입력해주세요."));
        }

        String generatedText = geminiService.getResponse(message);

        return ResponseEntity.ok(Map.of("result", generatedText));
    }
}