package com.careeros.backend.repository;

import com.careeros.backend.model.CareerProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CareerProgressRepository
        extends JpaRepository<CareerProgress, Long> {

    List<CareerProgress> findByUserId(Long userId);
}