package com.rawchen.ai.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.rawchen.ai.entity.ContentHistory;
import com.rawchen.ai.entity.ContentPreference;
import com.rawchen.ai.service.AiContentService;
import com.rawchen.ai.service.ContentHistoryService;
import com.rawchen.ai.service.ContentPreferenceService;
import com.rawchen.ai.service.UploadedFileService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

/**
 * AI内容生成Controller
 */
@Slf4j
@RestController
@RequestMapping("/api")
@CrossOrigin
public class AiContentController {

    @Autowired
    private AiContentService aiContentService;

    @Autowired
    private ContentHistoryService contentHistoryService;

    @Autowired
    private ContentPreferenceService contentPreferenceService;

    @Autowired
    private UploadedFileService uploadedFileService;

    /**
     * 生成标题建议
     */
    @PostMapping("/generate-titles")
    public Map<String, Object> generateTitles(@RequestBody Map<String, Object> params) {
        try {
            String topic = (String) params.get("topic");
            String contentType = (String) params.get("contentType");
            String sessionId = (String) params.get("sessionId");
            JSONObject userPreferences = params.containsKey("userPreferences")
                    ? JSON.parseObject(JSON.toJSONString(params.get("userPreferences"))) : null;
            String keywords = params.containsKey("keywords") ? JSON.toJSONString(params.get("keywords")) : null;

            JSONObject result = aiContentService.generateTitles(topic, contentType, sessionId, userPreferences, keywords);
            return success(result);
        } catch (Exception e) {
            log.error("生成标题失败", e);
            return error(e.getMessage());
        }
    }

    /**
     * 生成内容
     */
    @PostMapping("/generate-content")
    public Map<String, Object> generateContent(@RequestBody Map<String, Object> params) {
        try {
            String title = (String) params.get("title");
            String requirements = (String) params.get("requirements");
            String contentType = (String) params.get("contentType");
            String aiModel = (String) params.get("aiModel");
            String sessionId = (String) params.get("sessionId");
            JSONObject userPreferences = params.containsKey("userPreferences")
                    ? JSON.parseObject(JSON.toJSONString(params.get("userPreferences"))) : null;
            String targetLength = (String) params.get("targetLength");

            JSONObject result = aiContentService.generateContent(title, requirements, contentType, aiModel, sessionId, userPreferences, targetLength);
            return success(result);
        } catch (Exception e) {
            log.error("生成内容失败", e);
            return error(e.getMessage());
        }
    }

    /**
     * 上传文件
     */
    @PostMapping("/upload-file")
    public Map<String, Object> uploadFile(@RequestParam("file") MultipartFile file,
                                          @RequestParam("sessionId") String sessionId) {
        try {
            // 提取文件内容
            String extractedContent = "";
            try (InputStream inputStream = file.getInputStream()) {
                extractedContent = com.rawchen.ai.util.FileParserUtil.extractText(inputStream, file.getOriginalFilename());
            } catch (UnsupportedOperationException e) {
                log.warn("文件类型不支持，将只保存基本信息: {}", e.getMessage());
                extractedContent = "不支持的文件类型，无法提取内容";
            }

            // 保存文件记录到数据库
            com.rawchen.ai.entity.UploadedFile uploadedFile = new com.rawchen.ai.entity.UploadedFile();
            uploadedFile.setSessionId(sessionId);
            uploadedFile.setFileName(file.getOriginalFilename());
            uploadedFile.setFileSize(file.getSize());
            uploadedFile.setFileType(file.getContentType());
            uploadedFile.setExtractedContent(extractedContent);
            uploadedFile.setFileUrl(""); // 文件URL暂时为空，如需要可以配置文件存储服务

            boolean saved = uploadedFileService.save(uploadedFile);

            if (!saved) {
                return error("文件记录保存失败");
            }

            // 返回文件信息
            Map<String, Object> fileInfo = new HashMap<>();
            fileInfo.put("fileId", uploadedFile.getId());
            fileInfo.put("fileName", uploadedFile.getFileName());
            fileInfo.put("fileSize", uploadedFile.getFileSize());
            fileInfo.put("fileType", uploadedFile.getFileType());
            fileInfo.put("extractedContent", uploadedFile.getExtractedContent());
            fileInfo.put("createdAt", uploadedFile.getCreatedAt());

            Map<String, Object> result = new HashMap<>();
            result.put("data", fileInfo);
            return success(result);
        } catch (IOException e) {
            log.error("文件上传失败", e);
            return error(e.getMessage());
        } catch (Exception e) {
            log.error("文件上传处理失败", e);
            return error(e.getMessage());
        }
    }

    /**
     * 分析文件
     */
    @PostMapping("/analyze-file")
    public Map<String, Object> analyzeFile(@RequestBody Map<String, Object> params) {
        try {
            String fileContent = (String) params.get("fileContent");
            String sessionId = (String) params.get("sessionId");
            String fileId = params.containsKey("fileId") ? String.valueOf(params.get("fileId")) : null;

            JSONObject result = aiContentService.analyzeFile(fileContent, sessionId, fileId);
            return success(result);
        } catch (Exception e) {
            log.error("分析文件失败", e);
            return error(e.getMessage());
        }
    }

    /**
     * 分析IP
     */
    @PostMapping("/analyze-ip")
    public Map<String, Object> analyzeIP(@RequestBody Map<String, Object> params) {
        try {
            String ipName = (String) params.get("ipName");
            String sessionId = (String) params.get("sessionId");

            JSONObject result = aiContentService.analyzeIP(ipName, sessionId);
            return success(result);
        } catch (Exception e) {
            log.error("分析IP失败", e);
            return error(e.getMessage());
        }
    }

    /**
     * 获取历史记录列表
     */
    @GetMapping("/content-history")
    public Map<String, Object> getContentHistory(@RequestParam String sessionId) {
        try {
            return success(contentHistoryService.getBySessionId(sessionId));
        } catch (Exception e) {
            log.error("获取历史记录失败", e);
            return error(e.getMessage());
        }
    }

    /**
     * 获取最近的历史记录
     */
    @GetMapping("/content-history/recent")
    public Map<String, Object> getRecentContentHistory(@RequestParam String sessionId,
                                                       @RequestParam(defaultValue = "5") Integer limit) {
        try {
            return success(contentHistoryService.getRecentBySessionId(sessionId, limit));
        } catch (Exception e) {
            log.error("获取历史记录失败", e);
            return error(e.getMessage());
        }
    }

    /**
     * 更新历史记录评分
     */
    @PutMapping("/content-history/{id}/rating")
    public Map<String, Object> updateRating(@PathVariable Long id, @RequestBody Map<String, Object> params) {
        try {
            ContentHistory history = contentHistoryService.getById(id);
            if (history != null) {
                history.setRating((Integer) params.get("rating"));
                contentHistoryService.updateById(history);
            }
            return success(null);
        } catch (Exception e) {
            log.error("更新评分失败", e);
            return error(e.getMessage());
        }
    }

    /**
     * 删除历史记录
     */
    @DeleteMapping("/content-history/{id}")
    public Map<String, Object> deleteContentHistory(@PathVariable Long id) {
        try {
            contentHistoryService.removeById(id);
            return success(null);
        } catch (Exception e) {
            log.error("删除历史记录失败", e);
            return error(e.getMessage());
        }
    }

    /**
     * 标记为已导出
     */
    @PutMapping("/content-history/{id}/export")
    public Map<String, Object> markAsExported(@PathVariable Long id) {
        try {
            ContentHistory history = contentHistoryService.getById(id);
            if (history != null) {
                history.setIsExported(true);
                contentHistoryService.updateById(history);
            }
            return success(null);
        } catch (Exception e) {
            log.error("标记导出失败", e);
            return error(e.getMessage());
        }
    }

    /**
     * 获取偏好设置
     */
    @GetMapping("/content-preferences")
    public Map<String, Object> getContentPreferences(@RequestParam String sessionId) {
        try {
            ContentPreference preference = contentPreferenceService.getBySessionId(sessionId);
            return success(preference);
        } catch (Exception e) {
            log.error("获取偏好设置失败", e);
            return error(e.getMessage());
        }
    }

    /**
     * 保存偏好设置
     */
    @PostMapping("/content-preferences")
    public Map<String, Object> saveContentPreferences(@RequestBody Map<String, Object> params) {
        try {
            ContentPreference preference = new ContentPreference();
            preference.setSessionId((String) params.get("session_id"));
            preference.setUserStyle(params.containsKey("user_style") ? JSON.toJSONString(params.get("user_style")) : null);
            preference.setKeywords(params.containsKey("keywords") ? JSON.toJSONString(params.get("keywords")) : null);
            preference.setWritingTone((String) params.get("writing_tone"));
            preference.setContentStructure(params.containsKey("content_structure") ? JSON.toJSONString(params.get("content_structure")) : null);
            preference.setPreferredLength((String) params.get("preferred_length"));
            preference.setTargetAudience((String) params.get("target_audience"));

            contentPreferenceService.saveOrUpdate(preference);
            return success(preference);
        } catch (Exception e) {
            log.error("保存偏好设置失败", e);
            return error(e.getMessage());
        }
    }

    private Map<String, Object> success(Object data) {
        Map<String, Object> result = new HashMap<>();
        result.put("code", 200);
        result.put("message", "success");
        result.put("data", data);
        return result;
    }

    private Map<String, Object> error(String message) {
        Map<String, Object> result = new HashMap<>();
        result.put("code", 500);
        result.put("message", message);
        return result;
    }
}
