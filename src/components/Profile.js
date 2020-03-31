import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { resetState } from '../state/actions/actions';

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
    const logout = e => {
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('profile');
        dispatch(resetState());
        history.push('/login');
    }
    return (
        <Container>
            <div className='profile-container'>
                <a><img src={user.image} alt={user.first_name + ' ' + user.last_name} /></a>
                <button className='logout-button' onClick={logout}>Logout</button>
            </div>
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
`