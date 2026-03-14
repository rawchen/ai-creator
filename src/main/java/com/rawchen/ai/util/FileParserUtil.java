package com.rawchen.ai.util;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.hwpf.HWPFDocument;
import org.apache.poi.hwpf.extractor.WordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

/**
 * 文件解析工具类
 */
public class FileParserUtil {

    /**
     * 根据文件类型提取文本内容
     *
     * @param inputStream 文件输入流
     * @param fileName    文件名
     * @return 提取的文本内容
     * @throws IOException IO异常
     */
    public static String extractText(InputStream inputStream, String fileName) throws IOException {
        String extension = getFileExtension(fileName).toLowerCase();

        switch (extension) {
            case "txt":
                return extractFromTxt(inputStream);
            case "doc":
                return extractFromDoc(inputStream);
            case "docx":
                return extractFromDocx(inputStream);
            case "pdf":
                return extractFromPdf(inputStream);
            default:
                throw new UnsupportedOperationException("不支持的文件类型: " + extension);
        }
    }

    /**
     * 从txt文件提取文本
     */
    private static String extractFromTxt(InputStream inputStream) throws IOException {
        StringBuilder content = new StringBuilder();
        byte[] buffer = new byte[1024];
        int bytesRead;

        while ((bytesRead = inputStream.read(buffer)) != -1) {
            content.append(new String(buffer, 0, bytesRead, "UTF-8"));
        }

        return content.toString();
    }

    /**
     * 从doc文件提取文本
     */
    private static String extractFromDoc(InputStream inputStream) throws IOException {
        HWPFDocument document = new HWPFDocument(inputStream);
        WordExtractor extractor = new WordExtractor(document);
        String text = extractor.getText();
        extractor.close();
        document.close();
        return text;
    }

    /**
     * 从docx文件提取文本
     */
    private static String extractFromDocx(InputStream inputStream) throws IOException {
        XWPFDocument document = new XWPFDocument(inputStream);
        List<XWPFParagraph> paragraphs = document.getParagraphs();
        StringBuilder content = new StringBuilder();

        for (XWPFParagraph paragraph : paragraphs) {
            content.append(paragraph.getText()).append("\n");
        }

        document.close();
        return content.toString();
    }

    /**
     * 从pdf文件提取文本
     */
    private static String extractFromPdf(InputStream inputStream) throws IOException {
        PDDocument document = PDDocument.load(inputStream);
        PDFTextStripper stripper = new PDFTextStripper();
        String text = stripper.getText(document);
        document.close();
        return text;
    }

    /**
     * 获取文件扩展名
     */
    private static String getFileExtension(String fileName) {
        int lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex > 0 && lastDotIndex < fileName.length() - 1) {
            return fileName.substring(lastDotIndex + 1);
        }
        return "";
    }
}
