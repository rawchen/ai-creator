package com.rawchen.ai.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.experimental.Accessors;

import java.time.LocalDateTime;

/**
 * IP分析结果实体
 */
@Data
@TableName("ip_analysis")
@Accessors(chain = true)
public class IpAnalysis {

    /**
     * 主键ID
     */
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 会话ID
     */
    private String sessionId;

    /**
     * IP名称
     */
    private String ipName;

    /**
     * 分析结果（JSON格式）
     */
    private String analysisResult;

    /**
     * 风格总结
     */
    private String styleSummary;

    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
