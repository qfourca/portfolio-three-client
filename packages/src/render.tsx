import React from 'react';
import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';

import { Room } from './components/three/room';

export const render = (domElement: HTMLElement) => {
	ReactDOM.createRoot(domElement).render(
		<React.StrictMode>
			<RecoilRoot>
				<Room />
			</RecoilRoot>
		</React.StrictMode>
	);
};
