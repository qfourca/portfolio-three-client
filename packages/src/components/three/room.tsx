import { useGLTF } from '@react-three/drei';
import { Canvas, invalidate } from '@react-three/fiber';
import * as TWEEN from '@tweenjs/tween.js';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Object3D, OrthographicCamera, PerspectiveCamera } from 'three';

import { useAppState } from '@/hook/useAppState';
import { SELECTION } from '@/store/selection';

import room_url from '../../../asset/room.glb';

import { Wall } from './wall';

const ORTHOGRAPHIC_CAMERA_SIZE = 180;

export const Room = () => {
	const canvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));

	const { scene } = useGLTF(room_url);

	const perspectiveCamera = useMemo(() => new PerspectiveCamera(), []);
	const orthographicCamera = useMemo(() => new OrthographicCamera(), []);
	// const orbitcontrol = useMemo<OrbitControlsImpl>(
	// 	() => new OrbitControlsImpl(orthographicCamera, document.createElement('div')),
	// 	[orthographicCamera]
	// );

	useEffect(() => {
		const frame = scene.children.find((c) => c.name === 'Plane');
		if (frame) frame.visible = false;
		perspectiveCamera.position.set(15, 15, 15);
		orthographicCamera.position.set(15, 15, 15);
	}, [scene, perspectiveCamera, orthographicCamera]);

	const onCreate = useCallback(() => {
		// orbitcontrol.target.set(0, 3, 0);
		// orbitcontrol.update();
		// orbitcontrol.enabled = false;
		// orbitcontrol.dispose();
		orthographicCamera.left = canvasRef.current.width / -ORTHOGRAPHIC_CAMERA_SIZE;
		orthographicCamera.right = canvasRef.current.width / ORTHOGRAPHIC_CAMERA_SIZE;
		orthographicCamera.top = canvasRef.current.height / ORTHOGRAPHIC_CAMERA_SIZE;
		orthographicCamera.bottom = canvasRef.current.height / -ORTHOGRAPHIC_CAMERA_SIZE;
		orthographicCamera.lookAt(0, 2, 0);
		orthographicCamera.updateProjectionMatrix();
	}, [orthographicCamera]);

	useEffect(() => {
		onCreate();
	}, [onCreate]);

	const { selection, hover } = useAppState();

	useEffect(() => {
		if (selection === SELECTION.GALLERY) {
			const obj3 = new Object3D();
			obj3.position.set(-3, 3, 0);
			obj3.lookAt(5, 3, 0);

			const t = { n: orthographicCamera.zoom };

			new TWEEN.Tween(orthographicCamera.position).to(obj3.position).easing(TWEEN.Easing.Quadratic.InOut).start();
			new TWEEN.Tween(orthographicCamera.quaternion).to(obj3.quaternion).easing(TWEEN.Easing.Quadratic.InOut).start();
			new TWEEN.Tween(t)
				.to({ n: 3 })
				.easing(TWEEN.Easing.Quadratic.InOut)
				.onUpdate((o) => {
					orthographicCamera.zoom = o.n;
					orthographicCamera.updateProjectionMatrix();
				})
				.start();
		}
	}, [orthographicCamera, orthographicCamera.position, orthographicCamera.rotation, selection]);

	useEffect(() => {
		const i = setInterval(() => {
			if (TWEEN.update()) invalidate();
		}, 1000 / 60);
		return () => clearInterval(i);
	}, []);

	return (
		<Canvas
			style={{ width: '100%', height: '100%', cursor: hover === SELECTION.NONE ? 'default' : 'pointer' }}
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

			<Wall />
			<primitive object={scene} />
		</Canvas>
	);
};
