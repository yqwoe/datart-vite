package datart.core.common;

import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang3.StringUtils;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class StrUtil {
    private static final Pattern VARIABLE_PATTERN = Pattern
            .compile("(\\$)\\{?(\\w+)\\}?");

    private StrUtil() {
    }


    public static String escapeDirectory(final String param){
        return param.replace("/","//");
    }

    public static String unescapeString(final String param){
        return StringEscapeUtils.unescapeJava(param);
    }

    public static String replaceVariable(final String param) {
        Map<String, String> mapping = new HashMap<>();

        Matcher matcher = VARIABLE_PATTERN.matcher(param);
        while (matcher.find()) {
            String variable = matcher.group(2);
            String value = System.getProperty(variable);
            if (StringUtils.isBlank(value)) {
                value = matcher.group();
            }
            mapping.put(matcher.group(), value);
        }

        String retString = param;
        for (final String key : mapping.keySet()) {
            retString = retString.replace(key, mapping.get(key));
        }

        return retString;
    }

}
