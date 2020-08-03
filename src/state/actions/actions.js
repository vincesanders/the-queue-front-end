import axiosWithAuth from '../../utils/axiosWithAuth';

export const SET_USER_ID = "SET_USER_ID";
export const SET_USER_ROLE = "SET_USER_ROLE";
export const SET_USER = "SET_USER";
export const TOGGLE_LOADING = "TOGGLE_LOADING";
export const SET_LOADING = "SET_LOADING";
export const UPDATE_TICKETS = "UPDATE_TICKETS";
export const UPDATE_TEAM_LEADS = "UPDATE_TEAM_LEADS";
export const UPDATE_COMMENTS = "UPDATE_COMMENTS";
export const SORT_TICKETS_NEWEST = "SORT_TICKETS_NEWEST";
export const SORT_TICKETS_OLDEST = "SORT_TICKETS_OLDEST";
export const FILTER_OPEN_TICKETS = "FILTER_OPEN_TICKETS";
export const FILTER_CLOSED_TICKETS = "FILTER_CLOSED_TICKETS";
export const FILTER_TICKETS_CATEGORY = "FILTER_TICKETS_CATEGORY";
export const REMOVE_TICKET = "REMOVE_TICKET";
export const ADD_ERROR = "ADD_ERROR";
export const RESET_STATE = "RESET_STATE";

export const setUserId = id => dispatch => {
    dispatch({ type: SET_USER_ID, payload: id });
}

export const setUserRole = role => dispatch => {
    dispatch({ type: SET_USER_ROLE, payload: role });
}

export const setUser = user => dispatch => {
    setUserId(user.id);
    setUserRole(user.role);
    dispatch({ type: SET_USER, payload: user });
}

export const toggleLoading = () => dispatch => {
    dispatch({ type: TOGGLE_LOADING });
}

export const setLoading = boolean => dispatch => {
    dispatch({ type: SET_LOADING, payload: boolean});
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
export const getMyTickets = userId => dispatch => {
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
    axiosWithAuth()
    .get(`api/tickets/all/newest`)
    .then(res => {
        dispatch({ type: FILTER_OPEN_TICKETS, payload: res.data });
    })
    .catch(err => {
        console.log('Error', err.respond);
        dispatch({ type: ADD_ERROR, payload: err });
    });
}

export const getClosedTickets = () => dispatch => {
    axiosWithAuth()
    .get(`api/tickets/all/newest`)
    .then(res => {
        dispatch({ type: FILTER_CLOSED_TICKETS, payload: res.data });
    })
    .catch(err => {
        console.log('Error', err.respond);
        dispatch({ type: ADD_ERROR, payload: err });
    });
}

export const getTicketsFilteredByCategory = category => dispatch => {
    axiosWithAuth()
    .get(`api/tickets/all/newest`)
    .then(res => {
        dispatch({ type: FILTER_TICKETS_CATEGORY, payload: { tickets: res.data, category: category} });
    })
    .catch(err => {
        console.log('Error', err.respond);
        dispatch({ type: ADD_ERROR, payload: err });
    });
}

export const getallTeamLeads = () => dispatch => {
    axiosWithAuth()
    .post(`api/users/getby/filter`, { role: 'team lead' })
    .then(res => {
        //returns an array of team leads
        dispatch({ type: UPDATE_TEAM_LEADS, payload: res.data });
    })
    .catch(err => {
        console.log('Error', err.respond);
        dispatch({ type: ADD_ERROR, payload: err });
    });
}

export const searchTickets = (searchValue, searchByOption) => dispatch => {
    axiosWithAuth()
    .post(`api/tickets/getby/filter`, { [searchByOption]: searchValue })
    .then(res => {
        dispatch({ type: UPDATE_TICKETS, payload: res.data });
    })
    .catch(err => {
        console.log('Error', err.respond);
        dispatch({ type: ADD_ERROR, payload: err });
    });
}

export const sortTicketsNewest = () => dispatch => {
    dispatch({ type: SORT_TICKETS_NEWEST });
}

export const sortTicketsOldest = () => dispatch => {
    dispatch({ type: SORT_TICKETS_OLDEST });
}

export const removeTicket = ticketId => dispatch => {
    console.log('this is ticketId in removeTicket action: ', ticketId);
    axiosWithAuth()
    .delete(`api/tickets/${ticketId}`)
    .then(res => {
        //res.data is the deleted ticket.
        dispatch({ type: REMOVE_TICKET, payload: res.data.id });
    })
    .catch(err => {
        console.log('Error', err, '\n', err.message, '\n', err.errorMessage);
    });
}

export const resetState = () => dispatch => {
    dispatch({ type: RESET_STATE });
}