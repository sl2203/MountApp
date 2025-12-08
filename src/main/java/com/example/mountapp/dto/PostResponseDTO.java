package com.example.mountapp.dto;

import com.example.mountapp.domain.Post_Review;
import lombok.Getter;

@Getter
public class PostResponseDTO {
    private Long id;
    private String title;
    private String comment; // React 코드의 'comment' 필드와 매칭하기 위해 이름 변경
    private String author;
    private double rating;
    private String nickname;
    private String category;



    public PostResponseDTO(Post_Review entity) {
        this.id = entity.getPostid();
        this.title = entity.getTitle();
        this.comment = entity.getPostcontents(); // DB의 contents를 comment로 매핑
        if (entity.getUser() != null) {
            this.author = entity.getUser().getNickname(); // 이제 author에 'admin' 대신 '멋쟁이'가 들어감
            this.nickname = entity.getUser().getNickname();
        } else {
            this.author = "알 수 없음";
        }

        this.rating = entity.getRating();
        this.category = entity.getCategory();
        this.rating = entity.getRating();
        this.category = entity.getCategory();


    }
}