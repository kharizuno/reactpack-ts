import { arrayCheck } from "../helpers";

export function propLess (action: any, state: any, data: any) {
    let dt = action.payload;
    if (dt.unmount === undefined) {
        if (Object.keys(state[data]).length > 0) {
            dt = state[data];
            
            if (action.multiple && action.multiple.type) {
                if (action.multiple.nested) {
                    if (typeof action.multiple.nested === 'boolean') {
                        if (dt[action.multiple.type] && dt[action.multiple.type] !== undefined) {
                            dt[action.multiple.type].push(action.payload)
                        } else {
                            dt[action.multiple.type] = [action.payload]
                        }                  
                    } else {
                        if (dt[action.multiple.type] && dt[action.multiple.type] !== undefined) {
                            if (Object.prototype.toString.call(dt[action.multiple.type]) === '[object Array]') {
                                let idx = arrayCheck(dt[action.multiple.type], action.multiple.nested, 'key', true);
                                if (idx < 0) {
                                    dt[action.multiple.type].push({
                                        key: action.multiple.nested,
                                        data: action.payload
                                    })
                                }
                            }
                        } else {
                            dt[action.multiple.type] = [{
                                key: action.multiple.nested,
                                data: action.payload
                            }]
                        }
                    }
                } else {
                    dt[action.multiple.type] = action.payload;
                }
            } else {
                dt = (action.payload) ? action.payload : state[data];
            }
        } else {
            if (action.multiple && action.multiple.type) {
                if (action.multiple.nested) {
                    if (typeof action.multiple.nested === 'boolean') {
                        dt = {[action.multiple.type]: [action.payload]}
                    } else {
                        dt = {[action.multiple.type]: [
                            {
                                key: action.multiple.nested,
                                data: action.payload
                            }
                        ]}
                    }                    
                } else {
                    dt = {[action.multiple.type]: action.payload}
                }                    
            }
        }
    } else {
        // console.log('CANCELLED', data)
        dt = state[data];
    }

    return dt;
}