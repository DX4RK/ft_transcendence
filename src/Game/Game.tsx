import { useEffect, useRef } from "react";
import { Engine, Scene, HemisphericLight, MeshBuilder, Vector3, FreeCamera, StandardMaterial, Color4, PhysicsImpostor, HavokPlugin, PhysicsAggregate, PhysicsShapeType, } from "@babylonjs/core";
// import * as BABYLON from "@babylonjs/core";
import  HavokPhysics from "@babylonjs/havok";
// import havokWasmUrl from "@babylonjs/havok/lib/esm/HavokPhysics.wasm?url";

// const havokInstance = await HavokPhysics({
//   locateFile: (HavokPhysics) => {
//     return `/HavokPhysics.wasm`
//   },
// })

export default function BabylonScene() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
	  if (!canvasRef.current) return;

	  	  const engine = new Engine(canvasRef.current, true);
	  const scene = new Scene(engine);

      const createScene = async function () {
        // This creates a basic Babylon Scene object (non-mesh)
        const scene = new Scene(engine);

        // This creates and positions a free camera (non-mesh)
        const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);

        // This targets the camera to scene origin
        camera.setTarget(Vector3.Zero());

        // This attaches the camera to the canvas
        camera.attachControl(canvasRef, true);

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;

        // Our built-in 'sphere' shape.
        const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);

        // Move the sphere upward at 4 units
        sphere.position.y = 4;

        // Our built-in 'ground' shape.
        const ground = MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, scene);

        // initialize plugin
        const havokInstance = await HavokPhysics(/*{ locateFile: () => havokWasmUrl }*/);

		// pass the engine to the plugin
        const hk = new HavokPlugin(true, havokInstance);
        // enable physics in the scene with a gravity
        scene.enablePhysics(new Vector3(0, -9.8, 0), hk);

        // Create a sphere shape and the associated body. Size will be determined automatically.
        const sphereAggregate = new PhysicsAggregate(sphere, PhysicsShapeType.SPHERE, { mass: 1, restitution: 0.75 }, scene);

        // Create a static box shape.
        const groundAggregate = new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0 }, scene);

        return scene;
      };



	//   // Créer le moteur et la scène
	//   const engine = new Engine(canvasRef.current, true);
	//   const scene = new Scene(engine);

	//   // await hk.initialize();
    // async function initPhysicsAndScene() {

	// 	const havokModule = await HavokPhysics();
	// 	const hk = new HavokPlugin(true, havokModule);

	// 	scene.enablePhysics(new Vector3(0, 0, 0), hk);
	// 	scene.clearColor = new Color4(0, 0, 0, 0);

	// 	// const box = MeshBuilder.CreateBox("box", { size: 1 }, scene);
	// 	// box.position.y = 2;
	// 	// new PhysicsAggregate(box, PhysicsShapeType.BOX, { mass: 1 }, scene);

	// }

	// //create sphere
	// var sphere = MeshBuilder.CreateSphere("sphere", { diameterX: 1, diameterY: 1, diameterZ: 1 }, scene);
	// sphere.position.y = 0.5;
	// sphere.physicsImpostor = new PhysicsImpostor(sphere, PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 1 }, scene);


	// //create speed
	// let velocity = new Vector3(-0.05, 0, 0.05);

	// //create camera
	// const camera = new FreeCamera("camera", new Vector3(0, 12, 25), scene);
	// camera.setTarget(sphere.position);
	// camera.attachControl(true);
	// // camera.lockedTarget = sphere; //version 2.5 onwards

    // //create Lumière
    // new HemisphericLight("light", new Vector3(10, 1, 10), scene);

	// //create ground
	// MeshBuilder.CreateGround("ground", {width: 40, height: 16}, scene);

	// // create Wall
	// const wallMaterial = new StandardMaterial("wallMat", scene);
	// const invisWall = new StandardMaterial("wallMat", scene);
	// wallMaterial.alpha = 0.2;
	// invisWall.alpha = 0;

	// const backWall = MeshBuilder.CreateBox("backWall", { width: 40, height: 5, depth: 0.1 }, scene);
	// const frontWall = MeshBuilder.CreateBox("frontWall", { width: 40, height: 2, depth: 0.1 }, scene);
	// backWall.position.z = -8;
	// backWall.position.y = 1;
	// frontWall.position.z = 8;
	// frontWall.position.y = 1;
	// frontWall.material = invisWall;

	// frontWall.physicsImpostor = new PhysicsImpostor(frontWall, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 1 }, scene);
	// backWall.physicsImpostor = new PhysicsImpostor(backWall, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 1 }, scene);

	// //create box
	// var box = MeshBuilder.CreateBox("box", {width: 0.4, height: 3, depth: 4 }, scene);
	// box.position = new Vector3(16, 0, 0);

	// 	scene.onBeforeRenderObservable.add(() => {
	// sphere.position.addInPlace(velocity);

	// // Vérifie les collisions avec les murs
	// // if (sphere.intersectsMesh(frontWall, true) || sphere.intersectsMesh(backWall, true)) {
	// // 	velocity.x *= -1;
	// // 	// velocity.z *= -1; // inversion verticale
	// // }
	// });

    // Boucle de rendu
    // engine.runRenderLoop(() => {
    //   scene.render();
    // });
      createScene().then((scene) => {
        engine.runRenderLoop(function () {
          if (scene) {
            scene.render();
          }
        });
      });


    // Nettoyage quand le composant est démonté
    // return () => {
    //   engine.stopRenderLoop();
    //   engine.dispose();
    // };
  }, []);



  return <canvas ref={canvasRef} className="p-10 w-full h-screen" />;
}
