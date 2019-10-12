const initialState = {
    foo: "initFoo",
    bar: "initBar"
};

export function main(state = initialState, action) {
    switch (action.type) {
        case 'CLASSIC_ACTION':
            return {
                ...state,
                foo: action.foo,
                bar: action.bar
            };
        default:
            return state;
    }
}
