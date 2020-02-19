import React from "react";
import { Icon, Menu } from "semantic-ui-react";

const MENU = [
  { name: "Chats", icon: "gamepad", key: "CHATS" },
  { name: "ActiveUsers", icon: "video camera", key: "ONLINE_USERS" }
];

const FooterMenu = ({ activeItem, handleItemClick }) => {
  return (
    <Menu compact icon="labeled" color="teal" widths={2}>
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
