package datart;

import cn.hutool.poi.excel.ExcelReader;
import cn.hutool.poi.excel.ExcelUtil;
import datart.server.service.ExternalRegisterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.*;


//@Component
public class InitSSOUserRunner implements ApplicationRunner {



    @Autowired
    ExternalRegisterService externalRegisterService;


    @Override
    public void run(ApplicationArguments args) throws Exception {
        importSSOUser();
    }


    public void importSSOUser() throws Exception{

        ExcelReader reader = ExcelUtil.getReader("/Users/yqwoe/国立/账号.xlsx");
        List<Map<String,Object>> readAll = reader.readAll();
        for (Map map: readAll){
            String username = map.get("username").toString();
            String role = map.get("role").toString();
            String password = map.get("password").toString();

            Map<String,Object> attrs = new HashMap<>();
            LinkedHashMap<String,String> roleMap = new LinkedHashMap<>();
            roleMap.put("name",role);
            attrs.put("roles", Arrays.asList(roleMap));
            attrs.put("name", username);
            OAuth2User user = new DefaultOAuth2User(null,attrs,"name");
            OAuth2AuthenticationToken authToken = new OAuth2AuthenticationToken(user,null,"cas");
            externalRegisterService.oauth2Register(authToken);
        }

//        OAuth2User user = new DefaultOAuth2User();
//
//        OAuth2AuthenticationToken authToken = new OAuth2AuthenticationToken();
//        externalRegisterService.oauth2Register();
    }
}
