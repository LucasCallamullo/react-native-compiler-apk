package com.vg;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import com.vg.auth.config.JwtProperties;

@SpringBootApplication
@EnableConfigurationProperties(JwtProperties.class)
public class MsCoreApplication {

    public static void main(String[] args) {
        SpringApplication.run(MsCoreApplication.class, args);
    }

}