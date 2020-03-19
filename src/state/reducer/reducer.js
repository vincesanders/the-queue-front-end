import { UPDATE_TICKETS, ADD_ERROR, SORT_TICKETS_NEWEST, SORT_TICKETS_OLDEST } from '../actions/actions';

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
            };
        case SORT_TICKETS_NEWEST:
            console.log('SORT_TICKETS_NEWEST reducer switch case');
            return {
                ...state,
                tickets: [
                    ...state.tickets.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                ]
            };
        case SORT_TICKETS_OLDEST:
            console.log('SORT_TICKETS_OLDEST reducer switch case');
            return {
                ...state,
                tickets: [
                    ...state.tickets.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                ]
            };
        case ADD_ERROR:
            return {
                ...state,
                errors: [
                    ...state.errors,
                    action.payload
                ]
            };
        default:
            return state;
    }
}

export default reducer;