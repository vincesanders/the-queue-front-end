import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTicketsByNewest, getallTeamLeads } from '../state/actions/actions';
import TicketCard from '../components/TicketCard';
import styled from 'styled-components';

const TicketList = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const tickets = useSelector(state => state.tickets);
    const errors = useSelector(state => state.errors);
    const userRole = useSelector(state => {
        if (state.userRole !== 'none') {
            return state.userRole;
        } else if (localStorage.getItem('role')) {
            return localStorage.getItem('role');
        } else {
            //if there isn't a role in state or local storage
            //the user will have to login.
            history.push('/login');
        }
    });

    //on the first render
    useEffect(() => {
        dispatch(getAllTicketsByNewest());
        //if user is a section lead, add TL list to state.
        if(userRole === 'section lead') {
            dispatch(getallTeamLeads());
        }
    },[]);

    if (errors.length > 0) {
        //If unable to load tickets, it's likely due to
        //an expired token. We need to route the user back to login
        //when their token expires.
        history.push('/login');
    }

    return (
        <Container className="card-container">
            {tickets.length > 0 ? tickets.map((ticket, i) => <TicketCard key={ticket.id} ticket={ticket} index={i} />) :
            <div><h3>The Queue is empty.</h3></div>}
        </Container>
    )
}

export default TicketList;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 45%;
    margin-left: 20%;
    div {
        h3 {
            margin-top: 20px;
        }
    }
`
