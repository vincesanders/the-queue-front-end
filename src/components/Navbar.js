import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <>
      <Navigate>
        <NavLink to="/Register">Register</NavLink>
        <NavLink to="/protected">Tickets</NavLink>
        <NavLink to="/Login">Log In</NavLink>
      </Navigate>
    </>
  );
};

export default NavBar;

//styles
const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 1rem;
  font-weight: bold;
`;
const Navigate = styled.div`
  font-family: verdana;
  background-color: #0066ff;
  padding: .25%;
  display: flex;
  justify-content: space-evenly;
  position: fixed;
  top: 0;
  width: 100%;
`;