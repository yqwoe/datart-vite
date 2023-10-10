package datart.core.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RelyJob implements Serializable {

    /**
     * 任务id
     */
     String jobId;

    /**
     * 父节点id
     */
     String taskId;


    /**
     * 执行批次
     */
     Integer batch;

    /**
     * 子任务
     */

     List<String> childIds = new ArrayList<>();
}
