import React from 'react';
import useResizeObserver from '../../Helpers/useResizeObserver'
import {
  ReflexContainer,
  ReflexSplitter,
  ReflexElement
} from 'react-reflex'

export default function TwoPane(props) {
  const split = props.split? props.split : "vertical"
  const minLeft = props.minLeft? props.minLeft : 200
  const maxLeft = props.maxLeft? props.maxLeft : null
  //const defaultSize = props.defaultSize? props.defaultSize : "50%"
  const minRight = props.minRight? props.minRight : 200
  const maxRight = props.maxRight? props.maxRight : null

  const pane1content = props.pane1? props.pane1 : <p>Test content pane 1</p>
  const pane2content = props.pane2? props.pane2 : <p>Test content pane 2</p>

  const [ ref1,  w1, /*h1*/ ] = useResizeObserver("borderBoxSize")
  const [ ref2,  w2, /*h2*/ ] = useResizeObserver("borderBoxSize")
  //console.log(`Panel1 width: ${w1} height: ${h1}`)
  //console.log(`Panel2 width: ${w2} height: ${h2}`)

  const pane1 = React.isValidElement(pane1content)? React.cloneElement(pane1content, { width: w1 }) : pane1content;
  const pane2 = React.isValidElement(pane2content)? React.cloneElement(pane2content, { width: w2 }) : pane2content;

  return (
    <ReflexContainer orientation={split} className="two-pane__wrap">
      <ReflexElement 
        className="left-pane"
        minSize={minLeft}
        maxSize={maxLeft}
      >
        <div className="pane-content two-pane__pane two-pane__pane-1" ref={ref1}>
          {pane1}
        </div>
      </ReflexElement>
      <ReflexSplitter/>
      <ReflexElement 
        className="right-pane"
        minSize={minRight}
        maxSize={maxRight}
      >
        <div className="pane-content two-pane__pane two-pane__pane-2" ref={ref2}>
          {pane2}
        </div>
      </ReflexElement>
    </ReflexContainer>
  )
};