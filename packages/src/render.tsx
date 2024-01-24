import ReactDOM from 'react-dom/client';

import { Temp } from '@/components/dom/temp';

export const render = (domElement: HTMLElement) => {
	ReactDOM.createRoot(domElement).render(<Temp />);
};
