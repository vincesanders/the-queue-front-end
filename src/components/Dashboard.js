import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TicketList from './TicketList';
import CreateTicket from './CreateTicket';
import styled from 'styled-components';

export default () => {
    const [updateTickets, setUpdateTickets] = useState(false)
    return (
        <Container>
            <Sidebar />
            <TicketList updateTickets={updateTickets} setUpdateTickets={setUpdateTickets} />
            <CreateTicket setUpdateTickets={setUpdateTickets} />
        </Container>
    );
}

const Container = styled.div`
    display: flex;
`