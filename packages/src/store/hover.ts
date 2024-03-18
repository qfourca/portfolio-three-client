import { atom } from 'recoil';

import { SELECTION } from './selection';

export const hover = atom<SELECTION>({
	key: 'hover',
	default: SELECTION.NONE,
});
