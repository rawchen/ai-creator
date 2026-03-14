package com.rawchen.ai.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.experimental.Accessors;

import java.time.LocalDateTime;

/**
 * 标题建议实体
 */
@Data
@TableName("title_suggestions")
@Accessors(chain = true)
public class TitleSuggestion {

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
     * 内容类型
     */
    private String contentType;

    /**
     * 建议的标题列表（JSON格式）
     */
    private String suggestedTitles;

    /**
     * 使用的关键词（JSON数组字符串）
     */
    private String keywordsUsed;

    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
