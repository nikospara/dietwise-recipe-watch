import { atom, WritableAtom } from 'jotai';
import { atomWithReducer } from 'jotai/utils';
import { createInitialState, reducer } from './reducer';
import { MainData } from './model';
import { MainAction } from './actions';

export const mainStateAtom: WritableAtom<MainData, [MainAction], void> = atomWithReducer(createInitialState(), reducer);

export const suggestionInFlightAtom = atom<Record<string, boolean>>({});
