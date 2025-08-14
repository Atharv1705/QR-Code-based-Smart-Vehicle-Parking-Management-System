import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { TextField, Box } from "@mui/material";

export default function QRCodeGen() {
  const [text, setText] = useState("");
  return (
    <Box sx={{ textAlign: "center", mt: 4 }}>
      <TextField
        label="Plate Number"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Box sx={{ mt: 2 }}>
        {text && <QRCodeCanvas value={text} size={200} />}
      </Box>
    </Box>
  );
}
