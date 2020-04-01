import { 
    UPDATE_TICKETS,
    UPDATE_TEAM_LEADS,
    UPDATE_COMMENTS,
    ADD_ERROR, 
    SORT_TICKETS_NEWEST, 
    SORT_TICKETS_OLDEST, 
    FILTER_OPEN_TICKETS,
    FILTER_CLOSED_TICKETS,
    FILTER_TICKETS_CATEGORY,
    REMOVE_TICKET,
    SET_USER_ID,
    SET_USER_ROLE, 
    SET_USER,
    TOGGLE_LOADING,
    SET_LOADING,
    RESET_STATE } from '../actions/actions';

const initialState = {
    userId: 0,
    userRole: 'none',
    isLoading: false,
    user: {},
    tickets: [],
    teamLeads: [],
    errors: []
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_ID:
            return {
                ...state,
                userId: action.payload
            }
        case SET_USER_ROLE:
            return {
                ...state,
                userRole: action.payload
            }
        case SET_USER:
            return {
                ...state,
                user: {
                    ...action.payload
                }
            }
        case TOGGLE_LOADING:
            return {
                ...state,
                isLoading: !state.isLoading
            }
        case SET_LOADING:
            return {
                ...state,
                isLoading: action.payload
            }
        case UPDATE_TICKETS:
            //payload is all tickets that will be displayed on ticket list.
            return {
                ...state,
                tickets: action.payload,
                errors: []
            };
        case UPDATE_TEAM_LEADS:
            return {
                ...state,
                errors: [],
                teamLeads: action.payload
            };
        case UPDATE_COMMENTS:
            return {
                ...state,
                tickets: [
                    ...state.tickets,
                    state.tickets[state.tickets.findIndex(ticket => (ticket.id === action.payload.ticket_id))].comments = [

                                ...state.tickets[state.tickets.findIndex(ticket => (ticket.id === action.payload.ticket_id))].comments,
                                ...action.payload.comment
                            ]
                ]
            };
        case SORT_TICKETS_NEWEST:
            return {
                ...state,
                tickets: [
                    ...state.tickets.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                ]
            };
        case SORT_TICKETS_OLDEST:
            return {
                ...state,
                tickets: [
                    ...state.tickets.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
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
            };
        case REMOVE_TICKET:
            return {
                ...state,
                tickets: [
                    ...state.tickets.filter(ticket => ticket.id !== action.payload)
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
        case RESET_STATE:
            return {
                ...initialState
            };
        default:
            return state;
    }
}

export default reducer;