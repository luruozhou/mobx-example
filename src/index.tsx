// import './App/app'

import * as React from 'react';
import { useState, useEffect } from 'react';
import { render } from 'react-dom';

var originCreateElement = document.createElement;
document.createElement = function() {
  if (arguments[0] === 'span') {
    console.log('create span');
  }
  return originCreateElement.apply(document, arguments);
};

function Example() {
  const [count, setCount] = useState(0);
  const [egg, setEgg] = useState({ name: 'egg1' });

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(
    () => {
      console.log(11, count);
      let a = 'aa';
      document.title = `${count} times`;
      function m() {
        console.log('mmm');
      }
    },
    [egg]
  );

  console.log('render');
  return (
    <div>
      <p>You clicked {count} times</p>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        Click me
      </button>
      <button
        onClick={() => {
          setEgg({ name: egg.name + 1 });
        }}
      >
        Click me
      </button>

      <h1>{count}</h1>
      <h1>{egg.name}</h1>
    </div>
  );
}

render(<Example />, document.getElementById('app'));
