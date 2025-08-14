import React, { useRef, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function QRScanner({ onScan }) {
  const scannerRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      false
    );
    scanner.render(onScan, () => {});
    return () => scanner.clear();
  }, [onScan]);

  return <div id="qr-reader" style={{ width: 300, margin: "auto" }} />;
}
