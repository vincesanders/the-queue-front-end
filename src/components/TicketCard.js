import React, { useRef, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from "styled-components";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGreaterThan } from '@fortawesome/free-solid-svg-icons'
import axiosWithAuth from '../utils/axiosWithAuth';

const TicketCard = ({ ticket }) => {
    const history = useHistory();
    const containerDiv = useRef(null);
    const userId = useSelector(state => {
        if (state.userId > 0) {
            return state.userId;
        } else if (localStorage.getItem('user')) {
            return localStorage.getItem('user');
        } else {
            return 0;
        }
    });
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
    const [modal, setModal] = useState(false);
    const [commentValue, setCommentValue] = useState("");
    const [comments, setComments] = useState(ticket.comments);
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
    //back-end will return the elapsed time in milliseconds
    //at ticket.created_at
    if (ticket.created_at / (1000*60*60*24) > 1) {
        days = Math.round(ticket.created_at / (1000*60*60*24));
    } else if (ticket.created_at / (1000*60*60) > 1) {
        hours = Math.round(ticket.created_at / (1000*60*60));
    } else {
        minutes = Math.round(ticket.created_at / (1000*60));
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

    const handleChange = e => {
        setCommentValue(e.target.value);
    }

    const handleSubmit = e => {
        e.preventDefault();
        //make sure a comments was entered
        if (commentValue.trim() !== '') {
            const comment = {
                commenter_id: userId,
                ticket_id: ticket.id,
                comment: commentValue
            }
            axiosWithAuth()
            .post(`api/tickets/${comment.ticket_id}/comments`, comment)
            .then(res => {
                //get the comment info for ticket
                setComments([...comments, res.data]);
            })
            .catch(err => {
                console.log('Error: ', err);
            });
            //reset value
            setCommentValue('');
        }
    }

    const displayTLBtn = role => {
        if (ticket.assignee === null && !ticket.resolved) {
            return (
                <button>Assign</button>
            );
        } else if (ticket.assignee === userId) {
            //style the button differently if the ticket is assigned
            //to the current user.
            return (
                <button className="assigned-to-me">Assigned</button>
            );
        } else if (ticket.resolved) {
            //If the ticket is resolved
            //disabled, can't click, cursor doesn't change
            return (
                <button className="resolved">Resolved</button>
            );
        } else {
            //ticket is assigned, but not to the user.
            return (
                <button className="assigned">Assigned</button>
            );
        }
    }

    return (
        <Container ref={containerDiv} onClick={toggleModal} className={ticket.resolved ? 'resolved-ticket' : ''} >
            <span>
                {calculateElapsedTime()}
                <span>old</span>
            </span>
            <div>
                <h3>{ticket.category} issue</h3>
                <p>{ticket.title}</p>
            </div>
            <div className="imgBtnContainer">
                {ticket.asker.image ? <img  src={ticket.asker.image} alt={`${ticket.asker.username}'s profile picture`} /> : <></> }
                {(userRole === 'team lead' ? displayTLBtn(userRole) : <></>)}
                {(userRole === 'section lead' ? displayTLBtn(userRole) : <></>)}
            </div>
            <Modal contentClassName='ticket-modal' isOpen={modal} toggle={toggleModal} backdrop={true} fade={false}>
                <ModalHeader toggle={toggleModal} close={closeBtn}>
                    <h2>{ticket.category} issue</h2>
                    {ticket.title}
                    </ModalHeader>
                <ModalBody>
                    <h3>Description of issue</h3>
                    <p>{ticket.description}</p>
                </ModalBody>
                <ModalFooter>
                    <div className='comment-container'>
                        <h4>Comments:</h4>
                        {ticket.comments.length > 0 ? comments.sort((a, b) => a.id - b.id).map(comment => {
                            return (
                                <div key={comment.id} >
                                    {comment.image ? <img  src={comment.image} alt={`${comment.username}'s profile picture`} /> : <></> }
                                    <div>
                                        <p className='commenter-name'>
                                            {comment.first_name} {comment.last_name}
                                        </p>
                                        <p>{comment.comment}</p>
                                    </div>
                                </div>
                            );
                        }) :
                        <div><p>Be the first to comment.</p></div>}
                        <form onSubmit={handleSubmit}>
                            <input placeholder='comment...' value={commentValue} onChange={handleChange} />
                            <button type="button" onClick={handleSubmit} ><FontAwesomeIcon icon={faGreaterThan} /></button>
                        </form>
                    </div>
                    <div className='footer-btn-container'>
                        <Button color="primary" onClick={toggleModal}>Do Something</Button>{' '}
                        <Button color="secondary" onClick={toggleModal}>Cancel</Button>
                    </div>
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
    border-radius: 8px;
    &.resolved-ticket {
        background-color: #efefef;
        .resolved {
            color: #656378;
            border-color: #656378;
            cursor: default;
            &:hover {
                background: transparent;
                color: #656378;
            }
        }
    }
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
        display: flex;
        flex-direction: column;
        justify-content: center;
        h3 {
            text-align: left;
            margin: 0 !important;
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
            margin-bottom: 10px;
            min-width: 40px;
            height: 40px;
            border-radius: 50%;
            object-fit: cover;
        }
    }
    .imgBtnContainer {
        align-items: flex-end;
        justify-content: space-between;
        button {
            width: 80px;
            margin-right: 10px;
            background: transparent;
            color: #0071eb;
            border: 2px solid #0071eb;
            border-radius: 5px;
            font-weight: bold;
            &:hover {
                color: #fff;
                background: #0071eb;

            }
        }
    }
    .ticket-modal {
        border: 5px red solid !important;
        .modal-footer {
            div {
                margin-left: -100px;
            }
        }
    }
`
    
export default TicketCard;