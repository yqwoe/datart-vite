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

package datart.server.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.jayway.jsonpath.JsonPath;
import datart.core.base.exception.Exceptions;
import datart.core.base.exception.ParamException;
import datart.core.common.Application;
import datart.core.entity.Role;
import datart.core.entity.User;
import datart.core.mappers.ext.RoleMapperExt;
import datart.core.mappers.ext.UserMapperExt;
import datart.security.base.PasswordToken;
import datart.security.util.JwtUtils;
import datart.server.base.params.UserRegisterParam;
import datart.server.service.ExternalRegisterService;
import datart.server.service.OrgService;
import datart.server.service.RoleService;
import datart.server.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.query.LdapQueryBuilder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.mail.MessagingException;
import java.io.UnsupportedEncodingException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ExternalRegisterServiceImpl implements ExternalRegisterService {

    private LdapTemplate ldapTemplate;

    private final UserService userService;

    private final UserMapperExt userMapper;

    private final RoleService roleService;

    private final RoleMapperExt roleMapper;

    private final OrgService orgService;

    public ExternalRegisterServiceImpl(UserService userService,
                                       UserMapperExt userMapper,
                                       RoleService roleService,
                                       OrgService orgService,
                                       RoleMapperExt roleMapper
                                       ) {
        this.userService = userService;
        this.userMapper = userMapper;
        this.roleService = roleService;
        this.orgService = orgService;
        this.roleMapper = roleMapper;
    }

    @Autowired(required = false)
    private void setLdapTemplate(LdapTemplate template) {
        ldapTemplate = template;
    }

    @Override
    public String ldapRegister(String filter, String password) throws MessagingException, UnsupportedEncodingException {
        String usernameAttr = getLdapUsernameAttr();
        try {
            ldapTemplate.authenticate(LdapQueryBuilder.query().filter(String.format("(|(uid=%s)("+usernameAttr+"=%s))", filter, filter)), password);
        } catch (Exception e) {
            return null;
        }

        User user = userMapper.selectByNameOrEmail(filter);
        if (user != null) {
            PasswordToken passwordToken = new PasswordToken(user.getUsername(),
                    user.getPassword(),
                    System.currentTimeMillis());
            return JwtUtils.toJwtString(passwordToken);
        }

        String email = null;

        try {
            email = ldapTemplate.searchForContext(LdapQueryBuilder.query().where("uid").is(filter).or(usernameAttr).is(filter))
                    .getAttributes().get("mail").get().toString();
        } catch (Exception ignored) {
        }

        if (StringUtils.isBlank(email)) {
            Exceptions.tr(ParamException.class, "error.param.empty", "resource.user.email");
        }

        UserRegisterParam registerParam = new UserRegisterParam();
        registerParam.setUsername(filter);
        registerParam.setPassword(RandomStringUtils.randomAscii(32));
        registerParam.setEmail(email);

        if (userService.register(registerParam, false)) {
            PasswordToken passwordToken = new PasswordToken(registerParam.getUsername(),
                    registerParam.getPassword(),
                    System.currentTimeMillis());
            return userService.login(passwordToken);
        }
        return null;
    }

    @Override
    @Transactional
    public String oauth2Register(OAuth2AuthenticationToken oauthAuthToken) throws MessagingException, UnsupportedEncodingException {
        OAuth2User oauthUser = oauthAuthToken.getPrincipal();

        List<LinkedHashMap<String,String>> rolesMap = oauthUser.getAttribute("roles");

        if(null == rolesMap || rolesMap.isEmpty()){
            Exceptions.msg("认证失败，请联系管理员");
        }


        User user = userMapper.selectByNameOrEmail(oauthUser.getName());

        if (user != null) {
            PasswordToken passwordToken = new PasswordToken(user.getUsername(),
                    user.getPassword(),
                    System.currentTimeMillis());
            return JwtUtils.toJwtString(passwordToken);
        }




        String emailMapping = "name";//getProperty(String.format("spring.security.oauth2.client.provider.%s.userMapping.email", oauthAuthToken.getAuthorizedClientRegistrationId()));
        JSONObject jsonObj = new JSONObject(oauthUser.getAttributes());

        UserRegisterParam userRegisterParam = new UserRegisterParam();
        userRegisterParam.setUsername(oauthUser.getName());
        userRegisterParam.setName(oauthUser.getName());
        userRegisterParam.setPassword(RandomStringUtils.randomAscii(32));
        if (emailMapping != null) {
            userRegisterParam.setEmail(JsonPath.read(jsonObj, emailMapping));
        }
        if(null != oauthUser.getAttribute("phone")){
            userRegisterParam.setPhone(oauthUser.getAttribute("phone"));
        }
        userRegisterParam.setProvider(oauthAuthToken.getAuthorizedClientRegistrationId());

        if (userService.register(userRegisterParam, false)) {
            PasswordToken passwordToken = new PasswordToken(userRegisterParam.getUsername(),
                    userRegisterParam.getPassword(),
                    System.currentTimeMillis());
            String token = userService.login(passwordToken);

//        Role role = new Role();
//        BeanUtils.copyProperties(createParam, role);
//        role.setId(UUIDGenerator.generate());
//        role.setCreateBy(getCurrentUser().getId());
//        role.setCreateTime(new Date());
//        role.setType(RoleType.NORMAL.name());
//        roleMapper.insert(role);
            User currentUser = userService.getCurrentUser();

            String orgId = orgService.checkTeamOrg().getId();
            List<Role> roles = roleMapper.listByNames(rolesMap.stream().map(role->role.get("name")).collect(Collectors.toList()));

            if(null == roles || roles.isEmpty()){
                Exceptions.msg("用户角色为空,认证失败，请联系管理员");
            }
            roleService.updateRolesForUser(currentUser.getId(),orgId,roles.stream().map(Role::getId).collect(Collectors.toSet()),false);

            return token;

        }
        return null;

    }

    private String getLdapUsernameAttr() {
        return Application.getProperty("spring.ldap.attribute-mapping.username", "cn");
    }
}
