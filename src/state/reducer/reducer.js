import { 
    UPDATE_TICKETS, 
    ADD_ERROR, 
    SORT_TICKETS_NEWEST, 
    SORT_TICKETS_OLDEST, 
    FILTER_OPEN_TICKETS,
    FILTER_CLOSED_TICKETS,
    FILTER_TICKETS_CATEGORY,
    SET_USER_ID } from '../actions/actions';

const initialState = {
    userId: 0,
    tickets: [],
    errors: []
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_ID:
            return {
                ...state,
                userId: action.payload
            }
        case UPDATE_TICKETS:
            //payload is all tickets that will be displayed on ticket list.
            return {
                ...state,
                tickets: action.payload,
                errors: []
            };
        case SORT_TICKETS_NEWEST:
            return {
                ...state,
                tickets: [
                    ...state.tickets.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                ]
            };
        case SORT_TICKETS_OLDEST:
            return {
                ...state,
                tickets: [
                    ...state.tickets.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                ]
            };
        case FILTER_OPEN_TICKETS:
            return {
                ...state,
                tickets: [
                    ...action.payload.filter(ticket => (ticket.resolved === false && ticket.being_solved === false))
                ]
            };
        case FILTER_CLOSED_TICKETS:
            return {
                ...state,
                tickets: [
                    ...action.payload.filter(ticket => ticket.resolved)
                ]
            };
        case FILTER_TICKETS_CATEGORY:
            return {
                ...state,
                tickets: [
                    ...action.payload.tickets.filter(ticket => ticket.category === action.payload.category)
                ]
            }
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