package datart.server.common;

import com.alibaba.fastjson.JSON;
import com.fasterxml.jackson.core.JsonProcessingException;
import datart.core.base.exception.Exceptions;
import datart.core.common.JavascriptUtils;
import datart.server.base.params.DownloadCreateParam;

import javax.script.Invocable;
import javax.script.ScriptException;

public class JsParserUtils {

    private static Invocable parser;

    public static DownloadCreateParam parseExecuteParam(String type, String json) throws ScriptException, NoSuchMethodException, JsonProcessingException {
        Invocable parser = getParser();
        if (parser == null) {
            Exceptions.msg("param parser load error");
        }
        Object result = parser.invokeFunction("getQueryData", type, json);
        return JSON.parseObject(result.toString(), DownloadCreateParam.class);
    }

    private static synchronized Invocable getParser() {
        if (parser == null) {
            try {
                parser = JavascriptUtils.load("javascript/parser.js");
            } catch (Exception e) {
                Exceptions.e(e);
            }
        }
        return parser;
    }


//    static void viteWeb(){
//        StringBuffer json = new StringBuffer();
//        json.append("{\"id\":\"b46019e9f1d84b35a893b9669b547808\",\"createBy\":\"1b4e4df6d44348fe88b3f310a173007c\",\"createTime\":1645047576000,\"updateBy\":\"1b4e4df6d44348fe88b3f310a173007c\",\"updateTime\":1645485279000,\"permission\":null,\"name\":\"人员累计工时\",\"description\":null,\"viewId\":\"f5e793689202403d8ceb250005bc40b5\",\"orgId\":\"c9c7bc79befd4136a72d47e1b3f34666\",\"config\":\"{\\\"aggregation\\\":true,\\\"chartConfig\\\":{\\\"datas\\\":[{\\\"label\\\":\\\"dimension\\\",\\\"key\\\":\\\"dimension\\\",\\\"required\\\":true,\\\"type\\\":\\\"group\\\",\\\"limit\\\":[0,1],\\\"actions\\\":{\\\"NUMERIC\\\":[\\\"alias\\\",\\\"colorize\\\",\\\"sortable\\\"],\\\"STRING\\\":[\\\"alias\\\",\\\"colorize\\\",\\\"sortable\\\"]},\\\"rows\\\":[{\\\"uid\\\":\\\"d0b035ac-e536-41e9-9f31-3caad9414d98\\\",\\\"colName\\\":\\\"u_name\\\",\\\"category\\\":\\\"field\\\",\\\"type\\\":\\\"STRING\\\",\\\"alias\\\":{\\\"name\\\":\\\"人员\\\",\\\"desc\\\":\\\"人员\\\"},\\\"color\\\":{\\\"colors\\\":[{\\\"key\\\":\\\"吴要权\\\",\\\"value\\\":\\\"#448aff\\\"},{\\\"key\\\":\\\"陈晓雨\\\",\\\"value\\\":\\\"#e3f2fd\\\"},{\\\"key\\\":\\\"王孟科\\\",\\\"value\\\":\\\"#ffab40\\\"},{\\\"key\\\":\\\"张文政\\\",\\\"value\\\":\\\"#fff3e0\\\"},{\\\"key\\\":\\\"mujiawei\\\",\\\"value\\\":\\\"#4caf50\\\"},{\\\"key\\\":\\\"弓远\\\",\\\"value\\\":\\\"#b9f6ca\\\"},{\\\"key\\\":\\\"闫亚松\\\",\\\"value\\\":\\\"#ffd740\\\"},{\\\"key\\\":\\\"董其鑫\\\",\\\"value\\\":\\\"#ffecb3\\\"},{\\\"key\\\":\\\"张豪豪\\\",\\\"value\\\":\\\"#009688\\\"},{\\\"key\\\":\\\"李剑威\\\",\\\"value\\\":\\\"#a7ffeb\\\"},{\\\"key\\\":\\\"程双\\\",\\\"value\\\":\\\"#ff5252\\\"},{\\\"key\\\":\\\"刘欢\\\",\\\"value\\\":\\\"#ffcdd2\\\"},{\\\"key\\\":\\\"马国岭\\\",\\\"value\\\":\\\"#9e9e9e\\\"},{\\\"key\\\":\\\"杨波\\\",\\\"value\\\":\\\"#f5f5f5\\\"},{\\\"key\\\":\\\"穆佳伟\\\",\\\"value\\\":\\\"#FF4081\\\"}]}}]},{\\\"label\\\":\\\"metrics\\\",\\\"key\\\":\\\"metrics\\\",\\\"required\\\":true,\\\"type\\\":\\\"aggregate\\\",\\\"limit\\\":[1,999],\\\"rows\\\":[{\\\"uid\\\":\\\"2cba0042-9b6a-492a-9754-7c13caf50740\\\",\\\"colName\\\":\\\"complete\\\",\\\"category\\\":\\\"field\\\",\\\"type\\\":\\\"NUMERIC\\\",\\\"aggregate\\\":\\\"SUM\\\",\\\"alias\\\":{\\\"name\\\":\\\"累计/小时\\\",\\\"desc\\\":\\\"累计/小时\\\"}}]},{\\\"allowSameField\\\":true,\\\"disableAggregate\\\":false,\\\"actions\\\":{\\\"NUMERIC\\\":[\\\"filter\\\"],\\\"STRING\\\":[\\\"filter\\\"],\\\"DATE\\\":[\\\"filter\\\"]},\\\"label\\\":\\\"filter\\\",\\\"key\\\":\\\"filter\\\",\\\"type\\\":\\\"filter\\\",\\\"rows\\\":[]},{\\\"label\\\":\\\"colorize\\\",\\\"key\\\":\\\"color\\\",\\\"type\\\":\\\"color\\\",\\\"limit\\\":[0,1],\\\"rows\\\":[]},{\\\"label\\\":\\\"info\\\",\\\"key\\\":\\\"info\\\",\\\"type\\\":\\\"info\\\",\\\"rows\\\":[{\\\"uid\\\":\\\"0eae47cc-ee07-4ab3-b35d-46821203f6e8\\\",\\\"colName\\\":\\\"score\\\",\\\"category\\\":\\\"computedField\\\",\\\"type\\\":\\\"NUMERIC\\\",\\\"aggregate\\\":\\\"SUM\\\",\\\"alias\\\":{\\\"name\\\":\\\"累计/评分\\\",\\\"desc\\\":\\\"累计/评分\\\"},\\\"format\\\":{\\\"type\\\":\\\"numeric\\\",\\\"numeric\\\":{\\\"decimalPlaces\\\":2,\\\"unitKey\\\":\\\"none\\\",\\\"useThousandSeparator\\\":true,\\\"prefix\\\":\\\"\\\",\\\"suffix\\\":\\\"\\\"}}}]}],\\\"styles\\\":[{\\\"label\\\":\\\"label.title\\\",\\\"key\\\":\\\"label\\\",\\\"rows\\\":[{\\\"label\\\":\\\"label.showLabel\\\",\\\"key\\\":\\\"showLabel\\\",\\\"value\\\":true,\\\"rows\\\":[]},{\\\"label\\\":\\\"label.position\\\",\\\"key\\\":\\\"position\\\",\\\"value\\\":\\\"outside\\\",\\\"rows\\\":[]},{\\\"label\\\":\\\"viz.palette.style.font\\\",\\\"key\\\":\\\"font\\\",\\\"value\\\":{\\\"fontFamily\\\":\\\"PingFang SC\\\",\\\"fontSize\\\":\\\"12\\\",\\\"fontWeight\\\":\\\"normal\\\",\\\"fontStyle\\\":\\\"normal\\\",\\\"color\\\":\\\"#495057\\\"},\\\"rows\\\":[]},{\\\"label\\\":\\\"label.showName\\\",\\\"key\\\":\\\"showName\\\",\\\"value\\\":true,\\\"rows\\\":[]},{\\\"label\\\":\\\"label.showValue\\\",\\\"key\\\":\\\"showValue\\\",\\\"value\\\":false,\\\"rows\\\":[]},{\\\"label\\\":\\\"label.showPercent\\\",\\\"key\\\":\\\"showPercent\\\",\\\"value\\\":true,\\\"rows\\\":[]}]},{\\\"label\\\":\\\"legend.title\\\",\\\"key\\\":\\\"legend\\\",\\\"rows\\\":[{\\\"label\\\":\\\"legend.showLegend\\\",\\\"key\\\":\\\"showLegend\\\",\\\"value\\\":true,\\\"rows\\\":[]},{\\\"label\\\":\\\"legend.type\\\",\\\"key\\\":\\\"type\\\",\\\"value\\\":\\\"scroll\\\",\\\"rows\\\":[]},{\\\"label\\\":\\\"legend.selectAll\\\",\\\"key\\\":\\\"selectAll\\\",\\\"value\\\":true,\\\"rows\\\":[]},{\\\"label\\\":\\\"legend.position\\\",\\\"key\\\":\\\"position\\\",\\\"value\\\":\\\"right\\\",\\\"rows\\\":[]},{\\\"label\\\":\\\"viz.palette.style.font\\\",\\\"key\\\":\\\"font\\\",\\\"value\\\":{\\\"fontFamily\\\":\\\"PingFang SC\\\",\\\"fontSize\\\":\\\"12\\\",\\\"fontWeight\\\":\\\"normal\\\",\\\"fontStyle\\\":\\\"normal\\\",\\\"color\\\":\\\"#495057\\\"},\\\"rows\\\":[]}]},{\\\"label\\\":\\\"viz.palette.style.margin.title\\\",\\\"key\\\":\\\"margin\\\",\\\"rows\\\":[{\\\"label\\\":\\\"viz.palette.style.margin.containLabel\\\",\\\"key\\\":\\\"containLabel\\\",\\\"value\\\":true,\\\"rows\\\":[]},{\\\"label\\\":\\\"viz.palette.style.margin.left\\\",\\\"key\\\":\\\"marginLeft\\\",\\\"value\\\":\\\"5%\\\",\\\"rows\\\":[]},{\\\"label\\\":\\\"viz.palette.style.margin.right\\\",\\\"key\\\":\\\"marginRight\\\",\\\"value\\\":\\\"5%\\\",\\\"rows\\\":[]},{\\\"label\\\":\\\"viz.palette.style.margin.top\\\",\\\"key\\\":\\\"marginTop\\\",\\\"value\\\":\\\"5%\\\",\\\"rows\\\":[]},{\\\"label\\\":\\\"viz.palette.style.margin.bottom\\\",\\\"key\\\":\\\"marginBottom\\\",\\\"value\\\":\\\"5%\\\",\\\"rows\\\":[]}]}],\\\"settings\\\":[{\\\"label\\\":\\\"viz.palette.setting.paging.title\\\",\\\"key\\\":\\\"paging\\\",\\\"rows\\\":[{\\\"label\\\":\\\"viz.palette.setting.paging.pageSize\\\",\\\"key\\\":\\\"pageSize\\\",\\\"value\\\":1000,\\\"rows\\\":[]}]}]},\\\"chartGraphId\\\":\\\"pie-chart\\\",\\\"computedFields\\\":[{\\\"id\\\":\\\"score\\\",\\\"category\\\":\\\"computedField\\\",\\\"type\\\":\\\"NUMERIC\\\",\\\"expression\\\":\\\"[complete] / 7 * 0.3 * [weight] * [rate]\\\"}]}\",\"thumbnail\":null,\"status\":1,\"parentId\":\"c723fafb113a48ebb43a4c99a21e0738\",\"index\":4.0,\"view\":{\"id\":\"f5e793689202403d8ceb250005bc40b5\",\"createBy\":\"1b4e4df6d44348fe88b3f310a173007c\",\"createTime\":1644990190000,\"updateBy\":\"1b4e4df6d44348fe88b3f310a173007c\",\"updateTime\":1679286001000,\"permission\":null,\"name\":\"人员OKR\",\"description\":null,\"orgId\":\"c9c7bc79befd4136a72d47e1b3f34666\",\"sourceId\":\"90f7efc7edce463296ea858204fc6fc3\",\"script\":\"select \\n  u.name as u_name,\\n  o.name as o_name,\\n  k.name as k_name,\\n  k.weight,\\n  k.complete,\\n  k.rate,\\n  k.state as 'k_state',\\n  o.start_time,\\n  o.due_time,\\n  o.state\\nfrom\\n  okr_system_development.users u\\n  left join okr_system_development.objectives o on o.oable_id = u.id\\n  left join okr_system_development.key_results k on o.id = k.keyable_id \\n  where k.weight <> '0' and o.start_time > '2023-01-01' and u.name not in  ('陈晓雨','张文政','王孟科','马国岭')\\n  order by o.start_time desc\",\"type\":\"SQL\",\"model\":\"{\\\"hierarchy\\\":{\\\"u_name\\\":{\\\"type\\\":\\\"STRING\\\",\\\"primaryKey\\\":false,\\\"category\\\":\\\"UNCATEGORIZED\\\",\\\"name\\\":\\\"u_name\\\",\\\"path\\\":[\\\"u_name\\\"]},\\\"o_name\\\":{\\\"type\\\":\\\"STRING\\\",\\\"primaryKey\\\":false,\\\"category\\\":\\\"UNCATEGORIZED\\\",\\\"name\\\":\\\"o_name\\\",\\\"path\\\":[\\\"o_name\\\"]},\\\"k_name\\\":{\\\"type\\\":\\\"STRING\\\",\\\"primaryKey\\\":false,\\\"category\\\":\\\"UNCATEGORIZED\\\",\\\"name\\\":\\\"k_name\\\",\\\"path\\\":[\\\"k_name\\\"]},\\\"weight\\\":{\\\"type\\\":\\\"NUMERIC\\\",\\\"primaryKey\\\":false,\\\"category\\\":\\\"UNCATEGORIZED\\\",\\\"name\\\":\\\"weight\\\",\\\"path\\\":[\\\"weight\\\"]},\\\"complete\\\":{\\\"type\\\":\\\"NUMERIC\\\",\\\"primaryKey\\\":false,\\\"category\\\":\\\"UNCATEGORIZED\\\",\\\"name\\\":\\\"complete\\\",\\\"path\\\":[\\\"complete\\\"]},\\\"rate\\\":{\\\"type\\\":\\\"NUMERIC\\\",\\\"primaryKey\\\":false,\\\"category\\\":\\\"UNCATEGORIZED\\\",\\\"name\\\":\\\"rate\\\",\\\"path\\\":[\\\"rate\\\"]},\\\"k_state\\\":{\\\"type\\\":\\\"STRING\\\",\\\"primaryKey\\\":false,\\\"category\\\":\\\"UNCATEGORIZED\\\",\\\"name\\\":\\\"k_state\\\",\\\"path\\\":[\\\"k_state\\\"]},\\\"start_time\\\":{\\\"type\\\":\\\"DATE\\\",\\\"primaryKey\\\":false,\\\"category\\\":\\\"UNCATEGORIZED\\\",\\\"name\\\":\\\"start_time\\\",\\\"path\\\":[\\\"start_time\\\"]},\\\"due_time\\\":{\\\"type\\\":\\\"DATE\\\",\\\"primaryKey\\\":false,\\\"category\\\":\\\"UNCATEGORIZED\\\",\\\"name\\\":\\\"due_time\\\",\\\"path\\\":[\\\"due_time\\\"]},\\\"state\\\":{\\\"type\\\":\\\"STRING\\\",\\\"primaryKey\\\":false,\\\"category\\\":\\\"UNCATEGORIZED\\\",\\\"name\\\":\\\"state\\\",\\\"path\\\":[\\\"state\\\"]}},\\\"columns\\\":{\\\"u_name\\\":{\\\"name\\\":[\\\"u_name\\\"],\\\"type\\\":\\\"STRING\\\",\\\"primaryKey\\\":false,\\\"category\\\":\\\"UNCATEGORIZED\\\"},\\\"o_name\\\":{\\\"name\\\":[\\\"o_name\\\"],\\\"type\\\":\\\"STRING\\\",\\\"primaryKey\\\":false,\\\"category\\\":\\\"UNCATEGORIZED\\\"},\\\"k_name\\\":{\\\"name\\\":[\\\"k_name\\\"],\\\"type\\\":\\\"STRING\\\",\\\"primaryKey\\\":false,\\\"category\\\":\\\"UNCATEGORIZED\\\"},\\\"weight\\\":{\\\"name\\\":[\\\"weight\\\"],\\\"type\\\":\\\"NUMERIC\\\",\\\"primaryKey\\\":false,\\\"category\\\":\\\"UNCATEGORIZED\\\"},\\\"complete\\\":{\\\"name\\\":[\\\"complete\\\"],\\\"type\\\":\\\"NUMERIC\\\",\\\"primaryKey\\\":false,\\\"category\\\":\\\"UNCATEGORIZED\\\"},\\\"rate\\\":{\\\"name\\\":[\\\"rate\\\"],\\\"type\\\":\\\"NUMERIC\\\",\\\"primaryKey\\\":false,\\\"category\\\":\\\"UNCATEGORIZED\\\"},\\\"k_state\\\":{\\\"name\\\":[\\\"k_state\\\"],\\\"type\\\":\\\"STRING\\\",\\\"primaryKey\\\":false,\\\"category\\\":\\\"UNCATEGORIZED\\\"},\\\"start_time\\\":{\\\"name\\\":[\\\"start_time\\\"],\\\"type\\\":\\\"STRING\\\",\\\"primaryKey\\\":false,\\\"category\\\":\\\"UNCATEGORIZED\\\"},\\\"due_time\\\":{\\\"name\\\":[\\\"due_time\\\"],\\\"type\\\":\\\"STRING\\\",\\\"primaryKey\\\":false,\\\"category\\\":\\\"UNCATEGORIZED\\\"},\\\"state\\\":{\\\"name\\\":[\\\"state\\\"],\\\"type\\\":\\\"STRING\\\",\\\"primaryKey\\\":false,\\\"category\\\":\\\"UNCATEGORIZED\\\"}},\\\"version\\\":\\\"1.0.0-beta.4\\\"}\",\"config\":\"{\\\"concurrencyControl\\\":true,\\\"concurrencyControlMode\\\":\\\"DIRTYREAD\\\",\\\"cache\\\":false,\\\"cacheExpires\\\":0,\\\"editor\\\":\\\"sql\\\",\\\"expensiveQuery\\\":false,\\\"version\\\":\\\"1.0.0-beta.2\\\"}\",\"parentId\":null,\"isFolder\":false,\"index\":2.0,\"status\":1},\"queryVariables\":[{\"id\":\"19afad492ef44739b850bfe5fef7bcf4\",\"createBy\":\"1b4e4df6d44348fe88b3f310a173007c\",\"createTime\":1662115907000,\"updateBy\":\"1b4e4df6d44348fe88b3f310a173007c\",\"updateTime\":1662116048000,\"permission\":null,\"orgId\":\"c9c7bc79befd4136a72d47e1b3f34666\",\"viewId\":null,\"name\":\"USERNAME\",\"type\":\"QUERY\",\"valueType\":\"STRING\",\"encrypt\":null,\"label\":\"用户名\",\"defaultValue\":\"[\\\"18037114870\\\"]\",\"expression\":false}],\"download\":true}");
//        try {
//            NashornScriptEngineFactory engineFactory = new NashornScriptEngineFactory();
//            ScriptEngine engine = engineFactory.getScriptEngine();
//            engine.eval(new FileReader("/Users/yqwoe/workspace/datart/vite-web/public/task/index.js"));
//            Invocable parser = (Invocable)engine;
//            Object result = parser.invokeFunction("getQueryData", "chart", json);
//            System.out.println(JSON.toJSONString(result));
//        } catch (Exception e) {
//            Exceptions.e(e);
//        }
//    }
//
//
//
//    public static void main(String[] args) {
//        JsParserUtils.viteWeb();
//    }
}