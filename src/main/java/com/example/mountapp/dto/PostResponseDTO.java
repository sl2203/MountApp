package com.example.mountapp.dto;

import com.example.mountapp.domain.Post_Review;
import lombok.Getter;

@Getter
public class PostResponseDTO {
    private Long id;
    private String title;
    private String comment;
    private String author;
    private double rating;
    private String nickname;
    private String category;
    private String imagePath;

    // ▼▼▼ 1. 날짜 필드 추가 ▼▼▼
    private String postdate;

    public PostResponseDTO(Post_Review entity) {
        this.id = entity.getPostid();
        this.title = entity.getTitle();
        this.comment = entity.getPostcontents();

        if (entity.getUser() != null) {
            this.author = entity.getUser().getNickname();
            this.nickname = entity.getUser().getNickname();
        } else {
            this.author = "알 수 없음";
            this.nickname = "알 수 없음"; // Null 방지
        }

        this.rating = entity.getRating();
        this.category = entity.getCategory();
        this.imagePath = entity.getImagePath();

        // ▼▼▼ 2. Entity에서 날짜를 꺼내서 DTO에 담기 ▼▼▼
        this.postdate = entity.getPostdate();

        // (참고: 아까 코드에 rating과 category 대입이 두 번씩 있어서 하나는 지웠습니다!)
    }
}