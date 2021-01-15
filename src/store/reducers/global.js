const defaultState = {
  name: 'kaygod',
  list: [],
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'UPDATE_LIST':
      return { ...state, list: action.value };
    default:
      return state;
  }
};
