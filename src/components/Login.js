import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserId } from '../state/actions/actions';
import axiosWithAuth from '../utils/axiosWithAuth';
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import styled from "styled-components";

export default function Login(props) {
    const history = useHistory();
    const dispatch = useDispatch();
    const { register, handleSubmit, errors, formState } = useForm({
      mode: "onChange"
    });
    const [ user, setUser ] = useState({});
    console.log(errors);
  
    const handleLogin = (data) => {
        console.log(data)
        axiosWithAuth()
            .post('api/auth/login', data)
            .then(res => {
              setUser(res.data.user);
              localStorage.setItem('user', res.data.user.id);
              dispatch(setUserId(res.data.user.id));
              localStorage.setItem('token', res.data.token);
              history.push('/protected');
            })
            .catch(err => console.log('Post err', err));
    };

    let usernameStyle = {};
    let passwordStyle = {};
    const errorBorder = {
        borderBottomColor: '#df0d0e',
        borderBottomWidth: 4
    };
    if (errors.username) {
      usernameStyle = errorBorder;
    }
    if (errors.password) {
      passwordStyle = errorBorder;
    }

  return (
    <Container>
      <form onSubmit={handleSubmit(handleLogin)}>
        <h1>We're here to help.</h1>
        <p>Create a help ticket and we'll connect you with a Lambda School Team Lead.</p>
        <div>
          <input style={usernameStyle} type="text" placeholder="Username" name="username" ref={register({ required: "Username is required" })} />
          {errors.username && (
            <p className="errors">
              <FontAwesomeIcon icon={faTimesCircle} />
              <span>{errors.username.message}</span>
            </p>
          )}
        </div>
        <div>
          <input style={passwordStyle} type="password" placeholder="Password" name="password" ref={register({ required: "Password is required" })} />
          {errors.password && (
            <p className="errors">
              <FontAwesomeIcon icon={faTimesCircle} />
              <span>{errors.password.message}</span>
            </p>
          )}
        </div>
        <div>
        <button type="submit" disabled={!formState.isValid}>
            Login
        </button>
        </div>
      </form>
      <div className='hr-container'>
        <hr/>
        or
        <hr/>
      </div>
      <p>Don't have an account? <Link to='/register' >Make one.</Link></p>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  form {
    display: flex;
    flex-direction: column;
    width: 400px;
    padding: 20px;
    
    * {
      width: 100%;
      border-radius: 8px;
    }
    input {
      border: 1px solid transparent;
      background: rgba(255, 255, 255, 0.6);
      margin-top: 20px;
      margin-bottom: 20px;
      padding: 10px;
      &:focus {
        outline: none;
        border-bottom: 4px solid #47c8e8;
      }
    }
    div {
      //errors
      font-size: 1.2rem;
      p {
        margin: 0;
        text-align: left;
        margin-top: -20px;
        font-size: 0.8rem;
        margin-left: 10px;
        span {
          margin-left: 16px;
          font-weight: normal;
          color: #656378;
        }
      }
      button {
        margin-top: 17px;
        background-color: #c717c4;
        color: #fff;
        border: none;
        outline: none;
        padding: 9px;
        font-weight: bold;
        letter-spacing: 2px;
        transition: background-color 0.2s, color 0.2s;
        &:hover {
          background-color: #9400b9;
          color: #fff;
        }
        &:disabled {
          background-color: #e0e0e0;
          color: inherit;
          font-weight: normal;
        }
      }
    }
  }
  .hr-container {
    width: 400px;
    display: flex;
    hr {
      width: 40%;
      border-width: 2px;
    }
  }
`