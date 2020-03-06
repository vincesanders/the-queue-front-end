import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateUser } from '../actions/actions';
import { axiosWithAuth } from '../utils/axiosWithAuth';
import { useForm } from "react-hook-form";
import { Button, InputGroup } from "reactstrap";
import styled from "styled-components";

export default function Login(props) {
  const dispatch = useDispatch();
    const history = useHistory();
    const { register, handleSubmit, errors } = useForm();
    const [ user, setUser ] = useState({});
    console.log(errors);
  
    const handleLogin = (data) => {
        console.log(data)
        axiosWithAuth()
            .post('api/auth/login', data)
            .then(res => {
              dispatch(updateUser(res.data.user));
              setUser(res.data.user);
              localStorage.setItem('user', res.data.user.id);
              localStorage.setItem('token', res.data.token);
              history.push('/protected');
            })
            .catch(err => console.log('Post err', err));
    };

  return (
    <div className="login-form">
    <StyledSection>
    <StyledForm onSubmit={handleSubmit(handleLogin)}>
        <StyledH1>Welcome Back!</StyledH1>
        <p>Please login to continue.</p>
      <StyledGroup>
      <input type="text" placeholder="Username" name="username" ref={register({ required: "Error: Username is required" })} />
      {errors.username && (
            <p className="errors">{errors.username.message}</p>
          )}
      </StyledGroup>
      <StyledGroup>
      <input type="password" placeholder="Password" name="password" ref={register({ required: "Error: Password is required" })} />
      {errors.password && (
            <p className="errors">{errors.password.message}</p>
          )}
      </StyledGroup>
      <StyledGroup>
      <StyledButton block type="submit" color="success">
          Login
        </StyledButton>
      </StyledGroup>
    </StyledForm>
    </StyledSection>
    </div>
  );
}

const StyledButton = styled(Button)`
  background-color: #0066ff;
  width: 30%;
  margin-bottom: 10%;
`;

const StyledGroup = styled(InputGroup)`
  margin-bottom: 2%;
`;


const StyledForm = styled.form`
`;

const StyledSection = styled.section`
  width: 25%;
  margin: auto;
  border: 2px solid blue;
`;

const StyledH1 = styled.h1`
color: blue;
`
