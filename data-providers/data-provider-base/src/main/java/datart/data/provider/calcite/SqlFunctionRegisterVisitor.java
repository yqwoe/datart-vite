package datart.data.provider.calcite;

import org.apache.calcite.sql.*;
import org.apache.calcite.sql.fun.SqlStdOperatorTable;
import org.apache.calcite.sql.util.SqlBasicVisitor;
import org.apache.calcite.sql.validate.SqlNameMatchers;

import java.util.LinkedList;

public class SqlFunctionRegisterVisitor extends SqlBasicVisitor<Object> {

    @Override
    public Object visit(SqlCall call) {
        SqlOperator operator = call.getOperator();
        if (operator instanceof SqlFunction) {
            registerIfNotExists((SqlFunction) operator);
        }
        return operator.acceptCall(this, call);
    }

    private void registerIfNotExists(SqlFunction sqlFunction) {
        SqlStdOperatorTable opTab = SqlStdOperatorTable.instance();
        LinkedList<SqlOperator> list = new LinkedList<>();
        // built-in functions have no identifier and no registration required
        if (sqlFunction.getSqlIdentifier() == null) {
            return;
        }
        opTab.lookupOperatorOverloads(sqlFunction.getSqlIdentifier(), null, SqlSyntax.FUNCTION, list,
                SqlNameMatchers.withCaseSensitive(sqlFunction.getSqlIdentifier().isComponentQuoted(0)));
        if (list.size() > 0) {
            return;
        }
        opTab.register(sqlFunction);
    }

}
