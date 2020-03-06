import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TicketList from './TicketList';
import CreateTicket from './CreateTicket';

export default () => {
    const [updateTickets, setUpdateTickets] = useState(false)
    return (
        <div>
            <Sidebar />
            <CreateTicket setUpdateTickets={setUpdateTickets} />
            <TicketList updateTickets={updateTickets} setUpdateTickets={setUpdateTickets} />
        </div>
    );
}