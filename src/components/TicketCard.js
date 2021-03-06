import React, { useRef, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeTicket } from '../state/actions/actions';
import styled from "styled-components";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGreaterThan, faTimes, faExclamation } from '@fortawesome/free-solid-svg-icons'
import axiosWithAuth from '../utils/axiosWithAuth';

const TicketCard = (props) => {
    const [ticket, setTicket] = useState(props.ticket);
    const history = useHistory();
    const dispatch = useDispatch();
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
    const teamLeads = useSelector(state => state.teamLeads);
    const [modal, setModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [commentValue, setCommentValue] = useState("");
    const [comments, setComments] = useState(ticket.comments);
    const [title, setTitle] = useState(ticket.title);
    const [description, setDescription] = useState(ticket.description);
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

    const toggleDeleteModal = (e) => {
        e.stopPropagation();
        setDeleteModal(!deleteModal);
    }

    const closeBtn = <button className="close" onClick={toggleModal}>&times;</button>;

    const handleChange = e => {
        switch (e.target.name) {
            case 'title':
                setTitle(e.target.value);
                break;
            case 'description':
                setDescription(e.target.value);
                break;
            case 'comment':
                setCommentValue(e.target.value);
                break;
            default:
                break;
        }
    }

    const handleCommentSubmit = e => {
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

    const displayTLBtn = (role, isInModal) => {
        if (ticket.assignee === null && !ticket.resolved) {
            if (role === 'section lead') {
                return (
                    <>
                        <select name='team-lead' defaultValue='Assign' onClick={handleSelectClick} onChange={handleAssignChange}>
                            <option disabled value='Assign'>Assign</option>
                            <option value={userId}>Assign to me</option>
                            {teamLeads.map(tl => {
                                return <option key={tl.id} value={tl.id}>{tl.first_name} {tl.last_name}</option>
                            })}
                        </select>
                    </>
                );
            } else {
                return (
                    <button className='assign' onClick={handleAssignClick}>Assign</button>
                );
            }
            
        } else if (ticket.assignee.id === Number(userId) && !ticket.resolved) {
            //style the button differently if the ticket is assigned
            //to the current user.
            return (
                <button onClick={handleAssignClick} name='assigned-to-me' className="assigned-to-me">Assigned</button>
            );
        } else if (ticket.resolved) {
            //If the ticket is resolved
            if (isInModal) {
                return <></>;
            } else {
                //disabled, can't click, cursor doesn't change
                if (role === 'section lead' || ticket.asker.id === userId) {
                    //if user is an sl or the user who created the ticket
                    return (
                        <button onClick={handleAssignClick} name='resolved' className="resolved">Resolved</button>
                    );
                } else {
                    return (
                        <button disabled className="resolved">Resolved</button>
                    );
                }
            }
        } else {
            //ticket is assigned, but not to the user.
            if (role === 'section lead') {
                return (
                    <button onClick={handleAssignClick} name='unassign' className="assigned">
                        Assigned
                    </button>
                );
            } else {
                return (
                    <button disabled className="assigned">Assigned</button>
                );
            }
        }
    }

    const handleSelectClick = e => {
        e.stopPropagation();
    }

    const handleAssignClick = e => {
        e.stopPropagation();
        e.preventDefault();
        let changes;
        if (e.target.name === 'assigned-to-me' || e.target.name === 'unassign') {
            //unassign myself or tl (if I'm a sl) from a ticket.
            changes = {
                being_solved: false,
                assignee: null,
                assigned_by: null
            }
        } else if (e.target.name === 'resolved') {
            changes = {
                resolved: false,
                solved_by: null
            }
        } else if (e.target.name === 'mark-resolved') {
            console.log('we made it to mark-resolved if statement');
            if (ticket.resolved) {
                changes = { resolved: false }
            } else {
                changes = { resolved: true }
            }
        } else {
            //Assigns the ticket to the team lead that clicks on the Assign button.
            changes = {
                being_solved: true,
                assignee: userId,
                assigned_by: userId
            }
        }
        axiosWithAuth()
        .put(`api/tickets/${ticket.id}`, changes)
        .then(res => {
            setTicket(res.data);
        })
        .catch(err => console.log(err));
    }

    const handleAssignChange = e => {
        const changes = {
            being_solved: true,
            assignee: e.target.value,
            assigned_by: userId
        }
        axiosWithAuth()
        .put(`api/tickets/${ticket.id}`, changes)
        .then(res => {
            setTicket(res.data);
        })
        .catch(err => console.log(err));
    }

    const isAskerAsigneeOrSL = () => {
        if (ticket.asker.id === userId || (ticket.assignee && ticket.assignee.id === userId) || userRole === 'section lead') {
            return true;
        } else {
            return false;
        }
    }

    const deleteTicket = e => {
        dispatch(removeTicket(ticket.id));
        toggleDeleteModal(e);
        if (e.target.name === 'modal-delete-btn') {
            toggleModal(e);
        }
    }

    const handleBlur = e => {
        if (e.target.value.trim() === '') {
            e.target.name === 'title' ? setTitle(ticket.title) : setDescription(ticket.description);
        } else {
            //send the changes to the database
            axiosWithAuth()
            .put(`api/tickets/${ticket.id}`, { [e.target.name]: e.target.value })
            .then(res => {
                //We don't need the update ticket info, since we're keeping
                //track of state on the client-side.
            })
            .catch(err => {
                console.log('Something went wrong when trying to make changes to the ticket in the database.\n', err);
            })
        }
    }

    const handleKeyDown = e => {
        if (e.keyCode === 13) {
            e.target.blur(); //triggers handleBlur
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
                <p>{title}</p>
            </div>
            <div className="imgBtnContainer">
                <button onClick={toggleDeleteModal} className='delete-btn'>
                    <FontAwesomeIcon icon={faTimes} />
                    <span className={props.index === 0 ? 'first-ticket' : ''}>Delete ticket?</span>
                </button>
                {ticket.asker.image ? <img  src={ticket.asker.image} alt={ticket.asker.username} /> : <></> }
                {(userRole === 'team lead' || userRole === 'section lead') 
                ? displayTLBtn(userRole, false) 
                : <></>}
            </div>
            <Modal contentClassName='ticket-modal' isOpen={modal} toggle={toggleModal} backdrop={true} fade={false}>
                <ModalHeader toggle={toggleModal} close={closeBtn}>
                    {ticket.category} issue<br/>
                    <input type="text" name="title" value={title} onChange={handleChange} onBlur={handleBlur} onKeyDown={handleKeyDown} />
                </ModalHeader>
                <ModalBody>
                    <h3>Description of issue</h3>
                    <textarea rows='4' name="description" onChange={handleChange} onBlur={handleBlur} onKeyDown={handleKeyDown} value={description} />
                </ModalBody>
                <ModalFooter>
                    <div className='comment-container'>
                        <h4>Comments:</h4>
                        {ticket.comments.length > 0 ? comments.sort((a, b) => a.id - b.id).map(comment => {
                            return (
                                <div key={comment.id} >
                                    {comment.image ? <img  src={comment.image} alt={comment.username} /> : <></> }
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
                        <form onSubmit={handleCommentSubmit}>
                            <input placeholder='comment...' name='comment' value={commentValue} onChange={handleChange} />
                            <button type="button" onClick={handleCommentSubmit} ><FontAwesomeIcon icon={faGreaterThan} /></button>
                        </form>
                    </div>
                    <div className='footer-btn-container'>
                        <Button 
                            disabled={isAskerAsigneeOrSL() ? false : ticket.resolved} 
                            className={ticket.resolved ? 'resolved' : ''} 
                            name='mark-resolved' color="primary" 
                            onClick={handleAssignClick}
                        >
                            {ticket.resolved ? 'Resolved' : 'Mark as Resolved'}
                        </Button>
                        {' '}
                        {displayTLBtn(userRole, true)}
                        {' '}
                        <Button name='modal-delete-btn' color="danger" onClick={toggleDeleteModal}>Delete</Button>
                    </div>
                </ModalFooter>
            </Modal>
            <Modal className='delete-modal' isOpen={deleteModal} toggle={toggleDeleteModal}>
                <ModalBody>
                    <FontAwesomeIcon icon={faExclamation} />
                    <h4>Are you sure you want to delete the ticket?</h4>
                    <p>This cannot be undone!</p>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={deleteTicket} color="danger">Delete</Button>
                    {' '}
                    <Button color="secondary" onClick={toggleDeleteModal}>Cancel</Button>
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
        .delete-btn {
            color: #df0d0e;
            font-weight: normal;
            width: auto;
            border: none;
            font-size: 12px;
            vertical-align: middle;
            border-radius: 50%;
            margin-top: -16px;
            margin-bottom: 5px;
            margin-right: -10px;
            position: relative;
            outline: none;
            &:hover {
                background: #df0d0e;
                span {
                    opacity: 1;
                    transition: opacity 2s ease-in;
                }
            }
            span {
                opacity: 0;
                width: 80px;
                background-color: #c717c4;
                color: #fff;
                border-radius: 2px;
                border: none;
                text-align: center;
                position: absolute;
                z-index: 1;
                bottom: 150%;
                left: 50%;
                margin-left: -40px;
                font-size: 10px;
                transition: opacity 0.3s;
                &::after {
                    content: "";
                    position: absolute;
                    top: 100%;
                    left: 50%;
                    margin-left: -5px;
                    border-width: 5px;
                    border-style: solid;
                    border-color: #c717c4 transparent transparent transparent;
                }
            }
            .first-ticket {
                bottom: -150%;
                &::after {
                    bottom: 100%;
                    top: -100%;
                    border-color: transparent transparent #2f2c49 transparent;
                }
            }
        }
        button {
            width: 84px;
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
            &.assigned-to-me {
                color: #fff;
                background: #0071eb; 
            }
            &.assigned {
                color: #656378;
                border-color: #656378;
                cursor: default;
                &:hover {
                    background: transparent;
                    color: #656378;
                }
            }
        }
        select {
            width: 84px;
            margin-right: 10px;
            background: transparent;
            color: #0071eb;
            border: 2px solid #0071eb;
            border-radius: 5px;
            font-weight: bold;
            outline: none;
            padding: 2px 5px;
            /* center select text */
            text-align-last: center;
            /* Remove arrow */
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            &:hover {
                color: #fff;
                background: #0071eb;
            }
            option {
                background: #fff;
                color: #000;
                text-align: center;
                &:disabled {
                    display: none;
                }
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
    @media screen and (max-width: 1200px) {
        .imgBtnContainer .delete-btn {
            span {
                bottom: 25%;
                left: -250%;
                &::after {
                    top: 20%;
                    left: 106%;
                    margin-left: -5px;
                    border-color:  transparent  transparent transparent #c717c4;
                }
            }
            .first-ticket {
                bottom: 20%;
                left: -250%;
                &::after {
                    display: none;
                }
            }
        }
    }
    @media screen and (max-width: 400px) {
        div {
            h3, p {
                padding-left: 10px;
            }
        }
        div:nth-child(2) {
            width: 52%;
            h3 {
                font-size: 24px;
                padding-bottom: 5px;
            }
        }
        .imgBtnContainer {
            width: 30%;
        }
        button {
            padding: 2px 5px;
        }
    }
`
    
export default TicketCard;