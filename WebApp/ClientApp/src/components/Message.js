import React from 'react';
import {
    Item
  } from "semantic-ui-react";

const Message = ({chat, user}) => (
    <Item>
      <Item.Image size='mini' src={chat.img} />
      <Item.Content>
        <Item.Header>{chat.username}</Item.Header>
        <Item.Description>{chat.content}</Item.Description>
      </Item.Content>
    </Item>
);

export default Message;
/**
 * <li className={`chat ${user === chat.username ? "right" : "left"}`}>
        {user !== chat.username
            && <img src={chat.img} alt={`${chat.username}'s profile pic`} />
        }
        {chat.content}
    </li>
 */