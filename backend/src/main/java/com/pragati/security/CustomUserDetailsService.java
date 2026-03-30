package com.pragati.security;

import com.pragati.entity.Officer;
import com.pragati.entity.User;
import com.pragati.repository.OfficerRepository;
import com.pragati.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final OfficerRepository officerRepository;

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        // 1. Try finding as Officer (Identifier can be email)
        Optional<Officer> officer = officerRepository.findByEmail(identifier);
        if (officer.isPresent()) {
            return new org.springframework.security.core.userdetails.User(
                    officer.get().getEmail(),
                    officer.get().getPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + officer.get().getRole().name()))
            );
        }

        // 2. Try finding as Villager (Identifier can be mobile)
        Optional<User> user = userRepository.findByMobileNumber(identifier);
        if (user.isPresent()) {
           return new org.springframework.security.core.userdetails.User(
                   user.get().getMobileNumber(),
                   user.get().getPassword(),
                   Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.get().getRole().name()))
           );
        }

        throw new UsernameNotFoundException("User not found with identifier: " + identifier);
    }
}
