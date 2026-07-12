package com.transitops;

import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import static org.junit.jupiter.api.Assertions.assertTrue;

class TransitOpsApplicationTest {

    @Test
    void applicationClassIsAnnotatedWithSpringBootApplication() throws ClassNotFoundException {
        Class<?> applicationClass = Class.forName("com.transitops.TransitOpsApplication");
        SpringBootApplication annotation = applicationClass.getAnnotation(SpringBootApplication.class);

        assertTrue(annotation != null, "TransitOpsApplication should be annotated with @SpringBootApplication");
    }

    @Test
    void mainMethodExists() throws ClassNotFoundException, NoSuchMethodException {
        Class<?> applicationClass = Class.forName("com.transitops.TransitOpsApplication");
        applicationClass.getDeclaredMethod("main", String[].class);
    }
}
