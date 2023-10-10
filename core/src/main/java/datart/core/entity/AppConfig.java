package datart.core.entity;


import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class AppConfig extends BaseEntity {

    private String name;

    private String logoUrl;

    private String config;
}
