import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { 
  TextField, 
  Box, 
  Typography, 
  Card, 
  CardContent,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Download, Print, Share } from "@mui/icons-material";

export default function QRCodeGen({ plateNumber: propPlateNumber }) {
  const [text, setText] = useState(propPlateNumber || "");

  useEffect(() => {
    if (propPlateNumber) {
      setText(propPlateNumber);
    }
  }, [propPlateNumber]);

  const downloadQR = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL();
      const link = document.createElement('a');
      link.download = `qr-code-${text}.png`;
      link.href = url;
      link.click();
    }
  };

  const printQR = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const dataUrl = canvas.toDataURL();
      const windowContent = `
        <html>
          <head><title>QR Code - ${text}</title></head>
          <body style="text-align: center; font-family: Arial, sans-serif;">
            <h2>Vehicle QR Code</h2>
            <p><strong>Plate Number:</strong> ${text}</p>
            <img src="${dataUrl}" style="max-width: 300px;" />
            <p style="margin-top: 20px; font-size: 12px; color: #666;">
              Generated on ${new Date().toLocaleString()}
            </p>
          </body>
        </html>
      `;
      const printWindow = window.open('', '', 'width=600,height=600');
      printWindow.document.open();
      printWindow.document.write(windowContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  const shareQR = async () => {
    const canvas = document.querySelector('canvas');
    if (canvas && navigator.share) {
      try {
        canvas.toBlob(async (blob) => {
          const file = new File([blob], `qr-code-${text}.png`, { type: 'image/png' });
          await navigator.share({
            title: `QR Code for ${text}`,
            text: `QR Code for vehicle ${text}`,
            files: [file],
          });
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  return (
    <Card sx={{ maxWidth: 400, mx: "auto", mt: 2, width: "100%" }}>
      <CardContent sx={{ textAlign: "center", p: { xs: 2, sm: 3 } }}>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          QR Code Generator
        </Typography>
        
        {!propPlateNumber && (
          <TextField
            label="Vehicle Plate Number"
            value={text}
            onChange={(e) => setText(e.target.value.toUpperCase())}
            fullWidth
            margin="normal"
            placeholder="e.g., ABC123"
            size="small"
          />
        )}
        
        {text && (
          <Box sx={{ mt: { xs: 2, sm: 3 } }}>
            <Box sx={{ 
              display: "inline-block", 
              p: 2, 
              bgcolor: "white", 
              borderRadius: 2,
              boxShadow: 2,
              mb: 2
            }}>
              <QRCodeCanvas 
                value={text} 
                size={200}
                level="M"
                includeMargin={true}
              />
            </Box>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Plate Number: <strong>{text}</strong>
            </Typography>
            
            <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 2 }}>
              <Tooltip title="Download QR Code">
                <IconButton onClick={downloadQR} color="primary">
                  <Download />
                </IconButton>
              </Tooltip>
              <Tooltip title="Print QR Code">
                <IconButton onClick={printQR} color="primary">
                  <Print />
                </IconButton>
              </Tooltip>
              {navigator.share && (
                <Tooltip title="Share QR Code">
                  <IconButton onClick={shareQR} color="primary">
                    <Share />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
        )}
        
        {!text && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Enter a plate number to generate QR code
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
