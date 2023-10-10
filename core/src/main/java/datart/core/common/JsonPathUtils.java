package datart.core.common;


import datart.core.base.exception.BaseException;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.CharUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.builder.ToStringBuilder;

import java.io.*;
import java.util.*;

@Slf4j
public class JsonPathUtils {

    private Set<String> keyPath = new HashSet<>();

    private Object root = null;


    public static JsonPathUtils newDefault(){
        return JsonPathUtils.from("{}");
    }

    public static JsonPathUtils from(String json){
        json = StrUtil.replaceVariable(json);

        checkJSON(json);

        try {
            return new JsonPathUtils(json);
        } catch (Exception e) {
            throw new BaseException("config error",
                    e);
        }

    }

    public static JsonPathUtils from(Object obj){
        String json = JsonUtils.toJSON(obj);

        checkJSON(json);

        try {
            return new JsonPathUtils(json);
        } catch (Exception e) {
            throw new BaseException("config error",
                    e);
        }

    }

    public static JsonPathUtils from(File file){
        try {
            return JsonPathUtils.from(IOUtils
                    .toString(new FileInputStream(file)));
        } catch (FileNotFoundException e) {
            throw new BaseException("config error",
                    String.format("配置信息错误，您提供的配置文件[%s]不存在. 请检查您的配置文件.", file.getAbsolutePath()));
        } catch (IOException e) {
            throw new BaseException(
                    "config error",
                    String.format("配置信息错误. 您提供配置文件[%s]读取失败，错误原因: %s. 请检查您的配置文件的权限设置.",
                            file.getAbsolutePath(), e));
        }
    }

    public static JsonPathUtils from(InputStream io){
        try {
            return JsonPathUtils.from(IOUtils.toString(io));
        } catch (IOException e) {
            throw new BaseException(
                    "config error",
                    String.format("配置信息错误. 您提供配置文件读取失败，错误原因: %s. 请检查您的配置文件的权限设置.",
                            e));
        }
    }




    /**
     * 从Map对象加载Configuration
     */
    public static JsonPathUtils from(final Map<String, Object> object) {
        return JsonPathUtils.from(toJsonString(object));
    }

    /**
     * 从List对象加载Configuration
     */
    public static JsonPathUtils from(final List<Object> object) {
        return JsonPathUtils.from(toJsonString(object));
    }

    private static void checkJSON(final String json) {
        if (StringUtils.isBlank(json)) {
            throw new BaseException("config error",
                    "配置信息错误. 因为您提供的配置信息不是合法的JSON格式, JSON不能为空白. 请按照标准json格式提供配置信息. ");
        }
    }

    private JsonPathUtils(final String json){
        try{
            this.root = JsonUtils.toObject(json,Object.class);
        }catch (Exception e){
            throw new BaseException("config error",String.format("配置信息错误. 您提供的配置信息不是合法的JSON格式: %s . 请按照标准json格式提供配置信息. ", e.getMessage()));
        }
    }

    /**
     * 根据用户提供的json path，寻址具体的对象。
     * <p/>
     * <br>
     * <p/>JsonUtils
     * NOTE: 目前仅支持Map以及List下标寻址, 例如:
     * <p/>
     * <br />
     * <p/>
     * 对于如下JSON
     * <p/>
     * {"a": {"b": {"c": [0,1,2,3]}}}
     * <p/>
     * config.get("") 返回整个Map <br>
     * config.get("a") 返回a下属整个Map <br>
     * config.get("a.b.c") 返回c对应的数组List <br>
     * config.get("a.b.c[0]") 返回数字0
     *
     * @return Java表示的JSON对象，如果path不存在或者对象不存在，均返回null。
     */
    public Object get(final String path) {
        this.checkPath(path);
        try {
            return this.findObject(path);
        } catch (Exception e) {
            return null;
        }
    }


    /**
     * 根据用户提供的json path，寻址String对象
     *
     * @return String对象，如果path不存在或者String不存在，返回null
     */
    public String getString(final String path) {
        Object string = this.get(path);
        if (null == string) {
            return null;
        }

        if(string instanceof LinkedHashMap){
            return JsonUtils.toJSON(string);
        }
        return String.valueOf(string);
    }

    /**
     * 根据用户提供的json path，寻址String对象，如果对象不存在，返回默认字符串
     *
     * @return String对象，如果path不存在或者String不存在，返回默认字符串
     */
    public String getString(final String path, final String defaultValue) {
        String result = this.getString(path);

        if (null == result) {
            return defaultValue;
        }

        return result;
    }

    /**
     * 根据用户提供的json path，寻址Character对象
     *
     * @return Character对象，如果path不存在或者Character不存在，返回null
     */
    public Character getChar(final String path) {
        String result = this.getString(path);
        if (null == result) {
            return null;
        }

        try {
            return CharUtils.toChar(result);
        } catch (Exception e) {
            throw new BaseException(
                    "config error",
                    String.format("任务读取配置文件出错. 因为配置文件路径[%s] 值非法，期望是字符类型: %s. 请检查您的配置并作出修改.", path,
                            e.getMessage()));
        }
    }

    /**
     * 根据用户提供的json path，寻址Boolean对象，如果对象不存在，返回默认Character对象
     *
     * @return Character对象，如果path不存在或者Character不存在，返回默认Character对象
     */
    public Character getChar(final String path, char defaultValue) {
        Character result = this.getChar(path);
        if (null == result) {
            return defaultValue;
        }
        return result;
    }

    /**
     * 根据用户提供的json path，寻址Boolean对象
     *
     * @return Boolean对象，如果path值非true,false ，将报错.特别注意：当 path 不存在时，会返回：null.
     */
    public Boolean getBool(final String path) {
        String result = this.getString(path);

        if (null == result) {
            return null;
        } else if ("true".equalsIgnoreCase(result)) {
            return Boolean.TRUE;
        } else if ("false".equalsIgnoreCase(result)) {
            return Boolean.FALSE;
        } else {
            throw new BaseException("config error",
                    String.format("您提供的配置信息有误，因为从[%s]获取的值[%s]无法转换为bool类型. 请检查源表的配置并且做出相应的修改.",
                            path, result));
        }

    }

    /**
     * 根据用户提供的json path，寻址Boolean对象，如果对象不存在，返回默认Boolean对象
     *
     * @return Boolean对象，如果path不存在或者Boolean不存在，返回默认Boolean对象
     */
    public Boolean getBool(final String path, boolean defaultValue) {
        Boolean result = this.getBool(path);
        if (null == result) {
            return defaultValue;
        }
        return result;
    }

    /**
     * 根据用户提供的json path，寻址Integer对象
     *
     * @return Integer对象，如果path不存在或者Integer不存在，返回null
     */
    public Integer getInt(final String path) {
        String result = this.getString(path);
        if (null == result) {
            return null;
        }

        try {
            return Integer.valueOf(result);
        } catch (Exception e) {
            throw new BaseException(
                    "config error",
                    String.format("任务读取配置文件出错. 配置文件路径[%s] 值非法, 期望是整数类型: %s. 请检查您的配置并作出修改.", path,
                            e.getMessage()));
        }
    }

    /**
     * 根据用户提供的json path，寻址Integer对象，如果对象不存在，返回默认Integer对象
     *
     * @return Integer对象，如果path不存在或者Integer不存在，返回默认Integer对象
     */
    public Integer getInt(final String path, int defaultValue) {
        Integer object = this.getInt(path);
        if (null == object) {
            return defaultValue;
        }
        return object;
    }

    /**
     * 根据用户提供的json path，寻址Long对象
     *
     * @return Long对象，如果path不存在或者Long不存在，返回null
     */
    public Long getLong(final String path) {
        String result = this.getString(path);
        if (StringUtils.isBlank(result)) {
            return null;
        }

        try {
            return Long.valueOf(result);
        } catch (Exception e) {
            throw new BaseException(
                    "config error",
                    String.format("任务读取配置文件出错. 配置文件路径[%s] 值非法, 期望是整数类型: %s. 请检查您的配置并作出修改.", path,
                            e.getMessage()));
        }
    }

    /**
     * 根据用户提供的json path，寻址Long对象，如果对象不存在，返回默认Long对象
     *
     * @return Long对象，如果path不存在或者Integer不存在，返回默认Long对象
     */
    public Long getLong(final String path, long defaultValue) {
        Long result = this.getLong(path);
        if (null == result) {
            return defaultValue;
        }
        return result;
    }

    /**
     * 根据用户提供的json path，寻址Double对象
     *
     * @return Double对象，如果path不存在或者Double不存在，返回null
     */
    public Double getDouble(final String path) {
        String result = this.getString(path);
        if (StringUtils.isBlank(result)) {
            return null;
        }

        try {
            return Double.valueOf(result);
        } catch (Exception e) {
            throw new BaseException(
                    "config error",
                    String.format("任务读取配置文件出错. 配置文件路径[%s] 值非法, 期望是浮点类型: %s. 请检查您的配置并作出修改.", path,
                            e.getMessage()));
        }
    }

    /**
     * 根据用户提供的json path，寻址Double对象，如果对象不存在，返回默认Double对象
     *
     * @return Double对象，如果path不存在或者Double不存在，返回默认Double对象
     */
    public Double getDouble(final String path, double defaultValue) {
        Double result = this.getDouble(path);
        if (null == result) {
            return defaultValue;
        }
        return result;
    }

    /**
     * 根据用户提供的json path，寻址List对象，如果对象不存在，返回null
     */
    @SuppressWarnings("unchecked")
    public List<Object> getList(final String path) {
        List<Object> list = this.get(path, List.class);
        if (null == list) {
            return null;
        }
        return list;
    }

    /**
     * 根据用户提供的json path，寻址List对象，如果对象不存在，返回null
     */
    @SuppressWarnings("unchecked")
    public <T> List<T> getList(final String path, Class<T> t) {
        Object object = this.get(path, List.class);
        if (null == object) {
            return null;
        }
        List<T> result = new ArrayList<>();
        result = JsonUtils.toArray(object,t);
        return result;
    }

    /**
     * 根据用户提供的json path，寻址List对象，如果对象不存在，返回默认List
     */
    @SuppressWarnings("unchecked")
    public List<Object> getList(final String path,
                                final List<Object> defaultList) {
        Object object = this.getList(path);
        if (null == object) {
            return defaultList;
        }
        return (List<Object>) object;
    }

    /**
     * 根据用户提供的json path，寻址List对象，如果对象不存在，返回默认List
     */
    public <T> List<T> getList(final String path, final List<T> defaultList,
                               Class<T> t) {
        List<T> list = this.getList(path, t);
        if (null == list) {
            return defaultList;
        }
        return list;
    }

    /**
     * 根据用户提供的json path，寻址Map对象，如果对象不存在，返回null
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> getMap(final String path) {
        Map<String, Object> result = this.get(path, Map.class);
        if (null == result) {
            return null;
        }
        return result;
    }

    /**
     * 根据用户提供的json path，寻址Map对象，如果对象不存在，返回null;
     */
    @SuppressWarnings("unchecked")
    public <T> Map<String, T> getMap(final String path, Class<T> t) {
        Map<String, Object> map = this.get(path, Map.class);
        if (null == map) {
            return null;
        }

        Map<String, T> result = new HashMap<String, T>();
        for (final String key : map.keySet()) {
            result.put(key, (T) map.get(key));
        }

        return result;
    }

    /**
     * 根据用户提供的json path，寻址Map对象，如果对象不存在，返回默认map
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> getMap(final String path,
                                      final Map<String, Object> defaultMap) {
        Object object = this.getMap(path);
        if (null == object) {
            return defaultMap;
        }
        return (Map<String, Object>) object;
    }

    /**
     * 根据用户提供的json path，寻址Map对象，如果对象不存在，返回默认map
     */
    public <T> Map<String, T> getMap(final String path,
                                     final Map<String, T> defaultMap, Class<T> t) {
        Map<String, T> result = getMap(path, t);
        if (null == result) {
            return defaultMap;
        }
        return result;
    }


    /**
     * 根据用户提供的json path，寻址具体的对象，并转为用户提供的类型
     * <p/>
     * <br>
     * <p/>
     * NOTE: 目前仅支持Map以及List下标寻址, 例如:
     * <p/>
     * <br />
     * <p/>
     * 对于如下JSON
     * <p/>
     * {"a": {"b": {"c": [0,1,2,3]}}}
     * <p/>
     * config.get("") 返回整个Map <br>
     * config.get("a") 返回a下属整个Map <br>
     * config.get("a.b.c") 返回c对应的数组List <br>
     * config.get("a.b.c[0]") 返回数字0
     *
     * @return Java表示的JSON对象，如果转型失败，将抛出异常
     */
    @SuppressWarnings("unchecked")
    public <T> T get(final String path, Class<T> clazz) {
        this.checkPath(path);
        return (T) this.get(path);
    }

    /**
     * 根据用户提供的json path，插入指定对象，并返回之前存在的对象(如果存在)
     * <p/>
     * <br>
     * <p/>
     * 目前仅支持.以及数组下标寻址, 例如:
     * <p/>
     * <br />
     * <p/>
     * config.set("a.b.c[3]", object);
     * <p/>
     * <br>
     * 对于插入对象，Configuration不做任何限制，但是请务必保证该对象是简单对象(包括Map<String,
     * Object>、List<Object>)，不要使用自定义对象，否则后续对于JSON序列化等情况会出现未定义行为。
     *
     * @param path
     *            JSON path对象
     * @param object
     *            需要插入的对象
     * @return Java表示的JSON对象
     */
    public Object set(final String path, final Object object) {
        checkPath(path);

        Object result = this.get(path);

        setObject(path, extractConfiguration(object));

        return null == result ? this.root : result;
    }

    private void setObject(final String path, final Object object) {
        Object newRoot = setObjectRecursive(this.root, split2List(path), 0,
                object);

        if (isSuitForRoot(newRoot)) {
            this.root = newRoot;
            return;
        }

        throw new BaseException("config error",
                String.format("值[%s]无法适配您提供[%s]， 该异常代表系统编程错误!",
                        ToStringBuilder.reflectionToString(object), path));
    }

    @SuppressWarnings("unchecked")
    private Object extractConfiguration(final Object object) {
        if (object instanceof JsonPathUtils) {
            return extractFromConfiguration(object);
        }

        if (object instanceof List) {
            List<Object> result = new ArrayList<Object>();
            for (final Object each : (List<Object>) object) {
                result.add(extractFromConfiguration(each));
            }
            return result;
        }

        if (object instanceof Map) {
            Map<String, Object> result = new HashMap<String, Object>();
            for (final String key : ((Map<String, Object>) object).keySet()) {
                result.put(key,
                        extractFromConfiguration(((Map<String, Object>) object)
                                .get(key)));
            }
            return result;
        }

        return object;
    }

    private Object extractFromConfiguration(final Object object) {
        if (object instanceof JsonPathUtils) {
            return ((JsonPathUtils) object).getInternal();
        }

        return object;
    }

    public Object getInternal() {
        return this.root;
    }

    @SuppressWarnings("unchecked")
    Object setObjectRecursive(Object current, final List<String> paths,
                              int index, final Object value) {

        // 如果是已经超出path，我们就返回value即可，作为最底层叶子节点
        boolean isLastIndex = index == paths.size();
        if (isLastIndex) {
            return value;
        }

        String path = paths.get(index).trim();
        boolean isNeedMap = isPathMap(path);
        if (isNeedMap) {
            Map<String, Object> mapping;

            // 当前不是map，因此全部替换为map，并返回新建的map对象
            boolean isCurrentMap = current instanceof Map;
            if (!isCurrentMap) {
                mapping = new HashMap<String, Object>();
                mapping.put(
                        path,
                        buildObject(paths.subList(index + 1, paths.size()),
                                value));
                return mapping;
            }

            // 当前是map，但是没有对应的key，也就是我们需要新建对象插入该map，并返回该map
            mapping = ((Map<String, Object>) current);
            boolean hasSameKey = mapping.containsKey(path);
            if (!hasSameKey) {
                mapping.put(
                        path,
                        buildObject(paths.subList(index + 1, paths.size()),
                                value));
                return mapping;
            }

            // 当前是map，而且还竟然存在这个值，好吧，继续递归遍历
            current = mapping.get(path);
            mapping.put(path,
                    setObjectRecursive(current, paths, index + 1, value));
            return mapping;
        }

        boolean isNeedList = isPathList(path);
        if (isNeedList) {
            List<Object> lists;
            int listIndexer = getIndex(path);

            // 当前是list，直接新建并返回即可
            boolean isCurrentList = current instanceof List;
            if (!isCurrentList) {
                lists = expand(new ArrayList<Object>(), listIndexer + 1);
                lists.set(
                        listIndexer,
                        buildObject(paths.subList(index + 1, paths.size()),
                                value));
                return lists;
            }

            // 当前是list，但是对应的indexer是没有具体的值，也就是我们新建对象然后插入到该list，并返回该List
            lists = (List<Object>) current;
            lists = expand(lists, listIndexer + 1);

            boolean hasSameIndex = lists.get(listIndexer) != null;
            if (!hasSameIndex) {
                lists.set(
                        listIndexer,
                        buildObject(paths.subList(index + 1, paths.size()),
                                value));
                return lists;
            }

            // 当前是list，并且存在对应的index，没有办法继续递归寻找
            current = lists.get(listIndexer);
            lists.set(listIndexer,
                    setObjectRecursive(current, paths, index + 1, value));
            return lists;
        }

        throw new BaseException("config error",
                "该异常代表系统编程错误 !");
    }

    Object buildObject(final List<String> paths, final Object object) {
        if (null == paths) {
            throw new BaseException(
                    "config error",
                    "Path不能为null，该异常代表系统编程错误, 请联系DataX开发团队 !");
        }

        if (1 == paths.size() && StringUtils.isBlank(paths.get(0))) {
            return object;
        }

        Object child = object;
        for (int i = paths.size() - 1; i >= 0; i--) {
            String path = paths.get(i);

            if (isPathMap(path)) {
                Map<String, Object> mapping = new HashMap<String, Object>();
                mapping.put(path, child);
                child = mapping;
                continue;
            }

            if (isPathList(path)) {
                List<Object> lists = new ArrayList<Object>(
                        this.getIndex(path) + 1);
                expand(lists, this.getIndex(path) + 1);
                lists.set(this.getIndex(path), child);
                child = lists;
                continue;
            }

            throw new BaseException(
                    "config error", String.format(
                    "路径[%s]出现非法值类型[%s]，该异常代表系统编程错误! .",
                    StringUtils.join(paths, "."), path));
        }

        return child;
    }

    private List<Object> expand(List<Object> list, int size) {
        int expand = size - list.size();
        while (expand-- > 0) {
            list.add(null);
        }
        return list;
    }

    private Object findObject(final String path) {
        boolean isRootQuery = StringUtils.isBlank(path);
        if (isRootQuery) {
            return this.root;
        }

        Object target = this.root;

        for (final String each : split2List(path)) {
            if (isPathMap(each)) {
                target = findObjectInMap(target, each);
                continue;
            } else {
                target = findObjectInList(target, each);
                continue;
            }
        }

        return target;
    }

    @SuppressWarnings("unchecked")
    private Object findObjectInMap(final Object target, final String index) {
        boolean isMap = (target instanceof Map);
        if (!isMap) {
            throw new IllegalArgumentException(String.format(
                    "您提供的配置文件有误. 路径[%s]需要配置Json格式的Map对象，但该节点发现实际类型是[%s]. 请检查您的配置并作出修改.",
                    index, target.getClass().toString()));
        }

        Object result = ((Map<String, Object>) target).get(index);
        if (null == result) {
            throw new IllegalArgumentException(String.format(
                    "您提供的配置文件有误. 路径[%s]值为null，datax无法识别该配置. 请检查您的配置并作出修改.", index));
        }

        return result;
    }

    @SuppressWarnings({ "unchecked" })
    private Object findObjectInList(final Object target, final String each) {
        boolean isList = (target instanceof List);
        if (!isList) {
            throw new IllegalArgumentException(String.format(
                    "您提供的配置文件有误. 路径[%s]需要配置Json格式的Map对象，但该节点发现实际类型是[%s]. 请检查您的配置并作出修改.",
                    each, target.getClass().toString()));
        }

        String index = each.replace("[", "").replace("]", "");
        if (!StringUtils.isNumeric(index)) {
            throw new IllegalArgumentException(
                    String.format(
                            "系统编程错误，列表下标必须为数字类型，但该节点发现实际类型是[%s] ，该异常代表系统编程错误, 请联系DataX开发团队 !",
                            index));
        }

        return ((List<Object>) target).get(Integer.valueOf(index));
    }

    private boolean isPathList(final String path) {
        return path.contains("[") && path.contains("]");
    }

    private boolean isPathMap(final String path) {
        return StringUtils.isNotBlank(path) && !isPathList(path);
    }

    private int getIndex(final String index) {
        return Integer.valueOf(index.replace("[", "").replace("]", ""));
    }

    private boolean isSuitForRoot(final Object object) {
        if (null != object && (object instanceof List || object instanceof Map)) {
            return true;
        }

        return false;
    }

    private String split(final String path) {
        return StringUtils.replace(path, "[", ".[");
    }

    private List<String> split2List(final String path) {
        return Arrays.asList(StringUtils.split(split(path), "."));
    }

    private void checkPath(final String path) {
        if (null == path) {
            throw new IllegalArgumentException(
                    "系统编程错误, 该异常代表系统编程错误!.");
        }

        for (final String each : StringUtils.split(".")) {
            if (StringUtils.isBlank(each)) {
                throw new IllegalArgumentException(String.format(
                        "系统编程错误, 路径[%s]不合法, 路径层次之间不能出现空白字符 .", path));
            }
        }
    }


    private static String toJsonString(final Object obj){
        return JsonUtils.toJSON(obj);
    }


    public void addKeyPath(String path) {
        if(StringUtils.isNotBlank(path)) {
            this.keyPath.add(path);
        }
    }

    public void addKeyPath(Set<String> pathSet) {
        if(pathSet != null) {
            this.keyPath.addAll(pathSet);
        }
    }

    public void setKeyPathSet(Set<String> keyPathSet) {
        if(keyPathSet != null) {
            this.keyPath = keyPathSet;
        }
    }

    public boolean iskeyPath(String path) {
        return this.keyPath.contains(path);
    }


    public Set<String> getKeyPath() {
        return keyPath;
    }

    public void setKeyPath(Set<String> keyPath) {
        if(keyPath != null){
            this.keyPath = keyPath;
        }
    }
}
