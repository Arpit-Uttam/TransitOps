package com.transitops.config;

import com.transitops.auth.Role;
import com.transitops.auth.User;
import com.transitops.auth.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByEmail("fleet.mgr@transitops.com")) {
            User manager = User.builder()
                    .email("fleet.mgr@transitops.com")
                    .password(passwordEncoder.encode("Password123"))
                    .firstName("Admin")
                    .lastName("Manager")
                    .role(Role.ROLE_FLEET_MANAGER)
                    .build();
            userRepository.save(manager);
        }

        if (!userRepository.existsByEmail("driver.alex@transitops.com")) {
            User driver = User.builder()
                    .email("driver.alex@transitops.com")
                    .password(passwordEncoder.encode("Password123"))
                    .firstName("Alex")
                    .lastName("Driver")
                    .role(Role.ROLE_DRIVER)
                    .build();
            userRepository.save(driver);
        }

        if (!userRepository.existsByEmail("safety.off@transitops.com")) {
            User safety = User.builder()
                    .email("safety.off@transitops.com")
                    .password(passwordEncoder.encode("Password123"))
                    .firstName("Sarah")
                    .lastName("Safety")
                    .role(Role.ROLE_SAFETY_OFFICER)
                    .build();
            userRepository.save(safety);
        }

        if (!userRepository.existsByEmail("fin.analyst@transitops.com")) {
            User financial = User.builder()
                    .email("fin.analyst@transitops.com")
                    .password(passwordEncoder.encode("Password123"))
                    .firstName("Fred")
                    .lastName("Finance")
                    .role(Role.ROLE_FINANCIAL_ANALYST)
                    .build();
            userRepository.save(financial);
        }

        System.out.println(">> TransitOps Seeder: Initial user profiles seeded successfully.");
    }
}
