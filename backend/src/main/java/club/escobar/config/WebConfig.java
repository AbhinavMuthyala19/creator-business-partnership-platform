package club.escobar.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;

@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties(StorageProperties.class)
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final StorageProperties storageProperties;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String location = Path.of(storageProperties.uploadDir()).toUri().toString();
        registry.addResourceHandler(storageProperties.baseUrl() + "/**")
                .addResourceLocations(location);
    }
}
