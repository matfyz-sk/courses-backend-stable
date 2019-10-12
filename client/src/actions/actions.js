import { requests } from '../services';

export const actions = {
    actionCallingApi
};

function actionCallingApi(param1, param2) {
    return function(dispatch) {
        // call API requests here
        // then call classic Redux action
        var responseData = {
            foo: "example1",
            bar: "example2"
        };
        dispatch(classicAction(responseData));
    }
}

export function classicAction(responseData) {
    return {
        type: "CLASSIC_ACTION",
        foo: responseData.foo,
        bar: responseData.bar
    }
}
