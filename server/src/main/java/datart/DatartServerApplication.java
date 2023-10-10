package datart;

import datart.core.common.ClassTransformer;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.web.client.RestTemplate;


@SpringBootApplication(scanBasePackages = { "datart" })
@EnableCaching
@EnableAsync
public class DatartServerApplication {

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    public static void main(String[] args) {
        ClassTransformer.transform();
        SpringApplication.run(DatartServerApplication.class, args);
    }
}
