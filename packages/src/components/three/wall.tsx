import { useMemo } from 'react';
import { Color } from 'three';

import { Gallery } from './gallery';

export const Wall = () => {
	const wallColor = useMemo(() => new Color(0xe4f3f9), []);

	return (
		<>
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
			<Gallery wallColor={wallColor} />
		</>
	);
};
