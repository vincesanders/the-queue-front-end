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

export const UPDATE_TICKETS = "UPDATE_TICKETS";
export const SORT_TICKETS_NEWEST = "SORT_TICKETS_NEWEST";
export const SORT_TICKETS_OLDEST = "SORT_TICKETS_OLDEST";
export const ADD_ERROR = "ADD_ERROR";

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

export const getMyTickets = () => dispatch => {

}

export const getOpenTickets = () => dispatch => {

}

export const getClosedTickets = () => dispatch => {

}

export const getTicketsFilteredByCategory = () => dispatch => {

}

export const searchTickets = () => dispatch => {

}

export const sortTicketsNewest = () => dispatch => {
    console.log('sortTicketsNewest called')
    dispatch({ type: SORT_TICKETS_NEWEST });
}

export const sortTicketsOldest = () => dispatch => {
    dispatch({ type: SORT_TICKETS_OLDEST });
    console.log('sortTicketsOldest called')
}