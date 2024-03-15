import { Canvas, RootState } from '@react-three/fiber';
import { useRef } from 'react';
import { Color, OrthographicCamera } from 'three';

export const Temp = () => {
	const canvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));

	return (
		<>
			<div
				style={{
					width: 900,
					height: 100,
					position: 'absolute',
					zIndex: 100,
					backgroundColor: '#FF0000',
					top: 429,
				}}
			/>
			<Canvas
				style={{ width: '100%', height: '100%' }}
				ref={canvasRef}
				onCreated={(props: RootState) => {
					const { camera, gl } = props;
					if (camera instanceof OrthographicCamera) {
						const { clientWidth: width, clientHeight: height } = gl.domElement;

						camera.left = width / -2;
						camera.right = width / 2;
						camera.top = height / 2;
						camera.bottom = height / -2;

						camera.position.set(0, 0, -10);
						camera.far = 20;
						camera.near = 1;
						camera.lookAt(0, 0, 0);
					}
				}}>
				<ambientLight intensity={Math.PI} />
				<mesh position={[0, 0, 0]}>
					<boxGeometry args={[900, 100, 1]} />
					<meshStandardMaterial color={new Color(0xff0000)} />
				</mesh>
			</Canvas>
		</>
	);
};
