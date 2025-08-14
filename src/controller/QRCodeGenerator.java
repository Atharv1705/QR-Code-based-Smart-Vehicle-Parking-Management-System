package controller;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import java.nio.file.Path;

import com.google.zxing.BinaryBitmap;
import com.google.zxing.LuminanceSource;
import com.google.zxing.Result;
import com.google.zxing.client.j2se.BufferedImageLuminanceSource;
import com.google.zxing.common.HybridBinarizer;
import com.google.zxing.qrcode.QRCodeReader;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;

public class QRCodeGenerator {
    // Generate QR code with custom size
    public static void generateQRCode(String data, String filePath, int width, int height) throws Exception {
        try {
            BitMatrix matrix = new MultiFormatWriter().encode(data, BarcodeFormat.QR_CODE, width, height);
            Path path = java.nio.file.FileSystems.getDefault().getPath(filePath);
            MatrixToImageWriter.writeToPath(matrix, "PNG", path);
        } catch (Exception e) {
            throw new Exception("Failed to generate QR code: " + e.getMessage(), e);
        }
    }

    // Overload for default size
    public static void generateQRCode(String data, String filePath) throws Exception {
        generateQRCode(data, filePath, 200, 200);
    }

    // Read QR code from image file
    public static String readQRCode(String filePath) throws Exception {
        try {
            BufferedImage bufferedImage = ImageIO.read(new java.io.File(filePath));
            LuminanceSource source = new BufferedImageLuminanceSource(bufferedImage);
            BinaryBitmap bitmap = new BinaryBitmap(new HybridBinarizer(source));
            Result result = new QRCodeReader().decode(bitmap);
            return result.getText();
        } catch (Exception e) {
            throw new Exception("Failed to read QR code: " + e.getMessage(), e);
        }
    }
}
