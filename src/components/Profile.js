import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Tooltip, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { resetState, setUser } from '../state/actions/actions';
import axiosWithAuth from '../utils/axiosWithAuth';

export default () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector(state => {
        if (Object.keys(state.user).length > 0) {
            return state.user;
        } else if (localStorage.getItem('profile')) {
            return JSON.parse(localStorage.getItem('profile'));
        } else {
            //if user isn't in state or local storage
            //the user will have to login.
            history.push('/login');
        }
    });
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const [modal, setModal] = useState(false);
    const [imageModal, setImageModal] = useState(false);
    const [name, setName] = useState(`${user.first_name} ${user.last_name}`);
    const [email, setEmail] = useState(user.email);
    const defaultImageURL = 'https://mastodon.sdf.org/system/accounts/avatars/000/108/313/original/035ab20c290d3722.png?1541993604';
    const [image, setImage] = useState(user.image ? user.image : defaultImageURL);
    const logout = e => {
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('profile');
        dispatch(resetState());
        history.push('/login');
    }
    const toggleTooltip = () => setTooltipOpen(!tooltipOpen);
    const toggleModal = () => setModal(!modal);
    const toggleImageModal = () => setImageModal(!imageModal);
    const closeBtn = <button className="close" onClick={toggleModal}>&times;</button>;
    const closeBtnImageModal = <button className="close" onClick={toggleImageModal}>&times;</button>;

    const handleChange = e => {
        switch (e.target.name) {
            case 'name':
                setName(e.target.value);
                break;
            case 'email':
                setEmail(e.target.value);
                break;
            case 'image':
                setImage(e.target.value);
                break;
            default:
                break;
        }
    }

    const handleKeyDown = e => {
        if (e.keyCode === 13) {
            e.target.blur(); //triggers handleBlur
        }
    }

    const handleBlur = e => {
        if (e.target.value.trim() === '' || (e.target.name === 'name' && e.target.value.split(' ').length < 2)) {
            switch (e.target.name) {
                case 'name':
                    setName(`${user.first_name} ${user.last_name}`);
                    break;
                case 'email':
                    setEmail(user.email);
                    break;
                case 'image':
                    setImage(user.image ? user.image : defaultImageURL);
                    break;
                default:
                    break;
            }
        } else {
            // send the changes to the database
            let changes;
            if (e.target.name === 'name') {
                let [first, ...last] = e.target.value.split(' ');
                changes = {
                    first_name: first,
                    last_name: last.join(' ')
                }
            } else {
                changes = { [e.target.name]: e.target.value };
            }
            axiosWithAuth()
            .put(`api/users/${user.id}`, changes)
            .then(res => {
                //update user image in state
                localStorage.setItem('profile', JSON.stringify(res.data));
                dispatch(setUser(res.data));
            })
            .catch(err => {
                console.log('Something went wrong when trying to make changes to the user\'s profile.\n', err);
            })
        }
    }

    return (
        <Container>
            <div className='profile-container'>
                <a onClick={toggleModal}><img src={image} alt={user.first_name + ' ' + user.last_name} id="tooltip-profile" /></a>
                <Tooltip hideArrow={true} delay={{ show: 1000, hide: 0 }} placement="top" target="tooltip-profile" toggle={toggleTooltip} isOpen={tooltipOpen} >Profile</Tooltip>
                <button className='logout-button' onClick={logout}>Logout</button>
            </div>
            <Modal isOpen={modal} toggle={toggleModal} className='profile-modal' >
                <ModalHeader toggle={toggleModal} close={closeBtn}>
                    <input className='name-input' type="text" name="name" value={name} onChange={handleChange} onBlur={handleBlur} onKeyDown={handleKeyDown} />
                </ModalHeader>
                <ModalBody>
                    <div className='profile-img'>
                        <a onClick={toggleImageModal}>
                            <img src={user.image} alt={user.first_name + ' ' + user.last_name} />
                        </a>
                    </div>
                    <p>{user.username}</p>
                    <p>{user.role}</p>
                    <input className='email-input' type="text" name="email" value={email} onChange={handleChange} onBlur={handleBlur} onKeyDown={handleKeyDown} />
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggleModal}>Cancel</Button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={imageModal} toggle={toggleImageModal} className='image-modal' >
                <ModalHeader toggle={toggleImageModal} close={closeBtnImageModal}>Profile Picture</ModalHeader>
                <ModalBody>
                    <label>Enter image url:</label>
                    <input type='url' name='image' placeholder='image url...' onChange={handleChange} value={image} onBlur={handleBlur} onKeyDown={handleKeyDown} />
                    <img src={image} alt={`${user.first_name} ${user.last_name}`} />
                </ModalBody>
                <ModalFooter >
                <Button color="secondary" onClick={toggleImageModal} >Cancel</Button>
                </ModalFooter>
            </Modal>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    height: 100%;
    .profile-container {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        a {
            cursor: pointer;
            img {
                border-radius: 50%;
                width: 36px;
                height: 36px;
            }
        }
        .logout-button {
            color: #c717c4;
            width: auto;
            padding: 5px;
            margin-left: 20px;
        }
    }
    @media screen and (max-width: 800px) {
        .profile-container {
            margin: 0;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            .logout-button {
                margin-left: 5px;
            }
        }
    }
    @media screen and (max-width: 650px) {
        height: auto;
        position: absolute;
        left: 70%;
        top: 15%;
        .profile-container {
            flex-direction: row-reverse;
            align-items: center;
            width: auto;
            a {
                width: auto;
                padding: 0;
                margin: 0;
                img {
                    margin: 0 auto;
                }
            }
            .logout-button {
                display: inline-block;
            }
        }
    }
`