package com.example.mountapp;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class UserIdController {
    @GetMapping("dbapi/userid")
    public String userId(){
        return "유성렬";
    }
}
