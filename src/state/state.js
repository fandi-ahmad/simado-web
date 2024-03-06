import { createGlobalState } from 'react-hooks-global-state'

const initialState = {
  asideClass: 'shadow-soft-xl',
};
const { useGlobalState } = createGlobalState(initialState);

export { useGlobalState }