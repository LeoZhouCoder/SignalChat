import React, { Component } from "react";
import BasicList from "./BasicList";

export default class TestList extends Component {
  render() {
    return (
      <div className="testContain">
        <BasicList type="rowWrap">
          {Array(18)
            .fill(0)
            .map((i, index) => (
              <div key={index} className="testItem">
                {index}
              </div>
            ))}
        </BasicList>
      </div>
    );
  }
}
