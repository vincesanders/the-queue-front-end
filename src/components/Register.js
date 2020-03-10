import React from "react";
import { useHistory, Link } from 'react-router-dom';
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { axiosWithAuth } from '../utils/axiosWithAuth';
import styled from "styled-components";

const schema = yup.object().shape({
  first_name: yup.string().required('First name is required.'),
  last_name: yup.string().required('Last name is required.'),
  email: yup.string().email().required('Email is required.'),
  username: yup.string().required('Username is required.'),
  password: yup.string().required('Password is required.').min(8, 'Password must be at least 8 characters long.')
})

export default function Register(props) {
  const history = useHistory();
  const { register, handleSubmit, errors, formState } = useForm({
    mode: "onChange",
    validationSchema: schema
  });

  const handleRegister = (data) => {
    axiosWithAuth()
    .post('api/auth/register', data)
    .then(res => {
      localStorage.setItem('user', res.data.user.id);
      localStorage.setItem('token', res.data.token);
      history.push('/protected');      
    })
    .catch(err => console.log('Post err', err));
  };

  let first_nameStyle = {};
  let last_nameStyle = {};
  let emailStyle = {};
  let usernameStyle = {};
  let passwordStyle = {};
  const errorBorder = {
      borderBottomColor: '#df0d0e',
      borderBottomWidth: 4
  };
  if (errors.first_name) {
    first_nameStyle = errorBorder;
  }
  if (errors.last_name) {
    last_nameStyle = errorBorder;
  }
  if (errors.email) {
    emailStyle = errorBorder;
  }
  if (errors.username) {
    usernameStyle = errorBorder;
  }
  if (errors.password) {
    passwordStyle = errorBorder;
  }

  return(
    <Container>
    <form onSubmit={handleSubmit(handleRegister)}>
      <h1>We're here to help.</h1>
      <p>Create a help ticket and we'll connect you with a Lambda School Team Lead.</p>
      <div>
        <input style={first_nameStyle} type="text" placeholder="First name" name="first_name" ref={register} />
        {errors.first_name && (
          <p className="errors">
          <FontAwesomeIcon icon={faTimesCircle} />
          <span>{errors.first_name.message}</span>
        </p>
        )}
      </div>
      <div>
        <input style={last_nameStyle} type="text" placeholder="Last name" name="last_name" ref={register} />
        {errors.last_name && (
          <p className="errors">
          <FontAwesomeIcon icon={faTimesCircle} />
          <span>{errors.last_name.message}</span>
        </p>
        )}
      </div>
      <div>
        <input style={emailStyle} type="text" placeholder="Email Address" name="email" ref={register} />
        {errors.email && (
          <p className="errors">
          <FontAwesomeIcon icon={faTimesCircle} />
          <span>{errors.email.message}</span>
        </p>
        )}
      </div>
      <div>
        <input style={usernameStyle} type="text" placeholder="Username" name="username" ref={register} />
        {errors.username && (
          <p className="errors">
          <FontAwesomeIcon icon={faTimesCircle} />
          <span>{errors.username.message}</span>
        </p>
        )}
      </div>
      <div>
        <input style={passwordStyle} type="password" placeholder="Password" name="password" ref={register} />
        {errors.password && (
          <p className="errors">
          <FontAwesomeIcon icon={faTimesCircle} />
          <span>{errors.password.message}</span>
        </p>
        )}
      </div>
      <div>
        <select name="role" ref={register}>
          <option value="student">Student</option>
          <option value="team lead"> Team Lead</option>
          <option value="section lead"> Section Lead</option>
        </select>
      </div>
      <div>
        <button type="submit" disabled={!formState.isValid}>
          Create Account
        </button>
      </div>
    </form>
    <div className='hr-container'>
      <hr/>
      or
      <hr/>
    </div>
    <p>Already have an account? <Link to='/login' >Sign in.</Link></p>
    </Container>
  )
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
    padding: 16px;
    * {
      width: 100%;
      border-radius: 8px;
    }
    input {
      border: 4px solid transparent;
      background: rgba(255, 255, 255, 0.6);
      margin-top: 16px;
      margin-bottom: 16px;
      padding: 9px;
      &:focus {
        outline: none;
        border-bottom: 4px solid #47c8e8;
      }
    }
    div {
      //errors
      font-size: 1.1rem;
      p {
        margin: 0;
        text-align: left;
        margin-top: -16px;
        font-size: 0.8rem;
        margin-left: 10px;
        span {
          margin-left: 16px;
          font-weight: normal;
          color: #656378;
        }
      }
      select {
        padding: 9px;
        outline: none;
        border: 4px solid transparent;
        margin-top: 16px;
        &:focus {
        outline: none;
        border-color: #47c8e8;
      }
      }
      button {
        margin-top: 16px;
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