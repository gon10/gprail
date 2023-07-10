import React from 'react';
import TwoPane from '../../layout/TwoPane';

export default function SplitScreen(props) {

  const left = props.left? props.left : <p>Left</p>
  const right = props.right? props.right : <p>Right</p>

  const twoPaneProps = {
    split: "vertical",
    pane1: left,
    pane2: right,
  }

  return (
    <div className="split-screen-page">
      <TwoPane {...twoPaneProps} />
    </div>
  );
}