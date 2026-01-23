import { atomWithReducer } from 'jotai/utils';
import { createInitialState, reducer } from './reducer';
import { WritableAtom } from 'jotai';
import { MainData } from './model';
import { MainAction } from './actions';

export const mainStateAtom: WritableAtom<MainData, [MainAction], void> = atomWithReducer(createInitialState(), reducer);
