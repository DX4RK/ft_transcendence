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

		// Create a static box shape.
		var sphere = MeshBuilder.CreateSphere("sphere", { diameterX: 1, diameterY: 1, diameterZ: 1 }, scene);
		sphere.position.y = 7;
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
		const roofR = MeshBuilder.CreateBox("roofR", { width: 8, depth: 16, height: 0.2 }, scene);
		roofR.rotation.z = Math.PI / 16;
		roofR.position.y = 0.65;
		roofR.position.x = -3.9;
		const roofRAggregate = new PhysicsAggregate( roofR, PhysicsShapeType.BOX, { mass: 0, restitution: 0.3, friction: 0.8 }, scene);

		const roofL = MeshBuilder.CreateBox("roofL", { width: 8, depth: 16, height: 0.2 }, scene);
		roofL.rotation.z = -Math.PI / 16;
		roofL.position.y = 0.65;
		roofL.position.x = 3.9;
		new PhysicsAggregate( roofL, PhysicsShapeType.BOX, { mass: 0, restitution: 0.3, friction: 0.8 }, scene);

		// create Walls
		const invisWall = new StandardMaterial("wallMat", scene);
		invisWall.alpha = 0.1;
		const goalAlpha = new StandardMaterial("wallMat", scene);
		goalAlpha.alpha = 0.3;

		const backWall = MeshBuilder.CreateBox("backWall", { width: 40, height: 10, depth: 0.1 }, scene);
		const frontWall = MeshBuilder.CreateBox("frontWall", { width: 40, height: 10, depth: 0.1 }, scene);
		backWall.position.z = -8;
		backWall.position.y = 5;
		frontWall.position.z = 8;
		frontWall.position.y = 5;
		frontWall.material = invisWall;
		const frontWAggregate = new PhysicsAggregate( frontWall, PhysicsShapeType.BOX, { mass: 0, restitution: 1, friction: 0 }, scene);
		const backWAggregate = new PhysicsAggregate( backWall, PhysicsShapeType.BOX, { mass: 0, restitution: 1, friction: 0}, scene);

		// create roof
		const roof = MeshBuilder.CreateBox("roof", { width: 40, height: 0.1, depth: 16 }, scene);
		roof.position.y = 10;
		roof.material = invisWall;
		const roofAggregate = new PhysicsAggregate( roof, PhysicsShapeType.BOX, { mass: 0, restitution: 1, friction: 0.3 }, scene);


		// create Goals
		const goalL = MeshBuilder.CreateBox("goalL", { width: 0.1, height: 10, depth: 16 }, scene);
		const goalR = MeshBuilder.CreateBox("goalR", { width: 0.1, height: 10, depth: 16 }, scene);
		goalL.position.x = -20;
		goalL.position.y = 5;
		goalR.position.x = 20;
		goalR.position.y = 5;
		goalL.material = goalAlpha;
		goalR.material = goalAlpha;
		const goalRAggregate = new PhysicsAggregate( goalR, PhysicsShapeType.BOX, { mass: 0, restitution: 1.5, friction: 0.3 }, scene);
		const goalLAggregate = new PhysicsAggregate( goalL, PhysicsShapeType.BOX, { mass: 0, restitution: 1.5, friction: 0.3 }, scene);


		//create box
		var pad1 = MeshBuilder.CreateBox("pad1", {width: 0.4, height: 3, depth: 4 }, scene);
		pad1.position = new Vector3(16, 2, 0);
		const pad1Aggregate = new PhysicsAggregate( pad1, PhysicsShapeType.BOX, { mass: 20, restitution: 1.1, friction: 0.3 }, scene);

		var pad2 = MeshBuilder.CreateBox("pad2", {width: 0.4, height: 3, depth: 4 }, scene);
		pad2.position = new Vector3(-16, 2, 0);
		const pad2Aggregate = new PhysicsAggregate( pad2, PhysicsShapeType.BOX, { mass: 20, restitution: 1.1, friction: 2 }, scene);


		const keys: Record<string, boolean> = {};
		window.addEventListener("keydown", (e) => (keys[e.key.toLowerCase()] = true));
		window.addEventListener("keyup", (e) => (keys[e.key.toLowerCase()] = false));

		scene.onBeforeRenderObservable.add(() => {
			const padBody1 = pad1Aggregate.body;
			const padBody2 = pad2Aggregate.body;
			if (!pad1 || !pad2) return;

			const speed = 6;

			pad1Aggregate.body.setAngularVelocity(Vector3.Zero());
			pad2Aggregate.body.setAngularVelocity(Vector3.Zero());
			const velocity1 = new Vector3(0, 0, 0);
			const velocity2 = new Vector3(0, 0, 0);

			if (keys["z"] || keys["w"]) velocity1.z -= speed;
			if (keys["s"]) velocity1.z += speed;
			if (keys["d"] && pad1.position.x > 10) velocity1.x -= speed;
			if (keys["a"] || keys["q"]) velocity1.x += speed;


			if (keys["o"]) velocity2.z -= speed;
			if (keys["l"]) velocity2.z += speed;
			if (keys[";"] ) velocity2.x -= speed;
			if (keys["k"] && pad2.position.x < -10) velocity2.x += speed;

			padBody1.setLinearVelocity(velocity1);
			padBody2.setLinearVelocity(velocity2);
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
