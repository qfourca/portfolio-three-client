import { render } from './render';

export const init = async () => {
	const domElement = document.getElementById('root')!;
	render(domElement);
};

init();
