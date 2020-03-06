import React from 'react';
import { CardTitle, CardText } from 'reactstrap';
import styled from "styled-components";

const TicketCard = ({ticket, toHome}) => {  
    return (
        <CardStyled>
        <CardBodyStyled>
          <CardImgStyled top width="25%" src={ticket.asker.image} alt={`${ticket.asker.username}'s profile picture`} />
          <CardTitle>{ticket.asker.first_name} {ticket.asker.last_name} ({ticket.asker.username})</CardTitle>
               <CardQuesTitle>Question Title: {ticket.title}</CardQuesTitle>
               <CardCatTitle>Category: {ticket.category}</CardCatTitle>
                 <CardText><QuesDescSpanStyled>Question Description: </QuesDescSpanStyled>{ticket.description}</CardText>
            <div>
                <h2>Comments:</h2>
                {ticket.comments.length > 0 ? ticket.comments.map(comment => {
                    return (
                        <div key={comment.id} >
                            <p><UserSpanStyled>{comment.first_name} {comment.last_name}: </UserSpanStyled>{comment.comment}</p>
                        </div>
                    );
                }) :
                <div><p>Be the first to comment.</p></div>}
            </div>
        </CardBodyStyled>
        </CardStyled>
    );
};

const CardStyled = styled.div`
width: 50%;
`

const CardImgStyled = styled.img`
border-radius: 50%;
`

const CardBodyStyled = styled.div`
color: blue;
padding: 2%;
border: 5px solid blue;
margin: 2%;
`

const CardQuesTitle = styled.h2`
font-weight: bold;
`

const CardCatTitle = styled.h4`
font-weight: bold;
`

const UserSpanStyled = styled.span`
font-weight: bold;
`

const QuesDescSpanStyled = styled.span`
font-weight: bold;
`
    
export default TicketCard;