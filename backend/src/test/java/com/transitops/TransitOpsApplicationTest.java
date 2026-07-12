package com.transitops;

import org.junit.jupiter.api.Test;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import static org.junit.jupiter.api.Assertions.assertTrue;

class TransitOpsApplicationTest {

    @Test
    void applicationClassIsAnnotatedWithSpringBootApplication() {
        SpringBootApplication annotation = TransitOpsApplication.class.getAnnotation(SpringBootApplication.class);

        assertTrue(annotation != null, "TransitOpsApplication should be annotated with @SpringBootApplication");
    }

    @Test
    void mainMethodExists() throws NoSuchMethodException {
        TransitOpsApplication.class.getDeclaredMethod("main", String[].class);
    }
}
