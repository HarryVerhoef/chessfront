/* eslint-disable no-cond-assign */
import {
  position,
  board,
} from './types';

const isOpponentPiece = (board: board, firstPiece: string, secondPiece: string): boolean => {
  return board[firstPiece].occupied && board[secondPiece].occupied && (board[firstPiece].isWhite !== board[secondPiece].isWhite);
};

const incrementAbsoluteFile = (position: string, n: number): string => {
  const newFile: number = position.charCodeAt(0) + n;
  if (newFile < 97 || newFile > 104) {
    return "oob";
  }
  return String.fromCharCode(newFile) + position.charAt(1);
};

const incrementAbsoluteRank = (position: string, n: number): string => {
  const newRank: number = parseInt(position.charAt(1)) + n;
  if (newRank < 1 || newRank > 8) {
    return "oob"; // Out of bounds
  }
  return position.charAt(0) + newRank.toString();
};

const incrementRelativeFile = (board: board, position: string, n: number): string => {
  const newIncrement: number = (board[position].isWhite) ? n : -n;
  return incrementAbsoluteFile(position, newIncrement);
};

const incrementRelativeRank = (board: board, position: string, n: number): string => {
  const newIncrement: number = (board[position].isWhite) ? n : -n;
  return incrementAbsoluteRank(position, newIncrement);
};

const possibleKingMoves = (position: position, board: board) => {
  /*
  ** (1) Generate list of new positions
  ** 
  ** 
  */
};

const possibleDiagonalMoves = (position: position, board: board): string[] => {
  let moves: string[] = [];

  for (let i: number = 0; i < 4; i++) {
    const increment: number = (i < 3) ? 1 : -1;
    let nextPosition: string = position;
    while (true) {
      if (i & 1) {
        nextPosition = incrementAbsoluteFile(nextPosition, increment);
        nextPosition = incrementAbsoluteRank(nextPosition, increment);
      } else {
        nextPosition = incrementAbsoluteFile(nextPosition, increment);
        nextPosition = incrementAbsoluteRank(nextPosition, -increment);
      };
      if (nextPosition === "oob" || board[nextPosition].occupied) {
        break;
      };
      moves.push(nextPosition);
    }
  }

  return moves;
}

const possibleSquareMoves = (position: position, board: board): string[] => {
  let moves: string[] = [];
  
  for (let i: number = 1; i < 4; i++) {
    const increment: number = (i < 3) ? 1 : -1;
    let nextPosition: string = position;
    while (true) {
      if (i & i) {
        nextPosition = incrementAbsoluteRank(nextPosition, increment);
      } else {
        nextPosition = incrementAbsoluteFile(nextPosition, increment);
      }
      if (nextPosition === "oob" || board[nextPosition].occupied) {
        break;
      }
      moves.push(nextPosition);
    };
  }
  return moves;
}

const possibleQueenMoves = (position: position, board: board) => {
  return possibleSquareMoves(position, board).concat(possibleDiagonalMoves(position, board));
};

const possibleKnightMoves = (position: position, board: board) => {
  //
};

const possiblePawnMoves = (position: position, board: board) => {
  let moves: string[] = [];

  /*
  ** 1. 1 space above if unoccupied
  ** 2. 2 spaces above if unoccupied and 1 space above is unoccupied and hasn't been moved already
  ** 3. 1 space above 1 space left/right if occupied by opponent piece
  */

  const directlyAbove: string = incrementRelativeRank(board, position, 1);
  const upAndLeft: string = incrementRelativeFile(board, directlyAbove, -1);
  const upAndRight: string = incrementRelativeFile(board, directlyAbove, 1);

  /* (1) 1 space above if unoccupied */
  if (!board[directlyAbove].occupied) {
    moves.push(directlyAbove)
  }
  /* (2) 2 spaces above if unoccipied and 1 space above is unoccupied and hasn't been moved already */
  if ((board[position].isWhite && position[1] === "2") || (!board[position].isWhite && position[1] === "7")) {
    if (!board[directlyAbove].occupied) {
      const twoSpacesAbove: string = incrementRelativeRank(board, position, 2);
      if (!board[directlyAbove].occupied) {
        moves.push(twoSpacesAbove);
      };
    };
  };
  /* (3) 1 space above 1 space left/right if occupied by opponent piece */
  if (isOpponentPiece(position, upAndLeft)) {
    moves.push(upAndLeft);
  };
  if (isOpponentPiece(position, upAndRight)) {
    moves.push(upAndRight);
  };
  
  return moves;
};


export const possibleMoves = (position: position, board: board): string[] => {
  switch (board[position].occupier) {
    case "king":
      return possibleKingMoves(position, board);
    case "queen":
      return possibleQueenMoves(position, board);
    case "rook":
      return possibleSquareMoves(position, board);
    case "bishop":
      return possibleDiagonalMoves(position, board);
    case "knight":
      return possibleKnightMoves(position, board);
    case "pawn":
      return possiblePawnMoves(position, board);
    default: {
      return [];
    }
  }
}