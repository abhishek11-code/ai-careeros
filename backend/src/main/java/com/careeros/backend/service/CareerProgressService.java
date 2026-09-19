package com.careeros.backend.service;

import com.careeros.backend.model.CareerProgress;
import com.careeros.backend.repository.CareerProgressRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CareerProgressService {

    private final CareerProgressRepository careerProgressRepository;

    public CareerProgressService(CareerProgressRepository careerProgressRepository) {
        this.careerProgressRepository = careerProgressRepository;
    }

    public List<CareerProgress> getProgressByUserId(Long userId) {
        return careerProgressRepository.findByUserId(userId);
    }

    public CareerProgress createProgress(CareerProgress progress) {
        return careerProgressRepository.save(progress);
    }

    public CareerProgress updateProgress(Long id, CareerProgress progress) {
        CareerProgress existing = careerProgressRepository
                .findById(id)
                .orElse(null);

        if (existing == null) {
            return null;
        }

        existing.setUserId(progress.getUserId());
        existing.setSkill(progress.getSkill());
        existing.setProgress(progress.getProgress());
        existing.setCompleted(progress.getCompleted());

        return careerProgressRepository.save(existing);
    }

    public void deleteProgress(Long id) {
        careerProgressRepository.deleteById(id);
    }
}
