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

package datart.data.provider.jdbc.adapters;

import com.alibaba.fastjson.JSON;
import datart.core.base.PageInfo;
import datart.core.base.consts.ValueType;
import datart.core.base.exception.Exceptions;
import datart.core.common.BeanUtils;
import datart.core.common.ReflectUtils;
import datart.core.data.provider.*;
import datart.data.provider.JdbcDataProvider;
import datart.data.provider.calcite.dialect.CustomSqlDialect;
import datart.data.provider.calcite.dialect.FetchAndOffsetSupport;
import datart.data.provider.jdbc.DataTypeUtils;
import datart.data.provider.jdbc.JdbcDriverInfo;
import datart.data.provider.jdbc.JdbcProperties;
import datart.data.provider.jdbc.SqlScriptRender;
import datart.data.provider.local.LocalDB;
import javassist.ClassPool;
import javassist.CtClass;
import javassist.CtMethod;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.apache.calcite.avatica.util.Casing;
import org.apache.calcite.sql.SqlDialect;
import org.apache.calcite.sql.parser.SqlParseException;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.jdbc.support.rowset.SqlRowSetMetaData;
import org.springframework.util.CollectionUtils;

import javax.sql.DataSource;
import java.io.Closeable;
import java.lang.reflect.Constructor;
import java.sql.*;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Setter
@Getter
public class JdbcDataProviderAdapter implements Closeable {

    private static final String SQL_DIALECT_PACKAGE = "datart.data.provider.calcite.dialect";

    protected static final String COUNT_SQL = "SELECT COUNT(*) FROM (%s) V_T";

    protected static final String PKTABLE_CAT = "PKTABLE_CAT";

    protected static final String PKTABLE_NAME = "PKTABLE_NAME";

    protected static final String PKCOLUMN_NAME = "PKCOLUMN_NAME";

    protected static final String FKCOLUMN_NAME = "FKCOLUMN_NAME";


    protected static final String TABLE_CAT = "TABLE_CAT";

    protected static final String TABLE_NAME = "TABLE_NAME";

    protected static final String COLUMN_NAME = "COLUMN_NAME";

    protected static final String PK_NAME = "PK_NAME";

    protected DataSource dataSource;

    protected JdbcProperties jdbcProperties;

    protected JdbcDriverInfo driverInfo;

    protected boolean init;

    protected SqlDialect sqlDialect;

    protected JdbcTemplate jdbcTemplate;

    public final void init(JdbcProperties jdbcProperties, JdbcDriverInfo driverInfo) {
        try {
            this.jdbcProperties = jdbcProperties;
            this.driverInfo = driverInfo;
            this.dataSource = JdbcDataProvider.getDataSourceFactory().createDataSource(jdbcProperties);
            this.jdbcTemplate = new JdbcTemplate(this.dataSource);
        } catch (Exception e) {
            log.error("data provider init error", e);
            Exceptions.e(e);
        }
        this.init = true;
    }

    public boolean test(JdbcProperties properties) {
        BeanUtils.validate(properties);
        try {
            Class.forName(properties.getDriverClass());
        } catch (ClassNotFoundException e) {
            String errMsg = "Driver class not found " + properties.getDriverClass();
            log.error(errMsg, e);
            Exceptions.e(e);
        }
        try {
            DriverManager.getConnection(properties.getUrl(), properties.getUser(), properties.getPassword());
        } catch (SQLException sqlException) {
            Exceptions.e(sqlException);
        }
        return true;
    }

    public Set<String> readAllDatabases() throws SQLException {
        Set<String> databases = new HashSet<>();
        try (Connection conn = getConn()) {
            DatabaseMetaData metaData = conn.getMetaData();
            boolean isCatalog = isReadFromCatalog(conn);
            ResultSet rs = null;
            if (isCatalog) {
                rs = metaData.getCatalogs();
            } else {
                rs = metaData.getSchemas();
                log.info("Database 'catalogs' is empty, get databases with 'schemas'");
            }

            String currDatabase = readCurrDatabase(conn, isCatalog);
            if (StringUtils.isNotBlank(currDatabase)) {
                return Collections.singleton(currDatabase);
            }

            while (rs.next()) {
                String database = rs.getString(1);
                databases.add(database);
            }
            return databases;
        }
    }

    public Set<TableInfo> readAllTableInfos(String database) throws SQLException {
        try (Connection conn = getConn()) {
            DatabaseMetaData metadata = conn.getMetaData();
            Set tables = new HashSet<TableInfo>();
            try (ResultSet rs = metadata.getTables(database, conn.getSchema(), "%", new String[]{"TABLE", "VIEW"})) {
                while (rs.next()) {
                    String tableName = rs.getString(3);
                    String remarks = rs.getString(5);
                    tables.add(new TableInfo(tableName, remarks));
                }
            }
            return tables;
        }
    }

    protected String readCurrDatabase(Connection conn, boolean isCatalog) throws SQLException {
        return isCatalog ? conn.getCatalog() : conn.getSchema();
    }

    public Set<String> readAllTables(String database) throws SQLException {
        try (Connection conn = getConn()) {
            Set<String> tables = new HashSet<>();
            DatabaseMetaData metadata = conn.getMetaData();
            String catalog = null;
            String schema = null;
            if (isReadFromCatalog(conn)) {
                catalog = database;
                schema = conn.getSchema();
            } else {
                schema = database;
            }
            try (ResultSet rs = metadata.getTables(catalog, schema, "%", new String[]{"TABLE", "VIEW"})) {
                while (rs.next()) {
                    String tableName = rs.getString(3);
                    String remarks = rs.getString(5);
                    tables.add(String.format("%s%s",tableName,StringUtils.isNotBlank(remarks) ? "("+remarks+")" : ""));
                }
            }
            return tables;
        }
    }

    public Set<Column> readTableColumnInfo(String table) throws SQLException {
        try (Connection conn = getConn()) {
            HashMap<String, Column> columnMap = new HashMap<>();
            DatabaseMetaData metadata = conn.getMetaData();
            ResultSet columns = metadata.getColumns(conn.getCatalog(), null, table, null);
            Map<String, List<ForeignKey>> importedKeys = getImportedKeys(metadata, conn.getCatalog(), table);
            Set<String> primaryKeys = getPrimaryKeys(metadata, conn.getCatalog(), table);
            while (columns.next()) {
                Column column = readTableColumn(columns);
                column.setPrimaryKey(primaryKeys.contains(column.getName()));
                List<ForeignKey> foreignKeys = importedKeys.get(column.getName());
                column.setForeignKeys(foreignKeys);
//                columnMap.put(column.getName(), column);
            }
            return new HashSet<>(columnMap.values());
        }
    }

    public Set<Column> readTableColumnsBySql(String sql) throws SQLException {
        SqlRowSet rowSet = this.jdbcTemplate.queryForRowSet(sql);
        SqlRowSetMetaData metaData = rowSet.getMetaData();
        DatabaseMetaData databaseMetaData = this.jdbcTemplate.getDataSource().getConnection().getMetaData();
        int columnCount = metaData.getColumnCount();
        Set<Column> columns = new HashSet<>();
        for (int idx = 1; idx <= columnCount; idx++) {
            Column column = new Column();
            column.setName(metaData.getColumnName(idx));
            column.setComment(metaData.getColumnLabel(idx));
            column.setType(DataTypeUtils.jdbcType2DataType(metaData.getColumnType(5)));
            column.setTypeName(metaData.getColumnTypeName(idx));
            column.setLen(metaData.getPrecision(idx) > 0 ? metaData.getPrecision(idx) : null);
            column.setPrecision(metaData.getScale(idx) > 0 ? metaData.getScale(idx) : null);
            String tableName = metaData.getTableName(idx);
            String catalog = metaData.getCatalogName(idx);
            Map<String, List<ForeignKey>> importedKeys = getImportedKeys(databaseMetaData, catalog, tableName);
            Set<String> primaryKeys = getPrimaryKeys(databaseMetaData, catalog, tableName);
            List<ForeignKey> foreignKeys = importedKeys.get(column.getName());
            column.setForeignKeys(foreignKeys);
            column.setPrimaryKey(primaryKeys.contains(column.getName()));
            columns.add(column);
        }
        return columns;
    }

    protected boolean isReadFromCatalog(Connection conn) throws SQLException {
        return conn.getMetaData().getCatalogs().next();
    }

    public Set<Column> readTableColumn(String database, String table) throws SQLException {
        try (Connection conn = getConn()) {
            Set<Column> columnSet = new HashSet<>();
            DatabaseMetaData metadata = conn.getMetaData();
            Map<String, List<ForeignKey>> importedKeys = getImportedKeys(metadata, database, table);
            Set<String> primaryKeys = getPrimaryKeys(metadata, database, table);
            ResultSet columns = metadata.getColumns(database, null, table, null);
            while (columns.next()) {
                Column column = readTableColumn(columns);
                List<ForeignKey> foreignKeys = importedKeys.get(column.getName());
                column.setForeignKeys(foreignKeys);
                column.setPrimaryKey(primaryKeys.contains(column.getName()));
                columnSet.add(column);
            }
            return columnSet;
        }
    }


    public boolean callFunction(String function) throws SQLException {
        try (Connection conn = getConn()) {
            PreparedStatement statement = conn.prepareStatement(function);
            return statement.execute();
        }
    }

    public String getQueryKey(QueryScript script, ExecuteParam executeParam) throws SqlParseException {
        SqlScriptRender render = new SqlScriptRender(script, executeParam, getSqlDialect(), jdbcProperties.isEnableSpecialSql(), driverInfo.getQuoteIdentifiers());
        return "Q" + DigestUtils.md5Hex(render.render(true, supportPaging(), true) + ";includeColumns:" + JSON.toJSONString(executeParam.getIncludeColumns()) + ";viewId:" + script.getViewId() + ";pageInfo:" + JSON.toJSONString(executeParam.getPageInfo()));
    }

    protected Column readTableColumn(ResultSet columnMetadata) throws SQLException {
        Column column = new Column();
        column.setName(columnMetadata.getString(4));
        column.setComment(columnMetadata.getString("REMARKS"));
        column.setLen(columnMetadata.getInt("COLUMN_SIZE") > 0 ? columnMetadata.getInt("COLUMN_SIZE") : null);
        column.setPrecision(columnMetadata.getInt("DECIMAL_DIGITS") > 0 ? columnMetadata.getInt("DECIMAL_DIGITS") : null);
        column.setTypeName(columnMetadata.getString(6));
        column.setType(DataTypeUtils.jdbcType2DataType(columnMetadata.getInt(5)));
        return column;
    }


    /**
     * 获取表的外键关系
     */
    protected Set<String> getPrimaryKeys(DatabaseMetaData metadata, String database, String table) throws SQLException {
        HashMap<String, Set<String>> keyMap = new HashMap<>();
        ResultSet primaryKeys = metadata.getPrimaryKeys(database, null, table);
        Set<String> keys = new HashSet<>();
        while (primaryKeys.next()) {
            keys.add(primaryKeys.getString(COLUMN_NAME));
        }
        return keys;
    }

    /**
     * 获取表的外键关系
     */
    protected Map<String, List<ForeignKey>> getImportedKeys(DatabaseMetaData metadata, String database, String table) throws SQLException {
        HashMap<String, List<ForeignKey>> keyMap = new HashMap<>();
        try (ResultSet importedKeys = metadata.getImportedKeys(database, null, table)) {
            while (importedKeys.next()) {
                ForeignKey foreignKey = new ForeignKey();
                foreignKey.setDatabase(importedKeys.getString(PKTABLE_CAT));
                foreignKey.setTable(importedKeys.getString(PKTABLE_NAME));
                foreignKey.setColumn(importedKeys.getString(PKCOLUMN_NAME));
                keyMap.computeIfAbsent(importedKeys.getString(FKCOLUMN_NAME), key -> new ArrayList<>()).add(foreignKey);
            }
        } catch (SQLFeatureNotSupportedException e) {
            log.warn(e.getMessage());
        }
        return keyMap;
    }

    /**
     * 直接执行，返回所有数据，用于支持已经支持分页的数据库，或者不需要分页的查询。
     *
     * @param sql 直接提交至数据源执行的SQL，通常已经包含了分页
     * @return 全量数据
     * @throws SQLException SQL执行异常
     */
    protected Dataframe execute(String sql) throws SQLException {
        try (Connection conn = getConn()) {
            try (Statement statement = conn.createStatement()) {
                try (ResultSet rs = statement.executeQuery(sql)) {
                    return parseResultSet(rs);
                }
            }
        }
    }

    /**
     * 用于未支持SQL分页的数据库，使用通用的分页方案进行分页。
     *
     * @param selectSql 提交至数据源执行的SQL
     * @param pageInfo  需要执行的分页信息
     * @return 分页后的数据
     * @throws SQLException SQL执行异常
     */
    protected Dataframe execute(String selectSql, PageInfo pageInfo) throws SQLException {
        Dataframe dataframe;
        try (Connection conn = getConn()) {
            try (Statement statement = conn.createStatement()) {
                statement.setFetchSize((int) Math.min(pageInfo.getPageSize(), 10_000));
                try (ResultSet resultSet = statement.executeQuery(selectSql)) {
                    try {
                        resultSet.absolute((int) Math.min(pageInfo.getTotal(), (pageInfo.getPageNo() - 1) * pageInfo.getPageSize()));
                    } catch (Exception e) {
                        int count = 0;
                        while (count < (pageInfo.getPageNo() - 1) * pageInfo.getPageSize() && resultSet.next()) {
                            count++;
                        }
                    }
                    dataframe = parseResultSet(resultSet, pageInfo.getPageSize());
                    return dataframe;
                }
            }
        }
    }

    /**
     * 单独执行一次查询获取总数据量，用于分页
     *
     * @param sql 不包含分页的SQL
     * @return 总记录数
     */
    public int executeCountSql(String sql) throws SQLException {
        try (Connection connection = getConn()) {
            PreparedStatement preparedStatement = connection.prepareStatement(String.format(COUNT_SQL, sql));
            ResultSet resultSet = preparedStatement.executeQuery();
            resultSet.next();
            return resultSet.getInt(1);
        }
    }

    /**
     * 单独执行一次查询获取总数据量，用于分页
     *
     * @param sql 不包含分页的SQL
     * @return 总记录数
     */
    public boolean executeCreateSql(String sql) throws SQLException {
        try (Connection connection = getConn()) {
            Statement statement = connection.createStatement();
            int rows = statement.executeUpdate(sql);
            //ddl result 0
            return rows == 0;
        }
    }

    protected Connection getConn() throws SQLException {
        return dataSource.getConnection();
    }

    @Override
    public void close() {
        if (dataSource == null) {
            return;
        }
        JdbcDataProvider.getDataSourceFactory().destroy(dataSource);
    }

    public boolean supportPaging() {
        return driverInfo.supportSqlLimit() || (sqlDialect instanceof FetchAndOffsetSupport);
    }

    public SqlDialect getSqlDialect() {

        if (sqlDialect != null) {
            return sqlDialect;
        }
        if (StringUtils.isNotBlank(driverInfo.getSqlDialect())) {
            try {
                Class<?> clz = Class.forName(driverInfo.getSqlDialect());
                Class<?> superclass = clz.getSuperclass();
                if (superclass.equals(CustomSqlDialect.class)) {
                    Constructor<?> constructor = clz.getConstructor(JdbcDriverInfo.class);
                    sqlDialect = (CustomSqlDialect) constructor.newInstance(driverInfo);
                } else {
                    sqlDialect = (SqlDialect) clz.newInstance();
                }
            } catch (Exception ignored) {
                log.warn("Sql dialect " + driverInfo.getSqlDialect() + " not found, use default sql dialect");
            }
        }
        if (sqlDialect == null) {
            try {
                sqlDialect = getDefaultSqlDialect(driverInfo);
            } catch (Exception ignored) {
                log.warn("DBType " + driverInfo.getDbType() + " mismatched, use custom sql dialect");
                sqlDialect = new CustomSqlDialect(driverInfo);
            }
        }
        configSqlDialect(sqlDialect, driverInfo);
        return sqlDialect;
    }

    protected void configSqlDialect(SqlDialect sqlDialect, JdbcDriverInfo driverInfo) {
        try {
            Map<String, Object> fieldValues = new HashMap<>();
            // set identifierQuote
            if (StringUtils.isNotBlank(driverInfo.getIdentifierQuote())) {
                fieldValues.put("identifierQuoteString", driverInfo.getIdentifierQuote());
                fieldValues.put("identifierEndQuoteString", driverInfo.getIdentifierQuote());
                fieldValues.put("identifierEscapedQuote", driverInfo.getIdentifierQuote() + driverInfo.getIdentifierQuote());
            }
            if (StringUtils.isNotBlank(driverInfo.getIdentifierEndQuote())) {
                fieldValues.put("identifierEndQuoteString", driverInfo.getIdentifierEndQuote());
                fieldValues.put("identifierEscapedQuote", driverInfo.getIdentifierEndQuote() + driverInfo.getIdentifierEndQuote());
            }
            if (StringUtils.isNotBlank(driverInfo.getIdentifierEscapedQuote())) {
                fieldValues.put("identifierEscapedQuote", driverInfo.getIdentifierEscapedQuote());
            }
            // set default casing UNCHANGED
            fieldValues.put("unquotedCasing", Casing.UNCHANGED);
            fieldValues.put("quotedCasing", Casing.UNCHANGED);

            //set values
            for (Map.Entry<String, Object> entry : fieldValues.entrySet()) {
                ReflectUtils.setFiledValue(sqlDialect, entry.getKey(), entry.getValue());
            }
        } catch (Exception e) {
            log.warn("sql dialect config error for " + driverInfo.getSqlDialect());
        }
    }

    protected SqlDialect getDefaultSqlDialect(JdbcDriverInfo driverInfo) throws Exception {
        sqlDialect = SqlDialect.DatabaseProduct.valueOf(driverInfo.getDbType().toUpperCase()).getDialect();
        Class<? extends SqlDialect> dialectClass = sqlDialect.getClass();
        ClassPool classPool = ClassPool.getDefault();
        CtClass superClass = classPool.get(dialectClass.getName());
        CtClass ctClass = classPool.makeClass(dialectClass.getName().toLowerCase(Locale.ROOT) + ".Proxy", superClass);
        if (driverInfo.supportSqlLimit()) {
            ctClass.addMethod(CtMethod.make("    public void unparseOffsetFetch(org.apache.calcite.sql.SqlWriter writer, org.apache.calcite.sql.SqlNode offset, org.apache.calcite.sql.SqlNode fetch) {\n" +
                    "        unparseFetchUsingLimit(writer, offset, fetch);\n" +
                    "    }", ctClass));
        }
        Class<?> aClass = ctClass.toClass();
        Constructor<?> constructor = aClass.getConstructor(SqlDialect.Context.class);
        SqlDialect.Context context = ReflectUtils.getFieldValue(dialectClass, "DEFAULT_CONTEXT");
        return (SqlDialect) constructor.newInstance(context);
    }

    protected Dataframe parseResultSet(ResultSet rs) throws SQLException {
        return parseResultSet(rs, Long.MAX_VALUE);
    }

    protected Dataframe parseResultSet(ResultSet rs, long count) throws SQLException {
        Dataframe dataframe = new Dataframe();
        List<Column> columns = getColumns(rs);
        ArrayList<List<Object>> rows = new ArrayList<>();
        int c = 0;
        while (rs.next()) {
            ArrayList<Object> row = new ArrayList<>();
            rows.add(row);
            for (int i = 1; i < columns.size() + 1; i++) {
                row.add(getObjFromResultSet(rs, i));
            }
            c++;
            if (c >= count) {
                break;
            }
        }
        dataframe.setColumns(columns);
        dataframe.setRows(rows);
        return dataframe;
    }

    protected List<Column> getColumns(ResultSet rs) throws SQLException {
        ArrayList<Column> columns = new ArrayList<>();
        for (int i = 1; i <= rs.getMetaData().getColumnCount(); i++) {
            int columnType = rs.getMetaData().getColumnType(i);
            String columnName = rs.getMetaData().getColumnLabel(i);
            ValueType valueType = DataTypeUtils.jdbcType2DataType(columnType);
            columns.add(Column.of(valueType, columnName));
        }
        return columns;
    }

    /**
     * 本地执行，从数据源拉取全量数据，在本地执行聚合操作
     */
    public Dataframe executeInLocal(QueryScript script, ExecuteParam executeParam) throws Exception {

        List<SelectColumn> selectColumns = null;
        // 构建执行参数，查询源表全量数据
        if (!CollectionUtils.isEmpty(script.getSchema())) {
            selectColumns = script.getSchema().values().parallelStream().map(column -> {
                SelectColumn selectColumn = new SelectColumn();
                selectColumn.setColumn(column.getName());
                selectColumn.setAlias(column.columnKey());
                return selectColumn;
            }).collect(Collectors.toList());
        }
        ExecuteParam tempExecuteParam = ExecuteParam.builder()
                .columns(selectColumns)
                .concurrencyOptimize(true)
                .cacheEnable(executeParam.isCacheEnable())
                .cacheExpires(executeParam.getCacheExpires())
                .concurrencyOptimize(executeParam.isConcurrencyOptimize())
                .build();

        SqlScriptRender render = new SqlScriptRender(script
                , tempExecuteParam
                , getSqlDialect()
                , jdbcProperties.isEnableSpecialSql()
                , driverInfo.getQuoteIdentifiers());
        String sql = render.render(true, false, false);
        Dataframe data = execute(sql);

        if (!CollectionUtils.isEmpty(script.getSchema())) {
            for (Column column : data.getColumns()) {
                column.setType(script.getSchema().getOrDefault(column.columnKey(), column).getType());
            }
        }
        data.setName(script.toQueryKey());
        return LocalDB.executeLocalQuery(script, executeParam, data.splitByTable(script.getSchema()));
    }

    /**
     * 在数据源执行，组装完整SQL，提交至数据源执行
     */
    public Dataframe executeOnSource(QueryScript script, ExecuteParam executeParam) throws Exception {

        Dataframe dataframe;
        String sql;

        SqlScriptRender render = new SqlScriptRender(script
                , executeParam
                , getSqlDialect()
                , jdbcProperties.isEnableSpecialSql()
                , driverInfo.getQuoteIdentifiers());

        if (supportPaging()) {
            sql = render.render(true, true, false);
            log.debug(sql);
            dataframe = execute(sql);
        } else {
            sql = render.render(true, false, false);
            log.debug(sql);
            dataframe = execute(sql, executeParam.getPageInfo());
        }
        // fix page info
        if (executeParam.getPageInfo().isCountTotal()) {
            int total = executeCountSql(render.render(true, false, true));
            executeParam.getPageInfo().setTotal(total);
            dataframe.setPageInfo(executeParam.getPageInfo());
        }
        dataframe.setScript(sql);
        return dataframe;
    }

    protected Object getObjFromResultSet(ResultSet rs, int columnIndex) throws SQLException {
        Object obj = rs.getObject(columnIndex);
        if (obj instanceof Boolean) {
            obj = rs.getObject(columnIndex).toString();
        } else if (obj instanceof LocalDateTime) {
            obj = rs.getTimestamp(columnIndex);
        }
        return obj;
    }
}