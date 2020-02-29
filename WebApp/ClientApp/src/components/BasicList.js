import React, { Component } from "react";
import ReactDOM from "react-dom";

export default class BasicList extends Component {
  state = { placeHolderWidth: 0, placeHolderNum: 0 };

  componentDidMount() {
    this.resetPlaceHolder();
  }

  componentDidUpdate() {
    this.resetPlaceHolder();
  }

  resetPlaceHolder = () => {
    const listWrap = ReactDOM.findDOMNode(this.refs.listWrap);
    if (!listWrap || !listWrap.childNodes) return;
    let childNum = 0;
    listWrap.childNodes.forEach(child => {
      if (child.className !== "placeHolder") childNum += 1;
    });

    if (childNum === 0) {
      if (this.state.placeHolderNum !== 0) this.setState({ placeHolderNum: 0 });
      return;
    }

    const containWidth = listWrap.clientWidth;
    const item = listWrap.childNodes[0];
    const style = item.currentStyle || window.getComputedStyle(item);
    const margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    const width = item.offsetWidth + margin;
    const itemsPerRow = Math.floor(containWidth / width);
    const itemsLeft = childNum % itemsPerRow;
    const placeHolderNum = itemsLeft ? itemsPerRow - itemsLeft : 0;

    if (
      width === this.state.placeHolderWidth &&
      placeHolderNum === this.state.placeHolderNum
    )
      return;
    this.setState({ placeHolderWidth: width, placeHolderNum: placeHolderNum });
  };

  getColumnList = () => {
    return <div className="list-column">{this.props.children}</div>;
  };

  getRowList = () => {
    return <div className="list-row">{this.props.children}</div>;
  };

  getRowWrapList = () => {
    const { children } = this.props;
    const { placeHolderNum, placeHolderWidth } = this.state;
    return (
      <div className="list-row-wrap" ref="listWrap">
        {children}
        {Array(placeHolderNum)
          .fill(0)
          .map((i, index) => (
            <div
              className="placeHolder"
              key={index}
              style={{
                width: placeHolderWidth,
                visibility: "hidden"
              }}
            />
          ))}
      </div>
    );
  };

  render() {
    let { style, type, className, onClick } = this.props;
    type = type ? type : "column";
    let content;
    if (type === "rowWrap") {
      content = this.getRowWrapList();
    } else if (type === "row") {
      content = this.getRowList();
    } else if (type === "column") {
      content = this.getColumnList();
    }
    return (
      <div
        className={`list-contain ${className?className:""}`}
        style={style}
        onClick={onClick}
      >
        <div className="list-scroll-contain">{content}</div>
      </div>
    );
  }
}
