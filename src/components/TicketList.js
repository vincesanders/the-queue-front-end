import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTicketsByNewest } from '../state/actions/actions';
import TicketCard from '../components/TicketCard';
import styled from 'styled-components';

const TicketList = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const tickets = useSelector(state => state.tickets);
    const errors = useSelector(state => state.errors);

    //on the first render
    useEffect(() => {
        dispatch(getAllTicketsByNewest());
    },[]);

    if (errors.length > 0) {
        //If unable to load tickets, it's likely due to
        //an expired token. We need to route the user back to login
        //when their token expires.
        history.push('/login');
    }

    return (
        <Container className="card-container">
            {tickets.length > 0 ? tickets.map(ticket => <TicketCard key={ticket.id} ticket={ticket} />) :
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
