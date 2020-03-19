import React, {useState, useEffect} from 'react'
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTicketsByNewest } from '../state/actions/actions';
import { axiosWithAuth } from '../utils/axiosWithAuth';
import TicketCard from '../components/TicketCard'
import styled from 'styled-components';

const TicketList = ({ updateTickets }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const tickets = useSelector(state => state.tickets);
    const errors = useSelector(state => state.errors);

    //on the first render
    useEffect(() => {
        dispatch(getAllTicketsByNewest());
    });

    if (errors.length > 0) {
        //If unable to load tickets, it's likely due to
        //an expired token. We need to route the user back to login
        //when their token expires.
        history.push('/login');
    }

    return (
        <Container className="card-container">
            {tickets.length > 0 ? tickets.map(ticket => <TicketCard key={ticket.id} ticket={ticket} />) :
            <div>Loading tickets...</div>}
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
`
