import { Canvas } from '@react-three/fiber';
import { Euler } from 'three';

export const Temp = () => {
	return (
		<Canvas>
			<pointLight />
			<mesh rotation={new Euler(10, 1, 1)} />
		</Canvas>
	);
};
