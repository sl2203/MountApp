package com.example.mountapp.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir}") // application.properties의 경로 (예: C:/mountapp/uploads)
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // [핵심] Paths.get().toUri()를 사용하면 'file:///'와 슬래시 처리를 자동으로 완벽하게 해줍니다.
        String resourceLocation = Paths.get(uploadDir).toUri().toString();

        registry.addResourceHandler("/images/**","/uploads/**")
                .addResourceLocations(resourceLocation);
    }
}