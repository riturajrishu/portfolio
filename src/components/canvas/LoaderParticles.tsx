"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

const vertexShader = `
uniform float uTime;
uniform float uProgress;
uniform float uFlythrough;
uniform float uPulseFlash;
uniform float uNeonIntensity;
uniform float uSparkle;
uniform float uGravity;
uniform float uShockwave;
uniform float uPlasmaHeat;
uniform float uWarpSpeed;

attribute vec3 aRandomPosition;
attribute vec3 aSpherePosition;
attribute vec3 aTextPosition;
attribute float aSize;

varying vec3 vColor;
varying float vSparkle;
varying float vDistFromCenter;
varying float vYPos;

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
        float p = uProgress - 1.0;
        targetPos = mix(aSpherePosition, aTextPosition, p);
    } else {
        targetPos = aTextPosition;
    }

    // ── Spiral Galaxy Vortex (Phase 1) ──
    // When uGravity > 0, particles spiral inward like a galaxy
    if (uGravity > 0.0) {
        vec3 toCenter = -targetPos;
        float radius = length(targetPos.xz);
        float angle = atan(targetPos.z, targetPos.x);
        
        // Logarithmic spiral arms — particles rotate faster as they get closer
        float spiralSpeed = uGravity * 3.0;
        float spiralAngle = angle + spiralSpeed * (1.0 / (radius + 0.5)) + uTime * 0.8;
        
        // Compress into disk shape (flatten Y)
        float diskFlatten = uGravity * 0.7;
        targetPos.y *= (1.0 - diskFlatten);
        
        // Rotate in spiral
        float cosA = cos(spiralAngle - angle);
        float sinA = sin(spiralAngle - angle);
        float newX = targetPos.x * cosA - targetPos.z * sinA;
        float newZ = targetPos.x * sinA + targetPos.z * cosA;
        targetPos.x = newX;
        targetPos.z = newZ;
        
        // Gravitational pull — accelerate toward center
        float pullStrength = uGravity * uGravity * 0.3;
        targetPos.xz += toCenter.xz * pullStrength;
        
        // Add orbital turbulence
        float turbulence = snoise(targetPos * 2.0 + uTime * 1.5) * 0.3 * uGravity;
        targetPos.x += turbulence;
        targetPos.z += turbulence * 0.7;
    }

    // ── Gravitational Wave Pulses ──
    // Concentric ripple displacement instead of random lightning jolt
    if (uPulseFlash > 0.0) {
        float dist = length(targetPos);
        // Create concentric wave rings emanating from center
        float wavePhase = dist * 3.0 - uTime * 12.0;
        float wave = sin(wavePhase) * 0.5 + 0.5;
        wave = pow(wave, 4.0); // sharpen the rings
        
        vec3 radialDir = normalize(targetPos + vec3(0.001));
        float pulseScale = uProgress > 1.5 ? 0.12 : 0.4;
        targetPos += radialDir * wave * uPulseFlash * pulseScale;
        
        // Subtle vibration for energy feel
        float vibScale = uProgress > 1.5 ? 0.03 : 0.08;
        targetPos.x += sin(uTime * 40.0 + targetPos.y * 8.0) * uPulseFlash * vibScale;
        targetPos.y += cos(uTime * 40.0 + targetPos.x * 8.0) * uPulseFlash * vibScale;
    }

    // ── Supernova Shockwave ──
    // Expanding ring that blasts particles outward at the wavefront
    if (uShockwave > 0.0) {
        float dist = length(targetPos);
        float waveFront = uShockwave;
        float waveWidth = 2.5;
        
        // Particles near the wavefront get displaced outward
        float proximity = 1.0 - smoothstep(0.0, waveWidth, abs(dist - waveFront));
        vec3 outwardDir = normalize(targetPos + vec3(0.001));
        targetPos += outwardDir * proximity * 1.8;
    }

    // ── Warp Speed Star Trails ──
    // Stretch particles along Z before flythrough
    if (uWarpSpeed > 0.0) {
        // Stretch along Z axis — creates star trail effect
        float stretchFactor = uWarpSpeed * 8.0;
        targetPos.z += targetPos.z * stretchFactor;
        // Slight XY compression for tunnel feel
        targetPos.x *= (1.0 - uWarpSpeed * 0.3);
        targetPos.y *= (1.0 - uWarpSpeed * 0.3);
    }

    // Flythrough explosion effect
    if (uFlythrough > 0.0) {
        float explodeFactor = snoise(targetPos * 5.0) * 2.0 + 1.0;
        targetPos.x += targetPos.x * uFlythrough * explodeFactor * 5.0;
        targetPos.y += targetPos.y * uFlythrough * explodeFactor * 5.0;
        targetPos.z += uFlythrough * 30.0 * (explodeFactor);
    }

    // Add subtle ambient floating
    targetPos.y += sin(uTime + targetPos.x * 2.0) * 0.1;
    targetPos.x += cos(uTime + targetPos.y * 2.0) * 0.1;

    // Store distance and Y for fragment shader (accretion disk + shockwave coloring)
    vDistFromCenter = length(targetPos);
    vYPos = targetPos.y;

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
        float sparklePhase = sin(uTime * 15.0 + sparkleHash * 6.283) * 0.5 + 0.5;
        float sparkleGate = step(0.85, sparkleHash * sparklePhase);
        vSparkle = sparkleGate * uSparkle;
        gl_PointSize *= (1.0 + vSparkle * 3.0);
    }

    // ── Gravitational pulse makes some particles flare up ──
    if (uPulseFlash > 0.0) {
        float flashInfluence = smoothstep(0.2, 0.8, snoise(targetPos * 4.0 + uTime * 8.0));
        gl_PointSize *= (1.0 + flashInfluence * uPulseFlash * 2.5);
    }

    // ── Plasma heat — particles swell during supernova ──
    if (uPlasmaHeat > 0.0) {
        gl_PointSize *= (1.0 + uPlasmaHeat * 1.5);
    }

    // ══════ COLOR SYSTEM ══════

    // Base palette: Purple / Cyan / Blue
    vec3 color1 = vec3(0.48, 0.22, 0.92); // Purple (#7c3aed)
    vec3 color2 = vec3(0.02, 0.71, 0.83); // Cyan (#06b6d4)
    vec3 color3 = vec3(0.23, 0.51, 0.96); // Blue (#3b82f6)

    float colorMix = sin(targetPos.x + targetPos.y + uTime) * 0.5 + 0.5;
    vColor = mix(mix(color1, color2, colorMix), color3, snoise(targetPos * 2.0) * 0.5 + 0.5);

    // ── Accretion Disk Glow ──
    // Particles near the equatorial plane (small |y|) during gravity phase get warm orange tint
    if (uGravity > 0.3) {
        float diskGlow = 1.0 - smoothstep(0.0, 1.5, abs(targetPos.y));
        float diskIntensity = diskGlow * (uGravity - 0.3) / 0.7;
        vec3 accretionColor = vec3(1.0, 0.6, 0.15); // Warm orange
        vColor = mix(vColor, accretionColor, diskIntensity * 0.7);
        // Hot white-blue inner ring
        float innerRing = 1.0 - smoothstep(0.0, 0.8, length(targetPos.xz));
        vColor = mix(vColor, vec3(0.8, 0.85, 1.0), innerRing * diskIntensity * 0.5);
    }

    // ── Singularity core whiten ──
    // Particles near center during collapse go white-hot
    if (uProgress > 0.7 && uProgress < 1.3) {
        float glow = sin((uProgress - 0.7) * 3.14159 / 0.6);
        float centerDist = length(targetPos);
        float coreBright = glow * (1.0 - smoothstep(0.0, 2.0, centerDist));
        vColor = mix(vColor, vec3(0.9, 0.9, 1.0), coreBright * 0.9);
    }

    // ── Plasma Heat — temperature-based coloring ──
    // White-hot → orange → purple gradient (supernova thermal emission)
    if (uPlasmaHeat > 0.0) {
        vec3 whiteHot = vec3(1.0, 1.0, 1.0);
        vec3 orangeHot = vec3(1.0, 0.55, 0.1);
        vec3 redHot = vec3(0.9, 0.2, 0.3);
        
        float dist = length(targetPos);
        // Inner particles = hotter (whiter), outer = cooler (orange → red)
        float tempGradient = smoothstep(0.0, 5.0, dist);
        vec3 plasmaColor = mix(whiteHot, mix(orangeHot, redHot, tempGradient), tempGradient);
        
        vColor = mix(vColor, plasmaColor, uPlasmaHeat * 0.85);
    }

    // ── Gravitational wave pulse — particles flash white-blue ──
    if (uPulseFlash > 0.0) {
        vec3 pulseColor = vec3(0.7, 0.8, 1.0);
        float flashMix = uPulseFlash * smoothstep(0.0, 0.5, snoise(targetPos * 6.0 + uTime * 12.0) * 0.5 + 0.5);
        vColor = mix(vColor, pulseColor, flashMix);
    }

    // ── Neon intensity — cranks up color saturation during text phase ──
    if (uNeonIntensity > 0.0) {
        vec3 neonPurple = vec3(0.65, 0.15, 1.0);
        vec3 neonCyan = vec3(0.0, 1.0, 0.9);
        float neonMix = sin(targetPos.x * 3.0 + uTime * 2.0) * 0.5 + 0.5;
        vec3 neonColor = mix(neonPurple, neonCyan, neonMix);
        vColor = mix(vColor, neonColor, uNeonIntensity * 0.6);
        vColor += vec3(1.0) * uNeonIntensity * 0.15;
    }

    // ── Shockwave ring highlight — chromatic spectrum ring ──
    // Particles near the wavefront get a vibrant multi-color aurora effect
    if (uShockwave > 0.0) {
        float dist = length(targetPos);
        float waveFront = uShockwave;

        // Primary shockwave ring — tight bright band
        float rimGlow = 1.0 - smoothstep(0.0, 1.2, abs(dist - waveFront));

        // Secondary inner ring — trailing afterglow (slightly behind the wavefront)
        float innerRim = 1.0 - smoothstep(0.0, 2.0, abs(dist - waveFront * 0.7));

        // Chromatic color based on angular position — creates rainbow ring effect
        float angle = atan(targetPos.y, targetPos.x);
        float chromaPhase = angle * 0.5 + uTime * 3.0; // rotates over time

        // Cycle: purple → cyan → blue → magenta → purple
        vec3 chromaPurple = vec3(0.65, 0.15, 1.0);
        vec3 chromaCyan   = vec3(0.0, 1.0, 0.9);
        vec3 chromaBlue   = vec3(0.23, 0.51, 0.96);
        vec3 chromaPink   = vec3(1.0, 0.3, 0.7);
        vec3 chromaOrange  = vec3(1.0, 0.5, 0.1);

        float t = fract(chromaPhase / 6.283);
        vec3 chromaColor;
        if (t < 0.25) {
            chromaColor = mix(chromaPurple, chromaCyan, t / 0.25);
        } else if (t < 0.5) {
            chromaColor = mix(chromaCyan, chromaBlue, (t - 0.25) / 0.25);
        } else if (t < 0.75) {
            chromaColor = mix(chromaBlue, chromaPink, (t - 0.5) / 0.25);
        } else {
            chromaColor = mix(chromaPink, chromaPurple, (t - 0.75) / 0.25);
        }

        // Leading edge of wavefront = white-hot, then chromatic ring, then warm embers trailing
        float leadingEdge = smoothstep(0.0, 0.5, dist - waveFront + 0.5);
        vec3 leadingWhite = vec3(1.0, 0.95, 0.9);
        vec3 shockColor = mix(leadingWhite, chromaColor, leadingEdge);

        // Apply primary ring
        vColor = mix(vColor, shockColor, rimGlow * 0.75);

        // Apply trailing inner ring — warm orange/purple embers
        vec3 emberColor = mix(chromaOrange, chromaPurple, sin(angle * 2.0 + uTime) * 0.5 + 0.5);
        vColor = mix(vColor, emberColor, innerRim * 0.35);

        // Brightness boost at wavefront — particles near the ring glow brighter
        vColor += vec3(1.0) * rimGlow * 0.15;
    }
}
`;

const fragmentShader = `
varying vec3 vColor;
varying float vSparkle;
varying float vDistFromCenter;
varying float vYPos;
uniform float uFlythrough;
uniform float uPulseFlash;
uniform float uNeonIntensity;
uniform float uPlasmaHeat;
uniform float uGravity;

void main() {
    // Make circular particles
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) discard;
    
    // Soft edges
    float alpha = 1.0 - (dist * 2.0);
    
    // ── Sparkle particles get a sharp star-like center ──
    if (vSparkle > 0.0) {
        vec2 uv = gl_PointCoord - 0.5;
        float star = max(
            1.0 - abs(uv.x) * 8.0 - abs(uv.y) * 2.0,
            1.0 - abs(uv.x) * 2.0 - abs(uv.y) * 8.0
        );
        star = max(star, 0.0);
        alpha = max(alpha, star * vSparkle);
    }

    // ── Gravitational pulse — boost brightness ──
    if (uPulseFlash > 0.0) {
        alpha = min(alpha + uPulseFlash * 0.3, 1.0);
    }

    // ── Plasma heat — blazing bright core during supernova ──
    if (uPlasmaHeat > 0.0) {
        float plasmaCore = smoothstep(0.5, 0.0, dist) * uPlasmaHeat;
        alpha = min(alpha + plasmaCore * 0.5, 1.0);
    }

    // ── Accretion disk — particles in disk plane glow brighter ──
    if (uGravity > 0.3) {
        float diskProximity = 1.0 - smoothstep(0.0, 1.5, abs(vYPos));
        float diskBoost = diskProximity * (uGravity - 0.3) / 0.7;
        alpha = min(alpha + diskBoost * 0.2, 1.0);
    }

    // ── Neon glow — tighter, brighter core ──
    if (uNeonIntensity > 0.0) {
        float neonCore = smoothstep(0.5, 0.0, dist) * uNeonIntensity;
        alpha = min(alpha + neonCore * 0.4, 1.0);
    }

    // Fade out slightly during flythrough
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

        const w_ = window.innerWidth;
        const h_ = window.innerHeight;
        const isMobile = w_ < 768;

        // Camera is at z=15, FOV=45°. The visible 3D width depends on aspect ratio.
        // visibleHalfWidth = tan(22.5°) * 15 * aspect = 6.21 * (w_/h_)
        // On a 16:9 desktop (aspect 1.78) → visible width ≈ 22.1 units  → textScale 0.045 fits
        // On portrait iPad  (aspect 0.75) → visible width ≈  9.3 units  → need textScale ≈ 0.016
        // Scale linearly between these anchors for any device.
        const aspect = w_ / h_;
        const aspectFactor = isMobile ? 0 : Math.min(Math.max((aspect - 0.7) / (1.78 - 0.7), 0), 1);
        // aspectFactor: 0 at portrait-tablet, 1 at widescreen desktop

        const textScale   = isMobile ? 0.011 : 0.016 + aspectFactor * 0.029;   // 0.016 → 0.045
        const sphereRadius = isMobile ? 0.8  : 0.9  + aspectFactor * 0.6;      // 0.9   → 1.5
        const randomSpread = isMobile ? 20   : 25   + aspectFactor * 15;        // 25    → 40
        const sizeMultiplier = isMobile ? 0.6 : 0.7 + aspectFactor * 0.3;      // 0.7   → 1.0
        const fontSize     = isMobile ? 80   : Math.round(85 + aspectFactor * 35); // 85 → 120



        // 1. Generate Random Positions (Nebula)
        for (let i = 0; i < particleCount; i++) {
            randomPos[i * 3] = (Math.random() - 0.5) * randomSpread; // x
            randomPos[i * 3 + 1] = (Math.random() - 0.5) * randomSpread; // y
            randomPos[i * 3 + 2] = (Math.random() - 0.5) * randomSpread; // z
            sizesArr[i] = (Math.random() * 2.0 + 0.5) * sizeMultiplier; // Random size
        }

        // 2. Generate Sphere Positions (The Singularity Core)
        for (let i = 0; i < particleCount; i++) {
            const phi = Math.acos(-1 + (2 * i) / particleCount);
            const theta = Math.sqrt(particleCount * Math.PI) * phi;

            spherePos[i * 3] = sphereRadius * Math.cos(theta) * Math.sin(phi);
            spherePos[i * 3 + 1] = sphereRadius * Math.sin(theta) * Math.sin(phi);
            spherePos[i * 3 + 2] = sphereRadius * Math.cos(phi);
        }

        // 3. Generate Text Positions (RITU RAJ / RISHU)
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
            const lineGap = isMobile ? 45 : Math.round(48 + aspectFactor * 12); // 48 → 60
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

        // Reset all uniforms when component mounts
        materialRef.current.uniforms.uProgress.value = 0;
        materialRef.current.uniforms.uFlythrough.value = 0;
        materialRef.current.uniforms.uPulseFlash.value = 0;
        materialRef.current.uniforms.uNeonIntensity.value = 0;
        materialRef.current.uniforms.uSparkle.value = 0;
        materialRef.current.uniforms.uGravity.value = 0;
        materialRef.current.uniforms.uShockwave.value = 0;
        materialRef.current.uniforms.uPlasmaHeat.value = 0;
        materialRef.current.uniforms.uWarpSpeed.value = 0;

        const mat = materialRef.current;
        const tl = gsap.timeline({ onComplete });

        // ══════════════════════════════════════════════════
        // PHASE 1 (0–2.5s): Spiral Galaxy → Black Hole
        // Particles swirl into a spiral galaxy, gravity intensifies,
        // accretion disk forms, gravitational wave pulses ripple out
        // ══════════════════════════════════════════════════

        // Morph from nebula (random) → singularity (sphere)
        tl.to(mat.uniforms.uProgress, {
            value: 1.0,
            duration: 2.5,
            ease: "power2.inOut"
        }, "0.3");

        // Gravity ramps up — spiral vortex intensifies
        tl.to(mat.uniforms.uGravity, {
            value: 1.0,
            duration: 2.2,
            ease: "power2.in"
        }, "0.5");

        // Gravitational wave pulse 1
        tl.to(mat.uniforms.uPulseFlash, {
            value: 0.6, duration: 0.1, ease: "power4.in"
        }, "0.9");
        tl.to(mat.uniforms.uPulseFlash, {
            value: 0.0, duration: 0.3, ease: "power2.out"
        }, "1.0");

        // Gravitational wave pulse 2
        tl.to(mat.uniforms.uPulseFlash, {
            value: 0.5, duration: 0.08, ease: "power4.in"
        }, "1.6");
        tl.to(mat.uniforms.uPulseFlash, {
            value: 0.0, duration: 0.25, ease: "power2.out"
        }, "1.68");

        // Gravitational wave pulse 3 — big one as singularity forms
        tl.to(mat.uniforms.uPulseFlash, {
            value: 0.8, duration: 0.06, ease: "power4.in"
        }, "2.4");
        tl.to(mat.uniforms.uPulseFlash, {
            value: 0.0, duration: 0.3, ease: "power2.out"
        }, "2.46");

        // ══════════════════════════════════════════════════
        // PHASE 2 (2.5–4.5s): Singularity Collapse → Supernova → Text
        // Gravity releases, plasma explodes, shockwave expands,
        // particles reform into text behind the blast wave
        // ══════════════════════════════════════════════════

        // Release gravity (singularity collapses)
        tl.to(mat.uniforms.uGravity, {
            value: 0.0,
            duration: 0.4,
            ease: "power4.in"
        }, "2.7");

        // SUPERNOVA FLASH — big pulse
        tl.to(mat.uniforms.uPulseFlash, {
            value: 1.0, duration: 0.08, ease: "power4.in"
        }, "3.0");
        tl.to(mat.uniforms.uPulseFlash, {
            value: 0.0, duration: 0.5, ease: "power2.out"
        }, "3.08");

        // Plasma heat — white-hot explosion
        tl.to(mat.uniforms.uPlasmaHeat, {
            value: 1.0,
            duration: 0.15,
            ease: "power4.in"
        }, "2.9");
        tl.to(mat.uniforms.uPlasmaHeat, {
            value: 0.2,
            duration: 1.2,
            ease: "power2.out"
        }, "3.1");

        // Shockwave ring expands outward
        tl.to(mat.uniforms.uShockwave, {
            value: 12.0,
            duration: 1.8,
            ease: "power1.out"
        }, "3.0");

        // Morph singularity → text (elastic snap behind the shockwave)
        tl.to(mat.uniforms.uProgress, {
            value: 2.0,
            duration: 1.8,
            ease: "elastic.out(1, 0.7)"
        }, "3.0");

        // ══════════════════════════════════════════════════
        // PHASE 3 (4.5–6.3s): Plasma Cooling → Neon Text + Embers
        // Temperature cools from plasma to neon, sparkle embers appear
        // ══════════════════════════════════════════════════

        // Cool down plasma completely
        tl.to(mat.uniforms.uPlasmaHeat, {
            value: 0.0,
            duration: 1.0,
            ease: "power1.out"
        }, "4.5");

        // Reset shockwave
        tl.to(mat.uniforms.uShockwave, {
            value: 0.0,
            duration: 0.5,
            ease: "power1.out"
        }, "4.5");

        // Neon intensity ramps up — purple/cyan glow emerges
        tl.to(mat.uniforms.uNeonIntensity, {
            value: 1.0,
            duration: 0.8,
            ease: "power2.in"
        }, "4.6");

        // Ember sparkles
        tl.to(mat.uniforms.uSparkle, {
            value: 1.0,
            duration: 0.6,
            ease: "power1.in"
        }, "4.8");

        // Small aftershock pulse on neon text
        tl.to(mat.uniforms.uPulseFlash, {
            value: 0.25, duration: 0.04, ease: "none"
        }, "5.2");
        tl.to(mat.uniforms.uPulseFlash, {
            value: 0.0, duration: 0.15, ease: "power1.out"
        }, "5.24");

        // ══════════════════════════════════════════════════
        // PHASE 4 (6.3–7.5s): Warp-Speed Exit
        // Final flash, warp trails stretch, flythrough explosion
        // ══════════════════════════════════════════════════

        // Final supernova afterglow flash
        tl.to(mat.uniforms.uPulseFlash, {
            value: 0.8, duration: 0.06, ease: "power4.in"
        }, "6.3");
        tl.to(mat.uniforms.uPulseFlash, {
            value: 0.0, duration: 0.4, ease: "power2.out"
        }, "6.36");

        // Fade out sparkle and neon
        tl.to(mat.uniforms.uSparkle, {
            value: 0.0, duration: 0.4, ease: "power1.out"
        }, "6.4");
        tl.to(mat.uniforms.uNeonIntensity, {
            value: 0.0, duration: 0.5, ease: "power1.out"
        }, "6.4");

        // Warp speed — star trails stretch
        tl.to(mat.uniforms.uWarpSpeed, {
            value: 1.0,
            duration: 1.0,
            ease: "power2.in"
        }, "6.5");

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
                    uPulseFlash: { value: 0 },
                    uNeonIntensity: { value: 0 },
                    uSparkle: { value: 0 },
                    uGravity: { value: 0 },
                    uShockwave: { value: 0 },
                    uPlasmaHeat: { value: 0 },
                    uWarpSpeed: { value: 0 }
                }}
                transparent={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}
