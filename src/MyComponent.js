import React from 'react';
import ReactDOM from 'react-dom/client';
import { BaseComponent } from "@symbiotejs/symbiote";
import { Data } from '@symbiotejs/symbiote';

export default class MyComponent extends BaseComponent {
  init$ = {
    'state/count': 0,
    'state/increment': () => {
      const ctx = Data.getNamedCtx('state');
      let count = ctx.read('count');
      ctx.pub('count', ++count);
    },
  }

  initCallback() {
    this.addEventListener('EventFromReact', (e) => {
      console.log(e);
    })
  }
}


function ReactComponent({ count, incremenent }) {
  const ref = React.useRef();

  const onClick = () => {
    ref.current.dispatchEvent(new Event('EventFromReact', { bubbles: true, message: 1 }));
    incremenent();
  }

  return (
    <div ref={ref}>
      <h2>{count}</h2>
      <button onClick={onClick}>Click me!</button>
    </div>
  );
}

MyComponent.reg('my-component');
const Root = ReactDOM.createRoot(document.getElementById('root'));

const ctx = Data.getNamedCtx('state');
const increment = ctx.read('increment');

ctx.sub('count', (val) => {
  Root.render(<ReactComponent count={val} incremenent={increment}/>)
});