import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: "96px",
        }}
      >
        <span
          style={{
            color: "white",
            fontSize: 280,
            fontWeight: 800,
            fontFamily: "sans-serif",
            letterSpacing: "-8px",
          }}
        >
          H
        </span>
      </div>
    ),
    { ...size }
  );
}
