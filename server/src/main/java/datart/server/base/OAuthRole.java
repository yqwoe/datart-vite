package datart.server.base;


import lombok.Data;

import java.io.Serializable;

@Data
public class OAuthRole implements Serializable {
    private String id;
    private String name;
    private String remark;
}
