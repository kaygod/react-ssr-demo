export const actions = {
  getList() {
    return function (dispatch) {
      return new Promise((resolve) => {
        setTimeout(() => {
          dispatch({
            type: 'UPDATE_LIST',
            value: [
              {
                name: 'kay',
                score: 90,
              },
              {
                name: 'san',
                score: 95,
              },
            ],
          });
          resolve(null);
        }, 500);
      });
    };
  },
};
