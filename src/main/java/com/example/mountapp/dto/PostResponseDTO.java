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
    private String category;

    public PostResponseDTO(Post_Review entity) {
        this.id = entity.getPostid();
        this.title = entity.getTitle();
        this.comment = entity.getPostcontents(); // DB의 contents를 comment로 매핑
        this.author = entity.getUserid();
        this.rating = entity.getRating();
        this.category = entity.getCategory();


    }
}