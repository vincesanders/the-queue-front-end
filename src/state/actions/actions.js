import axiosWithAuth from '../../utils/axiosWithAuth';
/*
 * get all open tickets
 * get all tickets associated with the user
 * get all closed tickets
 * get filtered tickets by category (maybe same as closed)
 * sort current tickets by newest (local state?)
 * sort current tickets by oldest (local state?)
 * search tickets by title or description
 * Add a comment to a ticket
 * submit a ticket
 */
export const SET_USER_ID = "SET_USER_ID";
export const UPDATE_TICKETS = "UPDATE_TICKETS";
export const SORT_TICKETS_NEWEST = "SORT_TICKETS_NEWEST";
export const SORT_TICKETS_OLDEST = "SORT_TICKETS_OLDEST";
export const FILTER_OPEN_TICKETS = "FILTER_OPEN_TICKETS";
export const FILTER_CLOSED_TICKETS = "FILTER_CLOSED_TICKETS";
export const ADD_ERROR = "ADD_ERROR";

export const setUserId = (id) => dispatch => {
    dispatch({ type: SET_USER_ID, payload: id });
}

export const getAllTicketsByNewest = () => dispatch => {
    axiosWithAuth()
    .get(`api/tickets/all/newest`)
    .then(res => {
        dispatch({ type: UPDATE_TICKETS, payload: res.data });
    })
    .catch(err => {
        console.log('Error', err.respond);
        dispatch({ type: ADD_ERROR, payload: err });
    });
}

export const getAllTickets = () => dispatch => {
    axiosWithAuth()
    .get(`api/tickets`)
    .then(res => {
        dispatch({ type: UPDATE_TICKETS, payload: res.data });
    })
    .catch(err => {
        console.log('Error', err.respond);
        dispatch({ type: ADD_ERROR, payload: err });
    });
}

//Gets tickets CREATED BY the user
export const getMyTickets = (userId) => dispatch => {
    axiosWithAuth()
    .get(`/api/users/asker/${userId}/tickets`)
    .then(res => {
        dispatch({ type: UPDATE_TICKETS, payload: res.data });
    })
    .catch(err => {
        console.log('Error', err.respond);
        dispatch({ type: ADD_ERROR, payload: err });
    });
}

export const getOpenTickets = () => dispatch => {
    dispatch({ type: FILTER_OPEN_TICKETS });
}

export const getClosedTickets = () => dispatch => {
    dispatch({ type: FILTER_CLOSED_TICKETS });
}

export const getTicketsFilteredByCategory = () => dispatch => {

}

export const searchTickets = () => dispatch => {

}

export const sortTicketsNewest = () => dispatch => {
    dispatch({ type: SORT_TICKETS_NEWEST });
}

export const sortTicketsOldest = () => dispatch => {
    dispatch({ type: SORT_TICKETS_OLDEST });
}