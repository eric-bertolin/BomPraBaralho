import { configureStore, createSlice } from '@reduxjs/toolkit';

const colecaoSlice = createSlice({
  name: 'colecao',
  initialState: [],
  reducers: {
    adicionarCarta: (state, action) => {
      state.push(action.payload);
    },
  },
});

export const { adicionarCarta } = colecaoSlice.actions;

export const store = configureStore({
  reducer: {
    colecao: colecaoSlice.reducer,
  },
});
