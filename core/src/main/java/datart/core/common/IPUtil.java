package datart.core.common;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import java.net.InetAddress;
import java.net.UnknownHostException;

@Component
public class IPUtil {
    private static final Logger log = LoggerFactory.getLogger(IPUtil.class);
    private static final String UNKNOWN = "unknown";
    private static final String IPV6_LOCAL = "0:0:0:0:0:0:0:1";

    private static int serverPort;

    @Value("${server.port}")
    private int port;

    @PostConstruct
    private void setServerPort(){
        IPUtil.serverPort = port;
    }

    /**
     * 获取IP地址
     * @param request
     * @return  String
     *
     */
    public static String getIpAddr(HttpServletRequest request)
    {
        String ip = request.getHeader("X-Real-IP");
        if(!StringUtils.isEmpty(ip) && !UNKNOWN.equalsIgnoreCase(ip)) {
            return ip;
        }
        ip = request.getHeader("X-Forwarded-For");
        if(ip == null || ip.length() == 0 || UNKNOWN.equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if(ip == null || ip.length() == 0 || UNKNOWN.equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if(ip == null || ip.length() == 0 || UNKNOWN.equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if(ip == null || ip.length() == 0 || UNKNOWN.equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if(ip == null || ip.length() == 0 || UNKNOWN.equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        if (IPV6_LOCAL.equals(ip)){
            ip = getLocalhostIp();
        }
        return ip;
    }
    /**
     * 获取本地ip地址
     *
     * @return
     */
    public static String getLocalhostIp(){
        try {
            return String.format("http://%s:%s",InetAddress.getLocalHost().getHostAddress(),IPUtil.serverPort);
        } catch (UnknownHostException e) {
            log.error("获取ip异常：",e);
        }
        return null;
    }
}
