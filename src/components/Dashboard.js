import React from 'react';
import Sidebar from './Sidebar';
import TicketList from './TicketList';
import CreateTicket from './CreateTicket';
import styled from 'styled-components';

export default () => {
    return (
        <Container>
            <Sidebar />
            <TicketList />
            <CreateTicket />
        </Container>
    );
}

const Container = styled.div`
    display: flex;
`