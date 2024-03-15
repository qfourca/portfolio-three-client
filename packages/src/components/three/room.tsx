import { useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Color, OrthographicCamera, PerspectiveCamera } from 'three';
import { OrbitControls as OrbitControlsImpl } from 'three/examples/jsm/controls/OrbitControls';

const ORTHOGRAPHIC_CAMERA_SIZE = 180;

export const Room = () => {
	const canvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));

	const { scene } = useGLTF('./room.glb');

	const wallColor = useMemo(() => new Color(0xe4f3f9), []);
	const wallHoverColor = useMemo(() => new Color(0x89fcfc), []);

	const perspectiveCamera = useMemo(() => new PerspectiveCamera(), []);
	const orthographicCamera = useMemo(() => new OrthographicCamera(), []);
	const orbitcontrol = useMemo<OrbitControlsImpl>(
		() => new OrbitControlsImpl(orthographicCamera, canvasRef.current),
		[orthographicCamera]
	);

	useEffect(() => {
		const frame = scene.children.find((c) => c.name === 'Plane');
		if (frame) frame.visible = false;
		perspectiveCamera.position.set(15, 15, 15);
		orthographicCamera.position.set(15, 15, 15);
	}, [scene, perspectiveCamera, orthographicCamera]);

	const onCreate = useCallback(() => {
		orbitcontrol.target.set(0, 3, 0);
		orbitcontrol.update();
		orthographicCamera.left = canvasRef.current.width / -ORTHOGRAPHIC_CAMERA_SIZE;
		orthographicCamera.right = canvasRef.current.width / ORTHOGRAPHIC_CAMERA_SIZE;
		orthographicCamera.top = canvasRef.current.height / ORTHOGRAPHIC_CAMERA_SIZE;
		orthographicCamera.bottom = canvasRef.current.height / -ORTHOGRAPHIC_CAMERA_SIZE;
		orthographicCamera.updateProjectionMatrix();
	}, [orbitcontrol, orthographicCamera]);

	useEffect(() => {
		onCreate();
	}, [onCreate]);

	// const three = useThree();

	const [isMouseHover, setIsMouseHover] = useState(false);
	const isCursorPointer = useMemo(() => {
		return isMouseHover;
	}, [isMouseHover]);

	return (
		<Canvas
			style={{ width: '100%', height: '100%', cursor: isCursorPointer ? 'pointer' : 'default' }}
			ref={canvasRef}
			dpr={window.devicePixelRatio}
			camera={orthographicCamera}
			onCreated={onCreate}
			frameloop='demand'>
			{/* <OrbitControls camera={orthographicCamera} ref={orbitcontrolRef} /> */}
			<ambientLight intensity={Math.PI * 0.75} />
			<pointLight intensity={Math.PI * 0.75} position={[0, 5, 0]} />
			<directionalLight intensity={Math.PI / 2} position={[0, 5, 0]} />

			{/* <mesh position={[0, 5, 0]}>
				<boxGeometry args={[0.1, 0.1, 0.1]} />
				<meshStandardMaterial color={new Color(0xff0000)} />
			</mesh> */}

			<mesh position={[0, 0, 0]} rotation={[Math.PI + Math.PI / 2, 0, 0]}>
				<planeGeometry args={[10, 10]} />
				<meshStandardMaterial color={new Color(0xf9f9e4)} />
			</mesh>
			<mesh position={[0, 3, -5]} rotation={[0, 0, 0]}>
				<planeGeometry args={[10, 6]} />
				<meshStandardMaterial color={wallColor} />
			</mesh>
			<mesh position={[0, 3, 5]} rotation={[Math.PI, 0, 0]}>
				<planeGeometry args={[10, 6]} />
				<meshStandardMaterial color={wallColor} />
			</mesh>
			<mesh position={[5, 3, 0]} rotation={[0, -Math.PI / 2, 0]}>
				<planeGeometry args={[10, 6]} />
				<meshStandardMaterial color={wallColor} />
			</mesh>
			<mesh
				position={[-5, 3, 0]}
				rotation={[0, Math.PI / 2, 0]}
				onPointerEnter={() => setIsMouseHover(true)}
				onPointerLeave={() => setIsMouseHover(false)}>
				<planeGeometry args={[10, 6]} />
				<meshStandardMaterial color={isMouseHover ? wallHoverColor : wallColor} />
			</mesh>
			<primitive object={scene} />
		</Canvas>
	);
};
