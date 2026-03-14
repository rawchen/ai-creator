package com.rawchen.ai.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.experimental.Accessors;

import java.time.LocalDateTime;

/**
 * 内容偏好设置实体
 */
@Data
@TableName("content_preferences")
@Accessors(chain = true)
public class ContentPreference {

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
     * 用户风格（JSON格式）
     */
    private String userStyle;

    /**
     * 关键词（JSON数组字符串）
     */
    private String keywords;

    /**
     * 写作语调
     */
    private String writingTone;

    /**
     * 内容结构（JSON格式）
     */
    private String contentStructure;

    /**
     * 偏好长度
     */
    private String preferredLength;

    /**
     * 目标受众
     */
    private String targetAudience;

    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
