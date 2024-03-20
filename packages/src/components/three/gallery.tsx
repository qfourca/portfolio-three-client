import { invalidate, useThree } from '@react-three/fiber';
import * as TWEEN from '@tweenjs/tween.js';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import {
	ClampToEdgeWrapping,
	Color,
	Group,
	LinearFilter,
	Mesh,
	MeshBasicMaterial,
	TextureLoader,
	Vector3,
	sRGBEncoding,
} from 'three';

import { useMyAppState } from '@/hook/useAppState';
import { SELECTION } from '@/store/selection';

class PhotoBuilder {
	private idx: number = 0;

	private mainIdx: number = 0;

	private textureLoader: TextureLoader;

	constructor(private origin: Group) {
		origin.rotation.set(0, -Math.PI / 2, 0);
		origin.position.set(0, 0, 0);
		this.textureLoader = new TextureLoader();
	}

	public build(info: ProjectInfo) {
		const isMain = info.tag === '대표 프로젝트';

		const photo = this.origin.clone();
		if (isMain) photo.position.set(-3 + (this.mainIdx % 4) * 2, 1.5, 0);
		else photo.position.set(-3 + (this.idx % 4) * 2, -Math.floor(this.idx / 4) * 1.5, 0);

		const material = new MeshBasicMaterial();
		material.map = this.textureLoader.load(info.thumbnail, (t) => {
			const add = (t.image.height + t.image.width) / 3;
			photo.scale.set(0, 0, 0);
			photo.visible = true;
			new TWEEN.Tween(photo.scale)
				.to(new Vector3(1, add / t.image.width, add / t.image.height))
				.easing(TWEEN.Easing.Quadratic.InOut)
				.start();

			this.setMaterial(material);
			invalidate();
		});

		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		(photo.children[1] as Mesh).material = material;
		if (isMain) this.mainIdx += 1;
		else this.idx += 1;
		return photo;
	}

	// eslint-disable-next-line class-methods-use-this
	private setMaterial(material: MeshBasicMaterial) {
		const texture = material.map!;
		texture.wrapS = ClampToEdgeWrapping;
		texture.wrapT = ClampToEdgeWrapping;
		texture.minFilter = LinearFilter;
		texture.magFilter = LinearFilter;

		texture.flipY = false;
		texture.offset.x = 0.5;

		texture.rotation = Math.PI / 2;
		texture.center.x = 0.5;
		texture.center.y = 0.5;
		texture.repeat.set(4, 4);
		texture.encoding = sRGBEncoding;

		material.map = texture;
		material.needsUpdate = true;
	}
}

interface GalleryProps {
	wallColor: Color;
}

interface ProjectInfo {
	title: string;
	thumbnail: string;
	tag: string;
	start_at: string;
	end_at: string;
}

export const Gallery: React.FC<GalleryProps> = ({ wallColor }) => {
	const { hover, setHover, setSelection } = useMyAppState(SELECTION.GALLERY);
	const wallHoverColor = useMemo(() => new Color(0x89fcfc), []);
	const three = useThree();

	const [photos, setPhotos] = useState<Array<Group>>([]);

	useEffect(() => {
		const photoOrigin = three.scene.getObjectByName('Photo') as Group;
		photoOrigin.visible = false;
		axios.get<Array<ProjectInfo>>('http://localhost:8000/project').then(({ data }) => {
			const photoBuilder = new PhotoBuilder(photoOrigin);

			setPhotos(data.map((info) => photoBuilder.build(info)));
		});
	}, [three.scene]);

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
