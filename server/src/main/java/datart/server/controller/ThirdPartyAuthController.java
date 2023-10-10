package datart.server.controller;

import datart.core.base.annotations.SkipLogin;
import datart.server.base.dto.ResponseData;
import datart.server.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestRedirectFilter;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

@Api
@Slf4j
@RestController
@RequestMapping(value = "/tpa")
public class ThirdPartyAuthController extends BaseController {

    private final UserService userService;

    public ThirdPartyAuthController(UserService userService) {
        this.userService = userService;
    }

    private ClientRegistrationRepository clientRegistrationRepository;

    private OAuth2AuthorizationRequest authorizationRequest;

    @Value("${spring.security.oauth2.enable:false}")
    private boolean enable;


    @ApiOperation(value = "Get Oauth2 clents")
    @GetMapping(value = "getOauth2Clients", consumes = MediaType.ALL_VALUE, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    @SkipLogin
    public ResponseData<List<HashMap<String, String>>> getOauth2Clients(HttpServletRequest request) {
        if(enable){
            if (clientRegistrationRepository == null) {
                return ResponseData.success(Collections.emptyList());
            }
            Iterable<ClientRegistration> clientRegistrations = (Iterable<ClientRegistration>) clientRegistrationRepository;
            List<HashMap<String, String>> clients = new ArrayList<>();
            clientRegistrations.forEach(registration -> {
                HashMap<String, String> map = new HashMap<>();
                map.put(registration.getClientName(), OAuth2AuthorizationRequestRedirectFilter.DEFAULT_AUTHORIZATION_REQUEST_BASE_URI + "/" + registration.getRegistrationId() + "?redirect_url=/");
                clients.add(map);
            });

            return ResponseData.success(clients);
        }

        return ResponseData.success(Arrays.asList());
    }

    @Autowired(required = false)
    public void setClientRegistrationRepository(ClientRegistrationRepository clientRegistrationRepository) {
        this.clientRegistrationRepository = clientRegistrationRepository;
    }


    @Autowired(required = false)
    public void setAuthorizationRequest(OAuth2AuthorizationRequest authorizationRequest) {
        this.authorizationRequest = authorizationRequest;
    }
}
