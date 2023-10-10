/*
 * Datart
 * <p>
 * Copyright 2021
 * <p>
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * <p>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package datart.server.job;

import datart.core.common.Application;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Slf4j
public class DingtalkJob extends ScheduleJob {

    @Override
    public void doSend() {

        if (CollectionUtils.isEmpty(shareUrls) ) {
            return;
        }

        String webHookUrl = jobConfig.getWebHookUrl();

        RestTemplate restTemplate = Application.getBean(RestTemplate.class);

        for (String url : shareUrls) {
            try {
                ResponseEntity<Object> resp = restTemplate.postForEntity(webHookUrl, createParam(url), Object.class);
                log.debug("ding talk message is {}",resp.toString());
            } catch (Exception e) {
                log.error("ding talk send error", e);
            }
        }

    }

    private Map<String, Object> createParam(String url) throws Exception {
        HashMap<String, Object> param = new HashMap<>();
        param.put("msgtype", "actionCard");
        HashMap<String, String> image = new HashMap<>();
        image.put("title", schedule.getName());
        image.put("text", "![screenshot]("+Application.getWebRootURL()+"/images/hook-bg.png)" +
                "\n\n ### "+schedule.getName()+"报表"+
                "\n\n > 点击查看按钮进行查看"
        );
        image.put("btnOrientation", "0");
        image.put("singleTitle", "查看");
        image.put("singleURL", url);
        param.put("actionCard", image);
        HashMap<String, Object> at = new HashMap<>();
        at.put("atMobiles", Arrays.asList());
        at.put("isAtAll", true);
        param.put("at", at);
        return param;
    }
}
