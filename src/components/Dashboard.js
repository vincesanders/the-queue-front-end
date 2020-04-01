import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import TicketList from './TicketList';
import CreateTicket from './CreateTicket';
import styled from 'styled-components';
import LoadingSpinner from './LoadingSpinner';

export default () => {
    const isLoading = useSelector(state => state.isLoading);
    return (
        <Container>
            {isLoading ? <LoadingSpinner /> : <></>}
            <Sidebar />
            <TicketList />
            <CreateTicket />
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    @media screen and (max-width: 1200px) {
        flex-wrap: wrap;
    }
`