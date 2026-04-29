import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Ritu Raj — Full Stack Developer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#030014",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: "-10%",
            width: "50%",
            height: "50%",
            background: "rgba(124, 58, 237, 0.3)",
            filter: "blur(120px)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-20%",
            right: "-10%",
            width: "50%",
            height: "50%",
            background: "rgba(6, 182, 212, 0.2)",
            filter: "blur(120px)",
            borderRadius: "50%",
          }}
        />
        
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 100,
            fontWeight: "bold",
            marginBottom: 30,
            letterSpacing: "-0.05em",
          }}
        >
          <span style={{ color: "white" }}>Ritu</span>
          <span style={{ color: "#a78bfa", marginLeft: 15 }}>Raj.</span>
        </div>
        
        <div
          style={{
            fontSize: 42,
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: "70%",
            lineHeight: 1.4,
            fontWeight: 300,
          }}
        >
          Full Stack Developer crafting premium digital experiences with modern technologies.
        </div>
        
        <div
          style={{
            display: "flex",
            marginTop: 80,
            gap: 20,
          }}
        >
          {["React", "Next.js", "Node.js", "Three.js"].map((tech) => (
            <div
              key={tech}
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(124, 58, 237, 0.3)",
                color: "#f1f5f9",
                padding: "16px 32px",
                borderRadius: 50,
                fontSize: 24,
                fontWeight: 500,
              }}
            >
              {tech}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
