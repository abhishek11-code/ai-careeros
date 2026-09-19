package com.careeros.backend.controller;

import com.careeros.backend.model.CareerProgress;
import com.careeros.backend.service.CareerProgressService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
@CrossOrigin(origins = "http://localhost:5173")
public class CareerProgressController {

    private final CareerProgressService careerProgressService;

    public CareerProgressController(CareerProgressService careerProgressService) {
        this.careerProgressService = careerProgressService;
    }

    @GetMapping("/{userId}")
    public List<CareerProgress> getProgress(@PathVariable Long userId) {
        return careerProgressService.getProgressByUserId(userId);
    }

    @PostMapping
    public CareerProgress createProgress(@RequestBody CareerProgress progress) {
        return careerProgressService.createProgress(progress);
    }

    @PutMapping("/{id}")
    public CareerProgress updateProgress(
            @PathVariable Long id,
            @RequestBody CareerProgress progress) {

        return careerProgressService.updateProgress(id, progress);
    }

    @DeleteMapping("/{id}")
    public void deleteProgress(@PathVariable Long id) {
        careerProgressService.deleteProgress(id);
    }
}
