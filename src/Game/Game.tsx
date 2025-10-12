import { useEffect, useRef } from "react";
import { Engine, Scene, HemisphericLight, MeshBuilder, Vector3, FreeCamera, StandardMaterial, Color4, HavokPlugin, PhysicsAggregate, PhysicsShapeType, } from "@babylonjs/core";
// import * as BABYLON from "@babylonjs/core";
import  HavokPhysics from "@babylonjs/havok";

export default function BabylonScene() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
	  if (!canvasRef.current) return;

	const engine = new Engine(canvasRef.current, true);


	const createScene = async function () {
		const scene = new Scene(engine);
		scene.clearColor = new Color4(0, 0, 0, 0);


		const havokInstance = await HavokPhysics({ locateFile: (HavokPhysics) => "/havok/" + HavokPhysics });

		// pass the engine to the plugin
		const hk = new HavokPlugin(true, havokInstance);
		// enable physics in the scene with a gravity
		scene.enablePhysics(new Vector3(0, -9.8, 0), hk);

		// Create a sphere shape and the associated body. Size will be determined automatically.

		// Create a static box shape.

		var sphere = MeshBuilder.CreateSphere("sphere", { diameterX: 1, diameterY: 1, diameterZ: 1 }, scene);
		sphere.position.y = 10;
		const sphereAggregate = new PhysicsAggregate(sphere, PhysicsShapeType.SPHERE, { mass: 1, restitution: 0.5 }, scene);


		//create speed
		let velocity = new Vector3(-0.05, 0, 0.05);

		//create camera
		const camera = new FreeCamera("camera", new Vector3(0, 12, 25), scene);
		camera.setTarget(sphere.position);
		camera.attachControl(true);
		camera.lockedTarget = sphere; //version 2.5 onwards

		//create Lumière
		new HemisphericLight("light", new Vector3(10, 1, 10), scene);

		//create ground
		const ground = MeshBuilder.CreateGround("ground", {width: 40, height: 16}, scene);
		ground.position.y = 0;
		const groundAggregate = new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0, restitution: 0.2, friction: 0.8 }, scene);

		// create toit
		const roofR = MeshBuilder.CreateBox("roofR", { width: 22, depth: 16, height: 0.2 }, scene);
		roofR.rotation.z = Math.PI / 16;
		roofR.position.y = 0;
		roofR.position.x = -10.8;
		const roofRAggregate = new PhysicsAggregate( roofR, PhysicsShapeType.BOX, { mass: 0, restitution: 0.3, friction: 0.8 }, scene);

		const roofL = MeshBuilder.CreateBox("roofL", { width: 22, depth: 16, height: 0.2 }, scene);
		roofL.rotation.z = -Math.PI / 16;
		roofL.position.y = 0;
		roofL.position.x = 10.8;
		new PhysicsAggregate( roofL, PhysicsShapeType.BOX, { mass: 0, restitution: 0.3, friction: 0.8 }, scene);

		// create Walls
		const invisWall = new StandardMaterial("wallMat", scene);
		invisWall.alpha = 0.1;

		const backWall = MeshBuilder.CreateBox("backWall", { width: 40, height: 5, depth: 0.1 }, scene);
		const frontWall = MeshBuilder.CreateBox("frontWall", { width: 40, height: 2, depth: 0.1 }, scene);
		backWall.position.z = -8;
		backWall.position.y = 1;
		frontWall.position.z = 8;
		frontWall.position.y = 1;
		frontWall.material = invisWall;


		//create box
		var box1 = MeshBuilder.CreateBox("box1", {width: 0.4, height: 3, depth: 4 }, scene);
		box1.position = new Vector3(16, 2, 0);
		const box1Aggregate = new PhysicsAggregate( box1, PhysicsShapeType.BOX, { mass: 20, restitution: 2, friction: 0.3 }, scene);

		var box2 = MeshBuilder.CreateBox("box", {width: 0.4, height: 3, depth: 4 }, scene);
		box2.position = new Vector3(-16, 0, 0);
		const box2Aggregate = new PhysicsAggregate( box2, PhysicsShapeType.BOX, { mass: 0, restitution: 2, friction: 2 }, scene);


		const keys: Record<string, boolean> = {};
		window.addEventListener("keydown", (e) => (keys[e.key.toLowerCase()] = true));
		window.addEventListener("keyup", (e) => (keys[e.key.toLowerCase()] = false));

		scene.onBeforeRenderObservable.add(() => {
			const body = box1Aggregate.body;
			// const body = sphereAggregate.body;
			if (!body) return;

			// box1Aggregate.body.setLinearFactor(new Vector3(1, 0, 1)); // pas de mouvement vertical (Y)
			// box1Aggregate.body.setAngularFactor(Vector3.Zero());
			const velocity = new Vector3(0, 0, 0);
			const speed = 3;

			if (keys["z"] || keys["w"]) velocity.z -= speed;
			if (keys["s"]) velocity.z += speed;
			if (keys["q"] || keys["a"]) velocity.x -= speed;
			if (keys["d"]) velocity.x += speed;

			body.setLinearVelocity(velocity);
		});


        return scene;
	};

	createScene().then((scene) => {
		engine.runRenderLoop(function () {
			if (scene) {
				scene.render();
			}
        });
	});

}, []);

  return <canvas ref={canvasRef} className="p-10 w-full h-screen" />;
}
