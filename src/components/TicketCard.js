import React, { useRef, useEffect, useState } from 'react';
// import { CardTitle, CardText } from 'reactstrap';
import styled from "styled-components";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const TicketCard = ({ ticket }) => {
    const containerDiv = useRef(null);
    const [modal, setModal] = useState(false);
    const ticketCreated = new Date(ticket.created_at);
    const elapsedTimeMs = Date.now() - ticketCreated;
    let days = undefined;
    let hours = undefined;
    let minutes = undefined;
    let ticketColor = 'gray';
    switch (ticket.category) {
        case 'HTML':
            ticketColor = '#ff6332';
            break;
        case 'CSS':
            ticketColor = '#007aff';
            break;
        case 'JavaScript':
            ticketColor = '#f7df1e';
            break;
        case 'React':
            ticketColor = '#47c8e8';
            break;
        case 'Redux':
            ticketColor = '#764abc';
            break;
        case 'Git':
            ticketColor = '#F1502F';
            break;
        case 'Node':
            ticketColor = '#68A063';
            break;
        case 'Testing':
            ticketColor = '#e9153e';
            break;
        case 'Python':
            ticketColor = '#ffe873';
            break;
        case 'Java':
            ticketColor = '#5382a1';
            break;
        case 'SQL':
            ticketColor = '#2f2c49';
            break;
        default:
            ticketColor = '#656378';
            break;
    }
    if (elapsedTimeMs / (1000*60*60*24) > 1) {
        days = Math.round(elapsedTimeMs / (1000*60*60*24));
    } else if (elapsedTimeMs / (1000*60*60) > 1) {
        hours = Math.round(elapsedTimeMs / (1000*60*60));
    } else {
        minutes = Math.round(elapsedTimeMs / (1000*60));
    }

    const calculateElapsedTime = () => {
        if (days) {
            return days > 1 ? 
            (<>{days}<br />days<br /></>) : 
            (<>{days}<br />day<br /></>);
        } else if (hours) {
            return hours > 1 ? 
            (<>{hours}<br />hours<br /></>) :
            (<>{hours}<br />hour<br /></>);
        } else {
            return minutes > 1 ? 
            (<>{minutes}<br />mins<br /></>) :
            (<>{minutes}<br />min<br /></>);
        }
    }

    useEffect(() => {
        containerDiv.current.style = `border-left: 8px solid ${ticketColor};`
    })

    const toggleModal = (e) => {
        e.stopPropagation();
        setModal(!modal);
    }

    const closeBtn = <button className="close" onClick={toggleModal}>&times;</button>;

    return (
        <Container ref={containerDiv} onClick={toggleModal} >
            <span>
                {calculateElapsedTime()}
                <span>old</span>
            </span>
            <div>
                <h3>{ticket.category} issue</h3>
                <p>{ticket.title}</p>
            </div>
            <div>
                {ticket.asker.image ? <img  src={ticket.asker.image} alt={`${ticket.asker.username}'s profile picture`} /> : <></> }
            </div>
            <Modal className='my-modal' isOpen={modal} toggle={toggleModal} backdrop={false} fade={false}>
                <ModalHeader toggle={toggleModal} close={closeBtn}>{ticket.title}</ModalHeader>
                <ModalBody>
                    <p>{ticket.description}</p>
                </ModalBody>
                <ModalFooter>
                    <div>
                        <h4>Comments:</h4>
                        {ticket.comments.length > 0 ? ticket.comments.map(comment => {
                            return (
                                <div key={comment.id} >
                                    <p><span>{comment.first_name} {comment.last_name}: </span>{comment.comment}</p>
                                </div>
                            );
                        }) :
                <div><p>Be the first to comment.</p></div>}
                    </div>
                    <Button color="primary" onClick={toggleModal}>Do Something</Button>{' '}
                    <Button color="secondary" onClick={toggleModal}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </Container>
    );
};

const Container = styled.div`
    width: 96%;
    display: flex;
    flex-wrap: wrap;
    background-color: #fff;
    margin: 5px auto;
    padding: 20px 0;
    cursor: pointer;
    span {
        width: 18%;
        text-align: center;
        border-right: 2px solid rgba(71, 200, 232, 0.6);
        text-transform: uppercase;
        span {
            color: #c717c4;
            border-right: none;
        }
    }
    div:nth-child(2) {
        width: 60%;
    }
    div {
        width: 20%;
        h3 {
            text-align: left;
            margin: 0;
            padding-left: 20px;
        }
        p {
            text-align: left;
            margin: 0;
            font-size: 0.8rem;
            padding-left: 20px;
        }
        img {
            float: right;
            margin-right: 10px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
        }
    }
`
    
export default TicketCard;