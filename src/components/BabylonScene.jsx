import React, { useEffect, useRef } from "react";
import * as BABYLON from "babylonjs";

const BabylonScene = ({ image }) => {
  const canvasRef = useRef(null);
  const boxRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const engine = new BABYLON.Engine(canvas, true);

      const createScene = () => {
        const scene = new BABYLON.Scene(engine);
        const camera = new BABYLON.ArcRotateCamera(
          "camera",
          Math.PI / 2,
          Math.PI / 3,
          9,
          BABYLON.Vector3.Zero(),
          scene
        );
        camera.attachControl(canvas, true);
        var light = new BABYLON.HemisphericLight(
          "light",
          new BABYLON.Vector3(0, 1, 0),
          scene
        );
        light.intensity = 2;

        const box = BABYLON.MeshBuilder.CreateBox(
          "box",
          { height: 4, width: 4, depth: 4 },
          scene
        );
        // box.showBoundingBox = false;
        boxRef.current = box;

        const material = new BABYLON.StandardMaterial("material", scene);
        const texture = new BABYLON.Texture(`${image}`, scene); // Initialize texture with image prop
        material.diffuseTexture = texture;
        box.material = material;

        const animationSpeed = 0.01; // adjust the speed of the animation as desired
        scene.registerBeforeRender(() => {
          box.rotation.y += animationSpeed;
        });

        return scene;
      };

      const scene = createScene();

      engine.runRenderLoop(() => {
        scene.render();
      });

      window.addEventListener("resize", () => {
        engine.resize();
      });

      return () => {
        scene.dispose();
        engine.dispose();
      };
    }
  }, []);

  useEffect(() => {
    if (boxRef.current) {
      const material = boxRef.current.material;
      const texture = material.diffuseTexture;
      texture.updateURL(image);
    }
  }, [image]);

  return <canvas ref={canvasRef} style={{ width: 500, height: 500 }} />;
};

export default BabylonScene;
