package com.careeros.backend.controller;

import com.careeros.backend.model.User;
import com.careeros.backend.service.AIService;
import com.careeros.backend.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class AIController {

    private final AIService aiService;
    private final UserService userService;

    public AIController(AIService aiService, UserService userService) {
        this.aiService = aiService;
        this.userService = userService;
    }

    @PostMapping("/roadmap/{userId}")
    public String generateRoadmap(@PathVariable Long userId) {

        User user = userService.getUserById(userId);

        if (user == null) {
            return "User not found";
        }

        return aiService.generateRoadmap(
                user.getName(),
                user.getTargetRole(),
                user.getSkills(),
                user.getDegree(),
                user.getGraduationYear()
        );
    }

    @PostMapping("/chat/{userId}")
    public String chat(
            @PathVariable Long userId,
            @RequestBody String question) {

        User user = userService.getUserById(userId);

        if (user == null) {
            return "User not found";
        }

        return aiService.chat(
                user.getName(),
                user.getTargetRole(),
                user.getSkills(),
                user.getDegree(),
                user.getGraduationYear(),
                question
        );
    }
}
