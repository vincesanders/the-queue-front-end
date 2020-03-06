import React, {useState, useEffect} from 'react'
import { useHistory } from 'react-router-dom';
import { axiosWithAuth } from '../utils/axiosWithAuth';
import TicketCard from '../components/TicketCard'
import styled from 'styled-components';

const TicketList = ({ updateTickets }) => {
    const history = useHistory();
    const [tickets, setTickets] = useState([
    // {
        // id: "",
        // asker_id: "",
        // created_at: "",
        // title: "",
        // description: "",
        // category: "",
        // resolved: "",
        // being_solved: "",
        // solved_by: "",
        // assignee: "",
        // assigned_by: ""
    // }
    ]);

    const getAllTickets = (id) =>{
        axiosWithAuth()
        .get(`api/tickets/all/newest`)
        .then(res => {
            const ticketData = res.data;
            setTickets(ticketData);
        })
        .catch(err => {
            console.log('Error', err.respond);
            //If unable to load initial tickets, it's likely due to
            //an expired token. We need to route the user back to login
            //when their token expires.
            history.push('/login');
        });
    }

    useEffect(() => {
        getAllTickets();
    }, [updateTickets]);


    return (
        <Container className="card-container">
            {/* <TicketCard tickets={tickets} toHome={toHome} /> */}
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
    div:nth-child(1) {
        margin-top: 40px;
    }
`
