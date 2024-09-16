"use client";

import Lottie, { LottieRefCurrentProps } from "lottie-react";
import loading from "../public/loading.json";
import { useState, useRef } from "react";

interface Shape {
  ty: string;
  c?: {
    k: number[];
  };
}

interface LottieAnimationData {
  layers: Array<{
    ty: number;
    shapes?: Array<Shape>;
  }>;
}

interface Animation {
  id: number;
  position: { x: number; y: number };
  animationData: LottieAnimationData;
}

export default function Home() {
  const [animations, setAnimations] = useState<Animation[]>([]);
  const animationIdRef = useRef(0);
  const lottieRefs = useRef<{ [key: number]: LottieRefCurrentProps | null }>(
    {}
  );

  const getRandomColor = () => {
    const r = Math.random();
    const g = Math.random();
    const b = Math.random();
    return [r, g, b];
  };

  const modifyAnimationColor = (
    originalData: LottieAnimationData,
    color: number[]
  ) => {
    const newData = JSON.parse(JSON.stringify(originalData));
    // 假設要修改第一層的填充顏色
    newData.layers.forEach((layer: { ty: number; shapes?: Shape[] }) => {
      if (layer.ty === 4) {
        // 檢查是否為形狀層
        layer.shapes?.forEach((shape: Shape) => {
          if (shape.ty === "st") {
            // 修改描邊顏色
            shape.c = { k: color };
          }
          if (shape.ty === "fl") {
            // 修改填充顏色
            shape.c = { k: color };
          }
        });
      }
    });
    return newData;
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;

    const randomColor = getRandomColor();
    const modifiedAnimation = modifyAnimationColor(loading, randomColor);

    const newAnimation: Animation = {
      id: animationIdRef.current++,
      position: { x: clientX, y: clientY },
      animationData: modifiedAnimation,
    };

    setAnimations((prev) => [...prev, newAnimation]);

    // 設置一個隨機的動畫速度
    setTimeout(() => {
      const lottieInstance = lottieRefs.current[newAnimation.id];
      if (lottieInstance) {
        const randomSpeed = 0.5 + Math.random() * 1.5; // 速度範圍：0.5 到 2
        lottieInstance.setSpeed(randomSpeed);
      }
    }, 0);
  };

  const handleComplete = (id: number) => {
    setAnimations((prev) => prev.filter((anim) => anim.id !== id));
    delete lottieRefs.current[id];
  };

  return (
    <div
      className="w-screen h-screen"
      onClick={handleClick}
      style={{ cursor: "pointer", position: "relative" }}
    >
      {animations.map((anim) => (
        <div
          key={anim.id}
          style={{
            position: "absolute",
            left: anim.position.x,
            top: anim.position.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <Lottie
            animationData={anim.animationData}
            loop={false}
            autoplay={true}
            onComplete={() => handleComplete(anim.id)}
            style={{ width: "100px", height: "100px" }}
          />
        </div>
      ))}
    </div>
  );
}
