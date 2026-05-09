"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

const vertexShader = `
uniform float uTime;
uniform float uProgress;
uniform float uFlythrough;

attribute vec3 aRandomPosition;
attribute vec3 aSpherePosition;
attribute vec3 aTextPosition;
attribute float aSize;

varying vec3 vColor;

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

    // Colors: Electric Blue and Neon Purple based on position
    vec3 color1 = vec3(0.48, 0.22, 0.92); // Purple (#7c3aed)
    vec3 color2 = vec3(0.02, 0.71, 0.83); // Cyan (#06b6d4)
    vec3 color3 = vec3(0.23, 0.51, 0.96); // Blue (#3b82f6)

    float colorMix = sin(targetPos.x + targetPos.y + uTime) * 0.5 + 0.5;
    vColor = mix(mix(color1, color2, colorMix), color3, snoise(targetPos * 2.0) * 0.5 + 0.5);
    
    // Whiten up the core when forming the sphere
    if (uProgress > 0.7 && uProgress < 1.3) {
        float glow = sin((uProgress - 0.7) * 3.14159 / 0.6); // 0 to 1 back to 0
        vColor = mix(vColor, vec3(1.0, 1.0, 1.0), glow * 0.9);
    }
}
`;

const fragmentShader = `
varying vec3 vColor;
uniform float uFlythrough;

void main() {
    // Make circular particles
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) discard;
    
    // Soft edges
    float alpha = 1.0 - (dist * 2.0);
    
    // Fade out slightly during flythrough to prevent blinding the user completely
    if (uFlythrough > 0.5) {
        alpha *= 1.0 - ((uFlythrough - 0.5) * 2.0);
    }

    gl_FragColor = vec4(vColor, alpha * 0.8);
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
        const textScale = isMobile ? 0.015 : 0.045;
        const sphereRadius = isMobile ? 0.8 : 1.5;
        const randomSpread = isMobile ? 20 : 40;
        const sizeMultiplier = isMobile ? 0.6 : 1.0;

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
            ctx.font = "bold 120px system-ui, -apple-system, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("RITU RAJ", w / 2, h / 2 - 60);
            ctx.fillText("  RISHU", w / 2, h / 2 + 60);

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

        const tl = gsap.timeline({ onComplete });

        // Cinematic 6-second Timeline
        tl
            .to(materialRef.current.uniforms.uProgress, {
                value: 1.0, // To Sphere (The Core)
                duration: 2.5,
                ease: "power2.inOut"
            }, "0.5")
            .to(materialRef.current.uniforms.uProgress, {
                value: 2.0, // To Text (The Assembly)
                duration: 1.8,
                ease: "elastic.out(1, 0.7)"
            }, "+=0.3") // Hold core for 0.3s
            .to(materialRef.current.uniforms.uFlythrough, {
                value: 1.0, // Flythrough explode
                duration: 1.5,
                ease: "power3.in"
            }, "+=1.5"); // Hold text for 1.5s

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
                    uFlythrough: { value: 0 }
                }}
                transparent={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}
