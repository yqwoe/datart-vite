package datart.server.base.params;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class MetaBaseUpdateParam extends BaseUpdateParam {

    private String name;

    private String parentId;

    private Double index;

}
