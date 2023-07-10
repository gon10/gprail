import React from 'react';

export default function ElrSegmentReadOnly(props) {

  const values = props.value ? props.value : {
    "code": "SC171",
    "sequence": 5,
    "sequenceOnPage": 11,
    "elrSegment": {
      "from": {
        "milesYards": {
          "miles": 1,
          "yards": 462,
          "displayValue": "1m 462yds"
        },
        "totalYards": 2222,
        "milesChains": {
          "miles": 1,
          "chains": 21,
          "displayValue": "1m 21ch"
        },
        "km": {
          "kilometres": 2,
          "metres": 31,
          "displayValue": "2.031 km"
        }
      },
      "to": {
        "milesYards": {
          "miles": 0,
          "yards": 0,
          "displayValue": "0m 0yds"
        },
        "totalYards": 0,
        "milesChains": {
          "miles": 0,
          "chains": 0,
          "displayValue": "0m 0ch"
        },
        "km": {
          "kilometres": 0,
          "metres": 0,
          "displayValue": "0.000 km"
        }
      }
    }
  }


  let code = "ELR missing"
  if(values.elrSegment.elr){
    code = values.elrSegment.elr.code
  }
  const from = values.elrSegment.from.milesChains.displayValue
  const to = values.elrSegment.to.milesChains.displayValue

  let classProps = ['elr-segment-read-only__wrap'];

  return (
    <div className={classProps.join(' ')}>
      <p><b>{code}:</b> From {from} to {to}</p>
    </div>
  )
}