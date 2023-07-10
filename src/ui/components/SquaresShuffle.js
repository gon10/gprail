import React from 'react'

export default function SquaresShuffle(props) {
  const squares = [];
  for (let i = 0; i <= 16; i++) {
    squares.push(<div key={i} className="square"></div>);
  }

  return (
    <div className="squares-shuffle-2">
        <div className="squares-wrap">
            {squares}
        </div>
    </div>
  );
}