import { useEffect, useRef } from "react";
import { Engine, Scene, MeshBuilder, Vector3, FreeCamera, StandardMaterial, Color4, HavokPlugin, PhysicsAggregate, PhysicsShapeType, DirectionalLight, ShadowGenerator, Quaternion } from "@babylonjs/core";
import  HavokPhysics from "@babylonjs/havok";
// import * as earcut from 'earcut';

interface GameSceneProps {
  onScoreUpdate?: (left: number, right: number) => void;
}

export default function BabylonScene({ onScoreUpdate }: GameSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scoreRef = useRef({ left: 0, right: 0 });

  useEffect(() => {
	if (!canvasRef.current) return;

	const engine = new Engine(canvasRef.current, true);
    let sceneTest: Scene | null = null;


	const createScene = async function () {
		const scene = new Scene(engine);
		scene.clearColor = new Color4(0, 0, 0, 0);


		// Setup les plugins
		const havokInstance = await HavokPhysics({ locateFile: (HavokPhysics) => "/havok/" + HavokPhysics });
		// window.earcut = earcut;

		const hk = new HavokPlugin(true, havokInstance);
		scene.enablePhysics(new Vector3(0, -9.8, 0), hk);

		//create Lumière
		const light = new DirectionalLight("dirLight", new Vector3(-1, -2, -1), scene);
		light.position = new Vector3(20, 40, 20);
		const shadowGenerator = new ShadowGenerator(1024, light);

		// Create sphere.
		var sphere = MeshBuilder.CreateSphere("sphere", { diameterX: 1, diameterY: 1, diameterZ: 1 }, scene);
		let random = Math.floor(Math.random() * 2);
		if (random == 0)
			sphere.position = new Vector3(-1, 5, 0);
		else
			sphere.position = new Vector3(1, 5, 0);
		// sphere.position.y = 7;
		const sphereAgg = new PhysicsAggregate(sphere, PhysicsShapeType.SPHERE, { mass: 1, restitution: 0.5 }, scene);
		shadowGenerator.addShadowCaster(sphere);

		//create camera
		const camera = new FreeCamera("camera", new Vector3(0, 12, 25), scene);
		camera.setTarget(sphere.position);
		camera.attachControl(true);
		camera.lockedTarget = sphere;
		camera.inputs.clear();


		//create ground
		const ground = MeshBuilder.CreateGround("ground", {width: 40, height: 16}, scene);
		ground.position.y = 0;
		new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0, restitution: 0.2, friction: 0.8 }, scene);
		ground.receiveShadows = true;

		// create toit
		const roofR = MeshBuilder.CreateBox("roofR", { width: 8, depth: 16, height: 0.2 }, scene);
		roofR.rotation.z = Math.PI / 16;
		roofR.position.y = 0.65;
		roofR.position.x = -3.9;
		new PhysicsAggregate( roofR, PhysicsShapeType.BOX, { mass: 0, restitution: 0.3, friction: 0.8 }, scene);
		roofR.receiveShadows = true;

		const roofL = MeshBuilder.CreateBox("roofL", { width: 8, depth: 16, height: 0.2 }, scene);
		roofL.rotation.z = -Math.PI / 16;
		roofL.position.y = 0.65;
		roofL.position.x = 3.9;
		new PhysicsAggregate( roofL, PhysicsShapeType.BOX, { mass: 0, restitution: 0.3, friction: 0.8 }, scene);
		roofL.receiveShadows = true;

		// create Walls
		const invisWall = new StandardMaterial("wallMat", scene);
		invisWall.alpha = 0.1;
		const goalAlpha = new StandardMaterial("wallMat", scene);
		goalAlpha.alpha = 0.3;

		const frontWall = MeshBuilder.CreateBox("frontWall", { width: 40, height: 10, depth: 0.1 }, scene);
		frontWall.position.z = 8;
		frontWall.position.y = 5;
		frontWall.material = invisWall;
		new PhysicsAggregate( frontWall, PhysicsShapeType.BOX, { mass: 0, restitution: 1, friction: 0 }, scene);

		const backWall = MeshBuilder.CreateBox("backWall", { width: 40, height: 10, depth: 0.1 }, scene);
		backWall.position.z = -8;
		backWall.position.y = 5;
		new PhysicsAggregate( backWall, PhysicsShapeType.BOX, { mass: 0, restitution: 1, friction: 0}, scene);

		// create roof
		const roof = MeshBuilder.CreateBox("roof", { width: 40, height: 0.1, depth: 16 }, scene);
		roof.position.y = 10;
		roof.material = invisWall;
		new PhysicsAggregate( roof, PhysicsShapeType.BOX, { mass: 0, restitution: 1, friction: 0.3 }, scene);


		// create Goals
		const goalR = MeshBuilder.CreateBox("goalR", { width: 0.1, height: 10, depth: 16 }, scene);
		goalR.position.x = 20;
		goalR.position.y = 5;
		goalR.material = goalAlpha;
		new PhysicsAggregate( goalR, PhysicsShapeType.BOX, { mass: 0, restitution: 0	, friction: 0.3 }, scene);

		const goalL = MeshBuilder.CreateBox("goalL", { width: 0.1, height: 10, depth: 16 }, scene);
		goalL.position.x = -20;
		goalL.position.y = 5;
		goalL.material = goalAlpha;
		new PhysicsAggregate( goalL, PhysicsShapeType.BOX, { mass: 0, restitution: 0, friction: 0.3 }, scene);


		//create pads
		var pad1 = MeshBuilder.CreateBox("pad1", {width: 0.4, height: 3, depth: 4 }, scene);
		pad1.position = new Vector3(16, 2, 0);
		const pad1Aggregate = new PhysicsAggregate( pad1, PhysicsShapeType.BOX, { mass: 20, restitution: 1, friction: 0.3 }, scene);
		shadowGenerator.addShadowCaster(pad1);

		var pad2 = MeshBuilder.CreateBox("pad2", {width: 0.4, height: 3, depth: 4 }, scene);
		pad2.position = new Vector3(-16, 2, 0);
		const pad2Aggregate = new PhysicsAggregate( pad2, PhysicsShapeType.BOX, { mass: 20, restitution: 1, friction: 2 }, scene);
		shadowGenerator.addShadowCaster(pad2);

		// // Points du triangle (dans le plan XZ)
		// const trianglePoints = [
		// 	new Vector3(-1, 0, 0),  // gauche
		// 	new Vector3(1, 0, 0),   // droite
		// 	new Vector3(0, 0, 2),   // sommet avant
		// ];

		//	Game logic
		let resetCooldown = 0;

		function resetBall() {
			const body = sphereAgg.body;
			if (!body || !body.transformNode) return;

			// Reset immédiat des vélocités
			body.setLinearVelocity(Vector3.Zero());
			body.setAngularVelocity(Vector3.Zero());

			// Reset position directement via le transform
			// let random = Math.floor(Math.random() * 2);

			// console.log(random)
			// if (random == 0)
			// 	sphere.position = new Vector3(-2, 5, -2);
			// else
			// 	sphere.position = new Vector3(2, 5, 2);

			sphere.rotationQuaternion = Quaternion.Identity();

			// Cooldown de 1 seconde avant la prochaine détection
			resetCooldown = performance.now() + 1000;
		}

		scene.onBeforePhysicsObservable.add(() => {
		const now = performance.now();
		if (now < resetCooldown) return;
		if (sphere.position.x < -19) { // x du player L
			scoreRef.current.left++;
			console.log("Point pour joueur gauche :", scoreRef.current.left, "-", scoreRef.current.right);
			onScoreUpdate?.(scoreRef.current.left, scoreRef.current.right);
			resetBall();
		} else if (sphere.position.x > 19) {
			scoreRef.current.right++;
			console.log("Point pour joueur droit :", scoreRef.current.left, "-", scoreRef.current.right);
			onScoreUpdate?.(scoreRef.current.left, scoreRef.current.right);
			resetBall();
		}
		});

		shadowGenerator.usePoissonSampling = true

		// Keyboard control
		const keys: Record<string, boolean> = {};

		const handleKeyDown = (e: KeyboardEvent) => (keys[e.key.toLowerCase()] = true)
		const handleKeyUp = (e: KeyboardEvent) => (keys[e.key.toLowerCase()] = false)

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);

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

			if (keys["arrowup"]) velocity2.z -= speed;
			if (keys["arrowdown"]) velocity2.z += speed;
			if (keys["arrowright"] ) velocity2.x -= speed;
			if (keys["arrowleft"] && pad2.position.x < -10) velocity2.x += speed;

			padBody1.setLinearVelocity(velocity1);
			padBody2.setLinearVelocity(velocity2);
		});

		scene.onDisposeObservable.add(() => {
		window.removeEventListener("keydown", handleKeyDown);
		window.removeEventListener("keyup", handleKeyUp);
		});

        return scene;
	};

	createScene().then((scene) => {
		sceneTest = scene;
		engine.runRenderLoop(function () {
			if (scene) {
				scene.render();
			}
        });
	});

	return () => {
		engine.stopRenderLoop();
		if (sceneTest) {
			sceneTest.dispose();
		}
		engine.dispose();
	};
}, [onScoreUpdate]);

  return <canvas ref={canvasRef} className="p-10 w-full h-screen" />;
}
