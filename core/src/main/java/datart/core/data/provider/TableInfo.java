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

package datart.core.data.provider;

import lombok.Data;

import java.io.Serializable;
import java.util.Set;

@Data
public class TableInfo implements Serializable {


    private String name;

    private Set<String> primaryKeys;

    private String tableName;

    private String comment;

    private Set<Column> columns;


    public TableInfo(String name,String comment) {
        this.name = name;
        this.comment = comment;
        this.tableName = name;
    }

    public TableInfo(String name,String comment, Set<String> primaryKeys) {
        this.name = name;
        this.comment = comment;
        this.primaryKeys = primaryKeys;
        this.tableName = name;
    }

    public TableInfo(String name,String comment, Set<String> primaryKeys,Set<Column> columns) {
        this.name = name;
        this.comment = comment;
        this.primaryKeys = primaryKeys;
        this.columns = columns;
        this.tableName = name;
    }

    public TableInfo() {
    }
}
