package datart.core.mappers;

import datart.core.entity.CreateTable;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

public interface CommonMapper {
    /**
     * 查询数据库中的所有表名
     *
     * @param schema 数据库名
     * @return 表名列表
     */
    @Select("SELECT TABLES.TABLE_NAME " +
            "        FROM information_schema.TABLES" +
            "        WHERE TABLES.TABLE_SCHEMA = #{schema}")
    List<String> getAllTableNameBySchema(@Param("schema") String schema);

    /**
     * 查询建表语句
     *
     * @param tableName 表名
     * @return 建表语句
     */
    @Select("SHOW CREATE TABLE ${tableName}")
    CreateTable selectTableCreateSql(@Param("tableName") String tableName);

    /**
     * 执行SQL
     *
     * @param sql 待执行SQL
     */
    @Update("${sql}")
    void executeSql(@Param("sql") String sql);
}
