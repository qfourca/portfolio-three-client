import { useRecoilState } from 'recoil';

import { hover as hoverState } from '@/store/hover';
import { selection as selectionState, SELECTION } from '@/store/selection';

export const useAppState = () => {
	const [hover, setHover] = useRecoilState(hoverState);
	const [selection, setSelection] = useRecoilState(selectionState);

	return {
		hover: hover === selection ? SELECTION.NONE : hover,
		selection,
		setHover,
		setSelection,
	};
};

export const useMyAppState = (me: SELECTION) => {
	const { hover, setHover, selection, setSelection } = useAppState();

	return {
		hover: hover === me,
		selection: selection === me,
		setHover,
		setSelection,
	};
};
