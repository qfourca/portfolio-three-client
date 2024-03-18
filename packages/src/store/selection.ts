import { atom } from 'recoil';

export const enum SELECTION {
	NONE = 0,
	GALLERY,
}

export const selection = atom<SELECTION>({
	key: 'selection',
	default: SELECTION.NONE,
});
