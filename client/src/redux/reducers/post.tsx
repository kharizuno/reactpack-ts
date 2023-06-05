import * as t from '../../constants/initialType';

interface Data {
    postList: any
}

let data: Data = {
    postList: false
}

const postReducer = (state = data, action: any) => {
    switch(action.type) {
        case t.CLEAR_POST:
            state = {
                ...state,
                postList: (!action.payload) ? false : state.postList
            }
            break;
        case t.LOAD_POST:
            state = {
                ...state,
                postList: action.payload
            }
            break;
        default:
    }

    return state;
}

export default postReducer;