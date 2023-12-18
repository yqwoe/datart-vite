import {
  CreateSliceOptions,
  createSlice as createSliceOriginal,
  SliceCaseReducers
} from '@reduxjs/toolkit';
import { RootStateKeyType } from '../types/injector-typings';

/* Wrap createSlice with stricter Name options */

/* istanbul ignore next */
export const createSlice = <
  State,
  CaseReducers extends SliceCaseReducers<State>,
  Name extends RootStateKeyType,
>(
  options: CreateSliceOptions<State, CaseReducers, Name>,
) => createSliceOriginal(options);
