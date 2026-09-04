package com.careeros.backend.service;

import com.careeros.backend.model.User;
import com.careeros.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public User updateUser(Long id, User user) {
        User existingUser = userRepository.findById(id).orElse(null);

        if (existingUser == null) {
            return null;
        }

        existingUser.setName(user.getName());
        existingUser.setCollege(user.getCollege());
        existingUser.setDegree(user.getDegree());
        existingUser.setGraduationYear(user.getGraduationYear());
        existingUser.setTargetRole(user.getTargetRole());
        existingUser.setSkills(user.getSkills());
        existingUser.setGithub(user.getGithub());
        existingUser.setLinkedin(user.getLinkedin());

        return userRepository.save(existingUser);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}