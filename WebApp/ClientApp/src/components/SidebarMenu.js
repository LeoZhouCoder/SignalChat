import React from "react";
import { Menu, Dropdown } from "semantic-ui-react";

export default function SidebarMenu({
  bigScreen,
  activeMenu,
  handleMenuClick,
  options
}) {
  if (bigScreen) {
    return (
      <Menu attached pointing secondary widths={2} color="green">
        {options.map(item => {
          return (
            <Menu.Item
              key={item.value}
              active={activeMenu === item.value}
              onClick={() => handleMenuClick(item.value)}
            >
              {item.value}
            </Menu.Item>
          );
        })}
      </Menu>
    );
  }
  return (
    <Menu compact>
      <Dropdown
        options={options}
        simple
        item
        value={activeMenu}
        onChange={(e, data) => handleMenuClick(data.value)}
      />
    </Menu>
  );
}
