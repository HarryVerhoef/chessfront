import React from 'react';
import bishopBlack from './img/bishop-black.svg';
import bishopWhite from './img/bishop-white.svg';
import kingBlack from './img/king-black.svg';
import kingWhite from './img/king-white.svg';
import knightBlack from './img/knight-black.svg';
import knightWhite from './img/knight-white.svg';
import pawnBlack from './img/pawn-black.svg';
import pawnWhite from './img/pawn-white.svg';
import queenBlack from './img/queen-black.svg';
import queenWhite from './img/queen-white.svg';
import rookBlack from './img/rook-black.svg';
import rookWhite from './img/rook-white.svg';

const constructPieceSrc = (pieceType, isWhite) => {
  switch(pieceType) {
    case "bishop": return isWhite ? bishopWhite : bishopBlack;
    case "king": return isWhite ? kingWhite : kingBlack;
    case "knight": return isWhite ? knightWhite : knightBlack;
    case "pawn": return isWhite ? pawnWhite : pawnBlack;
    case "queen": return isWhite ? queenWhite : queenBlack;
    case "rook": return isWhite ? rookWhite : rookBlack;
    default: return "";
  };
};

const Piece = ({ onDragStart, pieceType, isWhite }) => {
  return (
    <img
      className="piece"
      src={constructPieceSrc(pieceType, isWhite)}
      alt={pieceType}
      draggable="true"
      onDragStart={onDragStart}
    />
  );
};

export default Piece;