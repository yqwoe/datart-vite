package datart.server.base.params;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class DataMappingCreateParam extends BaseCreateParam{

    private String name;

    private String orgId;

    private String config;

    private String parentId;

    private Boolean isFolder;

    private Integer index;

}
