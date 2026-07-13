package club.escobar;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class EscobarClubApplication {

    public static void main(String[] args) {
        SpringApplication.run(EscobarClubApplication.class, args);
    }
}
