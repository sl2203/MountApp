package com.example.mountapp.dto;

import com.example.mountapp.domain.Mountain;
import com.example.mountapp.domain.Trail;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
public class MountainDetailDTO {
    private Long id;
    private String name;
    private Integer height;
    private String location;
    private String difficulty;
    private String description;
    private String imageUrl;
    private String notices;
    private List<TrailDTO> trails; // 구조화된 코스 리스트

    public MountainDetailDTO(Mountain m) {
        this.id = m.getId();
        this.name = m.getName();
        this.height = m.getHeight();
        this.location = m.getLocation();
        this.difficulty = m.getDifficulty();
        this.description = m.getDescription();
        this.imageUrl = m.getImageUrl();
        this.notices = m.getNotices();
        // Trail 엔티티 -> DTO 변환
        this.trails = m.getTrails().stream().map(TrailDTO::new).collect(Collectors.toList());
    }

    @Data
    public static class TrailDTO {
        private String name;
        private String description;
        private String difficulty;
        private String uptime;
        private String distance;
        private boolean isPopular;

        public TrailDTO(Trail t) {
            this.name = t.getName();
            this.description = t.getDescription();
            this.difficulty = t.getDifficulty();
            this.uptime = t.getUptime();
            this.distance = t.getDistance();
            this.isPopular = t.isPopular();
        }
    }
}