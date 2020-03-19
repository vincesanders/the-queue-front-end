import { UPDATE_TICKETS, ADD_ERROR } from '../actions/actions';

const initialState = {
    tickets: [],
    errors: []
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_TICKETS:
            //payload is all tickets that will be displayed on ticket list.
            return {
                ...state,
                tickets: action.payload,
                errors: []
            }
        case ADD_ERROR:
            return {
                ...state,
                errors: [
                    ...state.errors,
                    action.payload
                ]
            }
        default:
            return state;
    }
}

export default reducer;