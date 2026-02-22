import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "40px",
        }}
      >
        <span
          style={{
            color: "white",
            fontSize: 100,
            fontWeight: 800,
            fontFamily: "sans-serif",
          }}
        >
          H
        </span>
      </div>
    ),
    { ...size }
  );
}
