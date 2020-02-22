import React from "react";
import { Icon, Menu } from "semantic-ui-react";

const MENU = [
  { name: "Chats", icon: "chat", key: "CHATS" },
  { name: "ActiveUsers", icon: "address book outline", key: "ONLINE_USERS" }
];

const FooterMenu = ({ activeItem, handleItemClick }) => {
  return (
    <Menu compact icon="labeled" color="green" widths={2}>
      {MENU.map(menu => (
        <Menu.Item
          name={menu.name}
          key={menu.key}
          active={activeItem === menu.key}
          onClick={()=>handleItemClick(menu.key)}
        >
          <Icon name={menu.icon} />
          {menu.name}
        </Menu.Item>
      ))}
    </Menu>
  );
};

export default FooterMenu;
