import { createStore, applyMiddleware } from "redux";

let store = createStore(rootReducer, {});
export default {
    store,
    observeStore: (select, onChange) => {
        let currentState;

        const handleChange = () => {
            let nextState = select(store.getState());
            if (nextState !== currentState) {
                currentState = nextState;
                onChange(currentState);
            }
        }

        let unsubscribe = store.subscribe(handleChange);
        handleChange();
        return unsubscribe;
    }
};
