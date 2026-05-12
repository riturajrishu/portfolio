"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

const vertexShader = `
uniform float uTime;
uniform float uProgress;
uniform float uFlythrough;
uniform float uLightningFlash;
uniform float uNeonIntensity;
uniform float uSparkle;

attribute vec3 aRandomPosition;
attribute vec3 aSpherePosition;
attribute vec3 aTextPosition;
attribute float aSize;

varying vec3 vColor;
varying float vSparkle;

// Classic 3D noise for organic movement
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}

void main() {
    // Determine target position based on uProgress (0 = random, 1 = sphere, 2 = text)
    vec3 targetPos = aRandomPosition;
    
    // Add some noise to random position
    float noise = snoise(targetPos * 0.5 + uTime * 0.2);
    vec3 noisyRandom = aRandomPosition + noise * 2.0;

    if (uProgress < 1.0) {
        targetPos = mix(noisyRandom, aSpherePosition, uProgress);
    } else if (uProgress < 2.0) {
        // Elastic overshoot effect for text morphing
        float p = uProgress - 1.0;
        targetPos = mix(aSpherePosition, aTextPosition, p);
    } else {
        targetPos = aTextPosition;
    }

    // ── Lightning jolt effect ──
    // When lightning flashes, particles near random strike points get jolted
    if (uLightningFlash > 0.0) {
        // Create electric disturbance — particles jump along their normals
        float strikeNoise = snoise(targetPos * 3.0 + uTime * 10.0);
        float strikeInfluence = smoothstep(0.3, 1.0, strikeNoise) * uLightningFlash;
        
        // Radial electric arc — particles streak outward briefly (tamed to keep text readable)
        vec3 joltDir = normalize(targetPos + vec3(0.001));
        float joltScale = uProgress > 1.5 ? 0.15 : 0.5; // Much less jolt during text phase
        targetPos += joltDir * strikeInfluence * joltScale;
        
        // High-frequency vibration for electric feel
        float vibScale = uProgress > 1.5 ? 0.04 : 0.12;
        targetPos.x += sin(uTime * 50.0 + targetPos.y * 10.0) * uLightningFlash * vibScale;
        targetPos.y += cos(uTime * 50.0 + targetPos.x * 10.0) * uLightningFlash * vibScale;
    }

    // Flythrough explosion effect
    if (uFlythrough > 0.0) {
        // Explode outward along Z and slightly XY
        float explodeFactor = snoise(targetPos * 5.0) * 2.0 + 1.0;
        targetPos.x += targetPos.x * uFlythrough * explodeFactor * 5.0;
        targetPos.y += targetPos.y * uFlythrough * explodeFactor * 5.0;
        targetPos.z += uFlythrough * 30.0 * (explodeFactor);
    }

    // Add subtle ambient floating
    targetPos.y += sin(uTime + targetPos.x * 2.0) * 0.1;
    targetPos.x += cos(uTime + targetPos.y * 2.0) * 0.1;

    vec4 mvPosition = modelViewMatrix * vec4(targetPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Size attenuation
    gl_PointSize = aSize * (15.0 / -mvPosition.z);
    
    // Make particles massive when flying past the camera
    if(uFlythrough > 0.0) {
        gl_PointSize *= (1.0 + uFlythrough * 5.0); 
    }

    // ── Sparkle twinkle — random particles flicker bigger ──
    float sparkleHash = fract(sin(dot(targetPos.xy, vec2(12.9898, 78.233))) * 43758.5453);
    vSparkle = 0.0;
    if (uSparkle > 0.0) {
        // Only ~15% of particles sparkle at any given frame
        float sparklePhase = sin(uTime * 15.0 + sparkleHash * 6.283) * 0.5 + 0.5;
        float sparkleGate = step(0.85, sparkleHash * sparklePhase);
        vSparkle = sparkleGate * uSparkle;
        gl_PointSize *= (1.0 + vSparkle * 3.0);
    }

    // ── Lightning makes some particles flare up ──
    if (uLightningFlash > 0.0) {
        float flashInfluence = smoothstep(0.2, 0.8, snoise(targetPos * 4.0 + uTime * 8.0));
        gl_PointSize *= (1.0 + flashInfluence * uLightningFlash * 2.5);
    }

    // Colors: Electric Blue and Neon Purple based on position
    vec3 color1 = vec3(0.48, 0.22, 0.92); // Purple (#7c3aed)
    vec3 color2 = vec3(0.02, 0.71, 0.83); // Cyan (#06b6d4)
    vec3 color3 = vec3(0.23, 0.51, 0.96); // Blue (#3b82f6)

    float colorMix = sin(targetPos.x + targetPos.y + uTime) * 0.5 + 0.5;
    vColor = mix(mix(color1, color2, colorMix), color3, snoise(targetPos * 2.0) * 0.5 + 0.5);
    
    // Whiten up the core when forming the sphere — more intense electric white
    if (uProgress > 0.7 && uProgress < 1.3) {
        float glow = sin((uProgress - 0.7) * 3.14159 / 0.6);
        vColor = mix(vColor, vec3(0.8, 0.85, 1.0), glow * 0.95);
    }

    // ── Lightning flash — particles go electric white-blue ──
    if (uLightningFlash > 0.0) {
        vec3 lightningColor = vec3(0.7, 0.8, 1.0); // Electric white-blue
        float flashMix = uLightningFlash * smoothstep(0.0, 0.5, snoise(targetPos * 6.0 + uTime * 12.0) * 0.5 + 0.5);
        vColor = mix(vColor, lightningColor, flashMix);
    }

    // ── Neon intensity — cranks up color saturation and brightness during text phase ──
    if (uNeonIntensity > 0.0) {
        // Boost toward vivid neon purple/cyan
        vec3 neonPurple = vec3(0.65, 0.15, 1.0);
        vec3 neonCyan = vec3(0.0, 1.0, 0.9);
        float neonMix = sin(targetPos.x * 3.0 + uTime * 2.0) * 0.5 + 0.5;
        vec3 neonColor = mix(neonPurple, neonCyan, neonMix);
        vColor = mix(vColor, neonColor, uNeonIntensity * 0.6);
        // Add white-hot core to some particles
        vColor += vec3(1.0) * uNeonIntensity * 0.15;
    }
}
`;

const fragmentShader = `
varying vec3 vColor;
varying float vSparkle;
uniform float uFlythrough;
uniform float uLightningFlash;
uniform float uNeonIntensity;

void main() {
    // Make circular particles
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) discard;
    
    // Soft edges
    float alpha = 1.0 - (dist * 2.0);
    
    // ── Sparkle particles get a sharp star-like center ──
    if (vSparkle > 0.0) {
        // Create a 4-pointed star pattern
        vec2 uv = gl_PointCoord - 0.5;
        float star = max(
            1.0 - abs(uv.x) * 8.0 - abs(uv.y) * 2.0,
            1.0 - abs(uv.x) * 2.0 - abs(uv.y) * 8.0
        );
        star = max(star, 0.0);
        alpha = max(alpha, star * vSparkle);
    }

    // ── Lightning flash — boost overall brightness ──
    if (uLightningFlash > 0.0) {
        alpha = min(alpha + uLightningFlash * 0.3, 1.0);
    }

    // ── Neon glow — tighter, brighter core ──
    if (uNeonIntensity > 0.0) {
        float neonCore = smoothstep(0.5, 0.0, dist) * uNeonIntensity;
        alpha = min(alpha + neonCore * 0.4, 1.0);
    }

    // Fade out slightly during flythrough to prevent blinding the user completely
    if (uFlythrough > 0.5) {
        alpha *= 1.0 - ((uFlythrough - 0.5) * 2.0);
    }

    gl_FragColor = vec4(vColor, alpha * 0.85);
}
`;

export default function LoaderParticles({ onComplete }: { onComplete: () => void }) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Generate text particles using a 2D canvas
    const { count, randomPositions, spherePositions, textPositions, sizes } = useMemo(() => {
        if (!isClient) {
            return {
                count: 0,
                randomPositions: new Float32Array(0),
                spherePositions: new Float32Array(0),
                textPositions: new Float32Array(0),
                sizes: new Float32Array(0)
            };
        }

        const particleCount = 20000; // Optimal for both mobile & desktop
        const randomPos = new Float32Array(particleCount * 3);
        const spherePos = new Float32Array(particleCount * 3);
        const textPos = new Float32Array(particleCount * 3);
        const sizesArr = new Float32Array(particleCount);

        const isMobile = window.innerWidth < 768;
        const textScale = isMobile ? 0.011 : 0.045;
        const sphereRadius = isMobile ? 0.8 : 1.5;
        const randomSpread = isMobile ? 20 : 40;
        const sizeMultiplier = isMobile ? 0.6 : 1.0;
        const fontSize = isMobile ? 80 : 120;

        // 1. Generate Random Positions (Nebula)
        for (let i = 0; i < particleCount; i++) {
            randomPos[i * 3] = (Math.random() - 0.5) * randomSpread; // x
            randomPos[i * 3 + 1] = (Math.random() - 0.5) * randomSpread; // y
            randomPos[i * 3 + 2] = (Math.random() - 0.5) * randomSpread; // z
            sizesArr[i] = (Math.random() * 2.0 + 0.5) * sizeMultiplier; // Random size
        }

        // 2. Generate Sphere Positions (The Core)
        for (let i = 0; i < particleCount; i++) {
            const phi = Math.acos(-1 + (2 * i) / particleCount);
            const theta = Math.sqrt(particleCount * Math.PI) * phi;

            spherePos[i * 3] = sphereRadius * Math.cos(theta) * Math.sin(phi);
            spherePos[i * 3 + 1] = sphereRadius * Math.sin(theta) * Math.sin(phi);
            spherePos[i * 3 + 2] = sphereRadius * Math.cos(phi);
        }

        // 3. Generate Text Positions (<RR />)
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const w = 800;
        const h = 400;
        canvas.width = w;
        canvas.height = h;

        if (ctx) {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = "white";
            // Use system fonts for reliability
            ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            const lineGap = isMobile ? 45 : 60;
            ctx.fillText("RITU RAJ", w / 2, h / 2 - lineGap);
            ctx.fillText("  RISHU", w / 2, h / 2 + lineGap);

            const imageData = ctx.getImageData(0, 0, w, h).data;
            const validPixels = [];

            // Sample pixels (step determines density)
            for (let y = 0; y < h; y += 3) {
                for (let x = 0; x < w; x += 3) {
                    const index = (y * w + x) * 4;
                    if (imageData[index] > 128) { // If pixel is white
                        validPixels.push({ x: (x - w / 2) * textScale, y: -(y - h / 2) * textScale });
                    }
                }
            }

            // Map particles to valid pixels (with random noise to give it volume)
            for (let i = 0; i < particleCount; i++) {
                if (validPixels.length > 0) {
                    const pixel = validPixels[i % validPixels.length];
                    textPos[i * 3] = pixel.x + (Math.random() - 0.5) * (textScale * 3.0);
                    textPos[i * 3 + 1] = pixel.y + (Math.random() - 0.5) * (textScale * 3.0);
                    textPos[i * 3 + 2] = (Math.random() - 0.5) * (textScale * 6.0); // Give text some 3D depth
                } else {
                    textPos[i * 3] = spherePos[i * 3];
                    textPos[i * 3 + 1] = spherePos[i * 3 + 1];
                    textPos[i * 3 + 2] = spherePos[i * 3 + 2];
                }
            }
        }

        return {
            count: particleCount,
            randomPositions: randomPos,
            spherePositions: spherePos,
            textPositions: textPos,
            sizes: sizesArr
        };
    }, [isClient]);

    const materialRef = useRef<THREE.ShaderMaterial>(null);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    useEffect(() => {
        if (!materialRef.current || !isClient) return;

        // Reset timeline and uniforms when component mounts
        materialRef.current.uniforms.uProgress.value = 0;
        materialRef.current.uniforms.uFlythrough.value = 0;
        materialRef.current.uniforms.uLightningFlash.value = 0;
        materialRef.current.uniforms.uNeonIntensity.value = 0;
        materialRef.current.uniforms.uSparkle.value = 0;

        const mat = materialRef.current;
        const tl = gsap.timeline({ onComplete });

        // ══════════════════════════════════════════════════
        // PHASE 1 (0–2.5s): Electric Nebula Storm
        // Particles swirl inward to sphere with lightning strikes
        // ══════════════════════════════════════════════════
        tl.to(mat.uniforms.uProgress, {
            value: 1.0,
            duration: 2.5,
            ease: "power2.inOut"
        }, "0.3");

        // Lightning strike pulses during nebula phase
        // Strike 1
        tl.to(mat.uniforms.uLightningFlash, {
            value: 1.0, duration: 0.08, ease: "power4.in"
        }, "0.8");
        tl.to(mat.uniforms.uLightningFlash, {
            value: 0.0, duration: 0.25, ease: "power2.out"
        }, "0.88");
        // Strike 2
        tl.to(mat.uniforms.uLightningFlash, {
            value: 0.8, duration: 0.06, ease: "power4.in"
        }, "1.5");
        tl.to(mat.uniforms.uLightningFlash, {
            value: 0.0, duration: 0.2, ease: "power2.out"
        }, "1.56");
        // Strike 3 — big one right as sphere forms
        tl.to(mat.uniforms.uLightningFlash, {
            value: 1.0, duration: 0.05, ease: "power4.in"
        }, "2.4");
        tl.to(mat.uniforms.uLightningFlash, {
            value: 0.0, duration: 0.35, ease: "power2.out"
        }, "2.45");

        // ══════════════════════════════════════════════════
        // PHASE 2 (2.8–4.6s): Thunder Core → Text Morph
        // Sphere morphs to text with elastic snap
        // ══════════════════════════════════════════════════
        tl.to(mat.uniforms.uProgress, {
            value: 2.0,
            duration: 1.8,
            ease: "elastic.out(1, 0.7)"
        }, "3.0");

        // Lightning during core phase
        tl.to(mat.uniforms.uLightningFlash, {
            value: 0.6, duration: 0.06, ease: "power4.in"
        }, "3.2");
        tl.to(mat.uniforms.uLightningFlash, {
            value: 0.0, duration: 0.3, ease: "power2.out"
        }, "3.26");

        // ══════════════════════════════════════════════════
        // PHASE 3 (4.6–6.5s): Neon Text Reveal + Sparkles
        // Text glows with intense neon, sparkles scatter
        // ══════════════════════════════════════════════════
        tl.to(mat.uniforms.uNeonIntensity, {
            value: 1.0,
            duration: 0.8,
            ease: "power2.in"
        }, "4.6");

        tl.to(mat.uniforms.uSparkle, {
            value: 1.0,
            duration: 0.6,
            ease: "power1.in"
        }, "4.8");

        // Small electric flicker on the neon text
        tl.to(mat.uniforms.uLightningFlash, {
            value: 0.3, duration: 0.04, ease: "none"
        }, "5.2");
        tl.to(mat.uniforms.uLightningFlash, {
            value: 0.0, duration: 0.15, ease: "power1.out"
        }, "5.24");

        // ══════════════════════════════════════════════════
        // PHASE 4 (6.5–7.5s): Thunderclap Departure
        // Final flash + flythrough explosion
        // ══════════════════════════════════════════════════

        // Final thunder flash
        tl.to(mat.uniforms.uLightningFlash, {
            value: 1.0, duration: 0.06, ease: "power4.in"
        }, "6.3");
        tl.to(mat.uniforms.uLightningFlash, {
            value: 0.0, duration: 0.5, ease: "power2.out"
        }, "6.36");

        // Fade out sparkle and neon
        tl.to(mat.uniforms.uSparkle, {
            value: 0.0, duration: 0.4, ease: "power1.out"
        }, "6.4");
        tl.to(mat.uniforms.uNeonIntensity, {
            value: 0.0, duration: 0.5, ease: "power1.out"
        }, "6.4");

        // Flythrough explosion
        tl.to(mat.uniforms.uFlythrough, {
            value: 1.0,
            duration: 1.2,
            ease: "power3.in"
        }, "6.5");

        return () => {
            tl.kill();
        };
    }, [isClient, onComplete]);

    if (!isClient || count === 0) return null;

    return (
        <points>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[randomPositions, 3]}
                />
                <bufferAttribute
                    attach="attributes-aRandomPosition"
                    args={[randomPositions, 3]}
                />
                <bufferAttribute
                    attach="attributes-aSpherePosition"
                    args={[spherePositions, 3]}
                />
                <bufferAttribute
                    attach="attributes-aTextPosition"
                    args={[textPositions, 3]}
                />
                <bufferAttribute
                    attach="attributes-aSize"
                    args={[sizes, 1]}
                />
            </bufferGeometry>
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={{
                    uTime: { value: 0 },
                    uProgress: { value: 0 },
                    uFlythrough: { value: 0 },
                    uLightningFlash: { value: 0 },
                    uNeonIntensity: { value: 0 },
                    uSparkle: { value: 0 }
                }}
                transparent={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}
