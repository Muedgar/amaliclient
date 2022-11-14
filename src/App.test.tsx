import App from './App';
import * as ReactDOM from 'react-dom';
import React from 'react';

describe('GitSearchApp tests', () => {
  let container:HTMLDivElement

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    ReactDOM.render(<App simple=''/>, container);
  })

  afterEach(() => {
    document.body.removeChild(container);
    container.remove();
  });

  it('Renders corretly initial document', () => {
    const aTag = container.querySelectorAll('a');
    const h1Tag = container.querySelectorAll('h1');

    expect(aTag).toHaveLength(1);
    expect(h1Tag).toHaveLength(1);
  });
})


