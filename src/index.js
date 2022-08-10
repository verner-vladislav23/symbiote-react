import React from 'react';
import ReactDOM from 'react-dom/client';
import { BaseComponent } from "@symbiotejs/symbiote";

const REACT_EVENT_NAME = 'EventFromReact';

function ReactComponent({ count, incremenent }) {
  const ref = React.useRef();

  const onClick = () => {
    ref.current.dispatchEvent(new Event(REACT_EVENT_NAME, { bubbles: true, message: 1 }));
    incremenent();
  }

  const onRemoveRoot = () => {
    window.document.getElementById('test').remove();
  }

  return (
    <div ref={ref}>
      <h2>{count}</h2>
      <button onClick={onClick}>Click me!</button>
      <button onClick={onRemoveRoot}>Remove me!</button>
    </div>
  );
}
export default class MyComponent extends BaseComponent {
  init$ = {
    count: 0,
    root: null,
    increment: () => {
      this.$.count++;
    },
  }

  initCallback() {
    this.addEventListener(REACT_EVENT_NAME, (e) => {
      console.log(e);
    });

    const root = ReactDOM.createRoot(this);
    this.$.root = root;

    this.sub('count', (currentCount) => {
      root.render(<ReactComponent count={currentCount} incremenent={this.$.increment} />)
    })
  }

  destroyCallback() {
    this.$.root.unmount(this);
  }
}

MyComponent.reg('my-component');