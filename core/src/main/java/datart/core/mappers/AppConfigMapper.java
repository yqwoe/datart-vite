package datart.core.mappers;

import datart.core.entity.AppConfig;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface AppConfigMapper {

    @Select({
            "SELECT a.* from app_config a order by update_time desc limit 1"
    })
    AppConfig firstConfig();
}
