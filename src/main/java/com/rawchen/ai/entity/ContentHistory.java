package com.rawchen.ai.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.experimental.Accessors;

import java.time.LocalDateTime;

/**
 * 内容历史记录实体
 */
@Data
@TableName("content_history")
@Accessors(chain = true)
public class ContentHistory {

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
     * 内容类型：小红书文案、微信公众号文章
     */
    private String contentType;

    /**
     * 标题
     */
    private String title;

    /**
     * 生成的内容
     */
    private String generatedContent;

    /**
     * AI模型：deepseek、kimi
     */
    private String aiModel;

    /**
     * 使用的提示词
     */
    private String promptUsed;

    /**
     * 反馈内容
     */
    private String feedback;

    /**
     * 评分：1-好评，-1-差评，null-未评分
     */
    private Integer rating;

    /**
     * 是否已导出
     */
    private Boolean isExported;

    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
