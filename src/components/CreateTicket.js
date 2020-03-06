import React from "react";
import { useHistory } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { axiosWithAuth } from "../utils/axiosWithAuth";

export default ({ updateTickets, setUpdateTickets }) => {
  const history = useHistory();
  const { register, handleSubmit, errors } = useForm();

  const createTicket = (data) => {
    data = {
      ...data,
      asker_id: localStorage.getItem('user')
    }
    console.log('this is data in createTicket:', data);
    axiosWithAuth().post('api/tickets/', data).then(res => {
      //res.data returns the created ticket
      setUpdateTickets(!updateTickets);
      history.push('/protected');
    })
    .catch(({message, errorMessage}) => console.log('Post err', message, errorMessage));
  }

  return (
    <div className="create-ticket-form">
      <form onSubmit={handleSubmit(createTicket)}>
        <h1>Submit Your Question to the Q!</h1>
        <label>
          Title:
          <input
            type="text"
            placeholder="Question title"
            name="title"
            ref={register({ required: "Title is required" })}
          />
          {errors.title && <p className="errors">{errors.title.message}</p>}
        </label>
        <label>
          Description:
          <textarea
            name="description"
            placeholder="Ask your question here"
            ref={register({ required: "Description is required" })}
          />
          {errors.description && (
            <p className="errors">{errors.description.message}</p>
          )}
        </label>
        <label>
          Category:
          <select
            name="category"
            ref={register({ required: "Category is required" })}
          >
            <option disabled>Select a category</option>
            <option value="HTML">HTML</option>
            <option value="CSS"> CSS</option>
            <option value="JavaScript"> JavaScript</option>
            <option value="React"> React</option>
            <option value="Java"> Java</option>
            <option value="Python"> Python</option>
            <option value="Other"> Other</option>
          </select>
          {errors.category && (
            <p className="errors">{errors.category.message}</p>
          )}
        </label>
        <button type="submit" className="btn btn-dark">
          Submit to Q
        </button>
      </form>
    </div>
  );
}