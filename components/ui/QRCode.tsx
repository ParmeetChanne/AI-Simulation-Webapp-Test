'use client';

import { QRCodeSVG } from 'qrcode.react';

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

export default function QRCode({ value, size = 200, className = '' }: QRCodeProps) {
  return (
    <div className={`flex items-center justify-center p-4 bg-white rounded-lg ${className}`}>
      <QRCodeSVG
        value={value}
        size={size}
        level="M"
        includeMargin={false}
        fgColor="#1e293b"
        bgColor="#ffffff"
      />
    </div>
  );
}
