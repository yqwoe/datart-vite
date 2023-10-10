package datart.server.config;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.task.DelegatingSecurityContextAsyncTaskExecutor;

import java.util.concurrent.Executor;
import java.util.concurrent.ThreadPoolExecutor;

@Configuration
public class ThreadPoolConfig implements AsyncConfigurer {

    /**
     * 获取cpu数量
     */
    private static final int CPU_COUNT = Runtime.getRuntime().availableProcessors();
    private static final int POOL_SIZE = CPU_COUNT * 2;
    private static final int MAX_POOL_SIZE = CPU_COUNT * 4;


    @Override
    public Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor threadPoolTaskExecutor = new ThreadPoolTaskExecutor();
        threadPoolTaskExecutor.setCorePoolSize(POOL_SIZE);
        threadPoolTaskExecutor.setMaxPoolSize(MAX_POOL_SIZE);
        threadPoolTaskExecutor.setQueueCapacity(MAX_POOL_SIZE * 4);
        threadPoolTaskExecutor.setThreadNamePrefix("code-web-thread-->");
        // 设置任务的拒绝策略
        threadPoolTaskExecutor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        threadPoolTaskExecutor.initialize();
        return new DelegatingSecurityContextAsyncTaskExecutor(threadPoolTaskExecutor);
    }

    /***
     * 使用@Async 可以获取security context
     * @return
     */
    @Bean
    public InitializingBean initializingBean(){
        return () -> SecurityContextHolder.setStrategyName(SecurityContextHolder.MODE_INHERITABLETHREADLOCAL);
    }
}
