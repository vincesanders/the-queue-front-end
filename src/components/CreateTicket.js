import React, { useRef, useState } from "react";
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import axiosWithAuth from "../utils/axiosWithAuth";
import { getAllTicketsByNewest } from '../state/actions/actions';

const schema = yup.object().shape({
  title: yup.string().trim().required('Title is required.'),
  description: yup.string().trim().required('Description is required.'),
  category: yup.string().required('Category is required.').notOneOf(['Select a category'], "Category is required.")
});

export default () => {
  const dispatch = useDispatch();
  const form = useRef(null);
  const newTicketBtn = useRef(null);
  const defaultFormValues = {
    title: "",
    description: "",
    category: "Select a category"
  };
  const { register, handleSubmit, errors, reset } = useForm({ 
    defaultFormValues,
    mode: "onChange",
    validationSchema: schema
  });
  const [isPlus, setIsPlus] = useState(true);

  const catgories = [
    'HTML', 'CSS', 'JavaScipt', 'React', 'Redux', 'Git', 'Node', 'Testing', 'Python', 'Java', 'SQL'
  ];

  const populateCategories = () => {
    return catgories.map(category => {
        return <option key={category} value={category}>{category}</option>;
    });
  }

  const createTicket = (data) => {
    data = {
      ...data,
      asker_id: localStorage.getItem('user')
    }
    axiosWithAuth().post('api/tickets/', data).then(res => {
      //res.data returns the created ticket
      dispatch(getAllTicketsByNewest());
      //close form.
      handleClick();
      //reset form values
      reset({ defaultFormValues });
      //alert or notification that ticket was created
    })
    .catch(({message, errorMessage}) => console.log('Post err', message, errorMessage));
  }

  const handleClick = (e) => {
    //This function may be called without clicking the button.
    if (e) {
      e.stopPropagation();
    }
    setIsPlus(!isPlus);
    if (form.current.style && form.current.style.height === '580px') {
      form.current.style.height = '0';
      form.current.style.visibility = 'hidden';
    } else {
      form.current.style.visibility = 'visible';
      form.current.style.height = '580px';
    }

    if (newTicketBtn.current.classList.contains('pulse')) {
      newTicketBtn.current.classList.remove('pulse');
    }
    //add pulse class
    newTicketBtn.current.classList.add('pulse');
    //set timeout equal to animation duration
    setTimeout(() => { 
      newTicketBtn.current.classList.remove('pulse');
    }, 600);
    //remove pulse class
  }

  return (
    <Container className="create-ticket-form">
      <button ref={newTicketBtn} className='new-ticket-btn' onClick={handleClick}>
        <FontAwesomeIcon icon={isPlus ? faPlus : faMinus} />
      </button>
      <form ref={form} onSubmit={handleSubmit(createTicket)}>
        <h2>Submit a ticket.</h2>
        <label>
          What's going on?
          <input
            type="text"
            placeholder="Ticket title"
            name="title"
            ref={register({ required: "Title is required" })}
          />
          {errors.title && 
            <p className="errors">
              <FontAwesomeIcon icon={faTimesCircle} />
              <span>{errors.title.message}</span>
            </p>}
        </label>
        <label>
          Description:
          <textarea
            name="description"
            placeholder="More information. &#10;What have you tried?"
            ref={register({ required: "Description is required" })}
          />
          {errors.description && (
            <p className="errors">
              <FontAwesomeIcon icon={faTimesCircle} />
              <span>{errors.description.message}</span>
            </p>
          )}
        </label>
        <label>
          Category:
          <select
            name="category"
            ref={register({ required: "Category is required" })}
            defaultValue='Select a category'
          >
            <option disabled value='Select a category'>Select a category</option>
            {populateCategories()}
          </select>
          {errors.category && (
            <p className="errors">
              <FontAwesomeIcon icon={faTimesCircle} />
              <span>{errors.category.message}</span>
            </p>
          )}
        </label>
        <button type="submit" className="btn btn-dark">
          Submit Ticket
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 34%;
  margin-top: 40px;
  .pulse {
    &:before, &:after {
      width: 100%;
      height: 100%;
      border: inherit;
      top: 0;
      left: 0;
      z-index: 0;
      background: #fff;
      border-radius: inherit;
      animation: pulse 2.5s linear infinite;
    }
    &:after {
      animation: pulse1 2.5s linear infinite;
    }
  }
  .new-ticket-btn {
    position: relative;
    border-radius: 50%;
    background-color: #007aff;
    color: white;
    font-size: 20px;
    width: 60px;
    height: 60px;
    margin-bottom: 20px;
    border: 5px solid #007aff;
    box-shadow: 2px 2px 3px #999;
    outline: none;
    &:before, &:after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 0;
      height: 0;
      border-radius: 50%;
      opacity: 0;
    }
    &:before {
      border: 6px solid white;
      z-index: -1;
    }
    &:after {
      z-index: 1;
      background-color: white;
    }
    &.pulse {
      &:before {
        animation: pulse 600ms ease;
      }
      &:after {
        animation: pulse1 600ms ease;
      }
    }
  }
  form {
    display: flex;
    visibility: hidden;
    flex-direction: column;
    width: 100%;
    background-color: #fff;
    height: 0;
    overflow: hidden;
    padding: 40px;
    border-radius: 8px;
    transition: height 0.5s;
    * {
      width: 100%;
    }
    label {
      text-align: left;
      margin-bottom: 20px;
    }
    input, textarea, select {
      margin-top: 10px;
      margin-bottom: 20px;
      background: #f7f7f7;
      padding: 10px;
      border-radius: 8px;
      border: 2px solid transparent;
      &:focus {
        border-color: #e627ff;
        outline: none;
      }
    }
    button {
      background-color: #007aff;
      font-weight: bold;
      padding: 10px;
      &:hover {
        background-color: #0071eb;
      }
    }
    .errors {
      margin: 0;
      text-align: left;
      margin-top: -20px;
      font-size: 0.8rem;
      margin-left: 12px;
      span {
        margin-left: 16px;
        font-weight: normal;
        color: #656378;
      }
    }
  }
  @media screen and (max-width: 1200px) {
    width: 80%;
    margin-left: 20%;
    form {
      width: 80%;
      margin-bottom: 40px;
    }
  }
`