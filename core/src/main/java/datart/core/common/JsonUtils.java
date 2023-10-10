package datart.core.common;


import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Map;

@Slf4j
public class JsonUtils {

    private final static ObjectMapper mapper;

    static {
        mapper = new ObjectMapper();
        mapper.setDateFormat(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS"));
        mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
    }

    public static <T> T toObject(String json,Class clz){
        try {
            return  (T) mapper.readValue(json,clz);
        }catch (IOException e){
            log.error(e.getMessage());
        }
        return null;
    }

    public static <T> T toArray(String json,Class clz){
        try {
            return  (T) mapper.readValue(json,mapper.getTypeFactory().constructParametricType(List.class,clz));
        }catch (IOException e){
            log.error(e.getMessage());
        }
        return null;
    }

    public static <T> T toArray(Object o,Class clz){
        try {
            return  (T) mapper.readValue(toJSON(o),mapper.getTypeFactory().constructParametricType(List.class,clz));
        }catch (IOException e){
            log.error(e.getMessage());
        }
        return null;
    }

    public static <T> T toArray(InputStream json,Class clz){
        try {
            return  (T) mapper.readValue(json,mapper.getTypeFactory().constructParametricType(List.class,clz));
        }catch (IOException e){
            log.error(e.getMessage());
        }
        return null;
    }

    public static <T> T toObject(InputStream json, Class clz){
        try {
            return  (T) mapper.readValue(json,clz);
        }catch (IOException e){

        }
        return null;
    }

    public static <T> String toJSON(T obj){
        try {
            return  mapper.writeValueAsString(obj);
        }catch (IOException e){

        }
        return null;
    }

    /**
     * Json、Json数组转Map
     *
     * @param json
     * @param kClass
     * @param vClass
     * @param <K>
     * @param <V>
     * @return
     */
    public static <K, V> Map<K, V> parseMap(String json, Class<K> kClass, Class<V> vClass) {
        try {
            return mapper.readValue(json, mapper.getTypeFactory().constructMapType(Map.class, kClass, vClass));
        } catch (IOException e) {
            log.error("json解析出错：" + json, e);
        }
        return null;
    }
}
