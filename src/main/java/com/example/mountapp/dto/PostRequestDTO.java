package com.example.mountapp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostRequestDTO {
    private String title;
    private String content;  // React의 content 상태와 매칭
    private Double rating;
    private String category;
}