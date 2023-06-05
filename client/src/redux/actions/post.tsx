import * as t from '../../constants/initialType';

export const clearPost = () => async (dispatch: any) => {
    dispatch({type: t.CLEAR_POST, payload: false, multiple: {type: t.CLEAR_POST}});
}

export const loadPost = (dt: any) => async (dispatch: any) => {
    dispatch({type: t.LOAD_POST, payload: dt});
}