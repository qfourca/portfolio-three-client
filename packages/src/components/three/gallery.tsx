import { useThree } from '@react-three/fiber';
import * as TWEEN from '@tweenjs/tween.js';
import { useEffect, useMemo, useState } from 'react';
import { Color, Group, Vector3 } from 'three';

import { useMyAppState } from '@/hook/useAppState';
import { SELECTION } from '@/store/selection';

interface GalleryProps {
	wallColor: Color;
}

export const Gallery: React.FC<GalleryProps> = ({ wallColor }) => {
	const { hover, setHover, setSelection } = useMyAppState(SELECTION.GALLERY);
	const wallHoverColor = useMemo(() => new Color(0x89fcfc), []);
	const three = useThree();
	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	const photoOrigin = useMemo(() => three.scene.getObjectByName('Photo'), [three]) as Group;

	const [photos, setPhotos] = useState<Array<Group>>([]);

	useEffect(() => {
		if (photoOrigin) {
			photoOrigin.visible = false;
			photoOrigin.rotation.set(0, -Math.PI / 2, 0);
			photoOrigin.position.set(0, 0, 0);
			if (photos.length === 0) {
				photoOrigin.visible = true;
				setPhotos([photoOrigin.clone(), photoOrigin.clone(), photoOrigin.clone()]);
				photoOrigin.visible = false;
			}
		}
	}, [photoOrigin, photos.length]);

	useEffect(() => {
		photos.map((p) =>
			new TWEEN.Tween(p.scale)
				.to(hover ? new Vector3(1.1, 1.1, 1.1) : new Vector3(1, 1, 1), 200)
				.easing(TWEEN.Easing.Quadratic.InOut)
				.start()
		);
	}, [hover, photos]);

	return (
		<mesh
			position={[-5, 3, 0]}
			rotation={[0, Math.PI / 2, 0]}
			onPointerEnter={() => setHover(SELECTION.GALLERY)}
			onPointerLeave={() => setHover(SELECTION.NONE)}
			onClick={() => {
				setSelection(SELECTION.GALLERY);
			}}>
			<planeGeometry args={[10, 6]} />
			<meshStandardMaterial color={hover ? wallHoverColor : wallColor} />
			{photos.map((p, idx) => (
				<primitive object={p} idx={idx} />
			))}
		</mesh>
	);
};
