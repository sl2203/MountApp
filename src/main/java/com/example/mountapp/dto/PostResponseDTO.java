    package com.example.mountapp.dto;

    import com.example.mountapp.domain.Post_Review;
    import lombok.Getter;
    import lombok.Setter;

    @Setter
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
        private String postdate;
        private int likeCount; // 총 좋아요 수
        private boolean liked;


        public PostResponseDTO(Post_Review entity) {
            this.id = entity.getPostid();
            this.title = entity.getTitle();
            this.comment = entity.getPostcontents();

            if (entity.getUser() != null) {
                this.author = entity.getUser().getNickname();
                this.nickname = entity.getUser().getNickname();
            } else {
                this.author = "알 수 없음";
                this.nickname = "알 수 없음";
            }

            this.rating = entity.getRating();
            this.category = entity.getCategory();
            this.imagePath = entity.getImagePath();
            this.postdate = entity.getPostdate();
        }


    }