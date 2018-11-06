import React from 'react';
import { render } from 'react-dom';
import Tilt from '../../src';

const App = () => (
  <div
    style={{
      width: '100vw',
      height: '100vh',
      background: '#222',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
    }}
  >
    <div
      style={{
        width: '50vw',
        height: '50vh',
        padding: 20,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        textAlign: 'center',
        }}
    >
      <Tilt>
        <div style={{ height: 200, width: 150, padding: 15, background: 'tomato' }}>
          I am a div wrapped with a &lt;Tilt /&gt;
        </div>
      </Tilt>
      <Tilt>
        <div style={{ height: 150, width: 150, padding: 15, background: 'hotpink', boxShadow: '0 5px 10px rgba(0,0,0, .5)' }}>
          I am a tilty div with some shadowy styles.
        </div>
      </Tilt>
      <Tilt>
        <div style={{ display: 'flex', alignItems: 'center', color: '#222', height: 150, width: 150, padding: 15, background: 'greenyellow', boxShadow: '0 5px 10px rgba(0,0,0, .5)', borderRadius: '50%' }}>
          <p>I am a tilty div with some circular styles.</p>
        </div>
      </Tilt>
    </div>
  </div>
);
render(<App />, document.getElementById('root'));
