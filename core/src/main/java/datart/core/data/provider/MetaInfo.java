package datart.core.data.provider;


import lombok.Data;

import java.io.Serializable;

@Data
public class MetaInfo  implements Serializable {

    private String name;

    private String value;

    private Integer len;

    private Integer precision;

    @Override
    public String toString(){
        StringBuilder s = new StringBuilder();
        s.append(value);
        if(null != len){
            s.append("(");
            s.append(len);
        }
        if(null != len && null != precision){

            s.append(",");
            s.append(precision);
        }

        if(null != len || null != precision){
            s.append(")");
        }

        return s.toString();
    }
}
