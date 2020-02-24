import React from "react";
import { Icon, Menu } from "semantic-ui-react";
import { MENU } from "../env/Env";

const FooterMenu = ({ activeItem, handleItemClick }) => {
  return (
    <Menu compact icon="labeled" color="green" widths={2}>
      {MENU.map(menu => (
        <Menu.Item
          key={menu.value}
          active={activeItem === menu.value}
          onClick={()=>handleItemClick(menu.value)}
        >
          <Icon name={menu.icon} />
          {menu.value}
        </Menu.Item>
      ))}
    </Menu>
  );
};

export default FooterMenu;
