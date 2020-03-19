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