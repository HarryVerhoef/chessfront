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

const possibleKingMoves = (position: position, board: board): string[] => {
  let potentialMoves: string[] = [];
  let moves: string[] = [];

  potentialMoves.push(incrementRelativeRank(board, position, 1)); // Up
  potentialMoves.push(incrementRelativeFile(board, position, 1)); // Right
  potentialMoves.push(incrementRelativeRank(board, position, -1)); // Down
  potentialMoves.push(incrementRelativeFile(board, position, -1)); // Left
  potentialMoves.push(incrementRelativeFile(board, potentialMoves[0], 1)); // Up and right
  potentialMoves.push(incrementRelativeFile(board, potentialMoves[2], 1)); // Down and right
  potentialMoves.push(incrementRelativeFile(board, potentialMoves[2], -1)); // Down and left
  potentialMoves.push(incrementRelativeFile(board, potentialMoves[0], -1)); // Up and left

  for (let i: number = 0; i < potentialMoves.length; i++) {
    if (potentialMoves[i] !== "oob" && !board[potentialMoves[i]].occupied) {
      moves.push(potentialMoves[i]);
    };
  };

 return moves;
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

const possibleKnightMoves = (position: position, board: board): string[] => {
  let moves: string[] = [];
  
  const directlyAbove: string = incrementRelativeRank(board, position, 3);
  const directlyBelow: string = incrementRelativeRank(board, position, -3);
  const directlyLeft: string = incrementRelativeFile(board, position, -3);
  const directlyRight: string = incrementRelativeFile(board, position, 3);

  let potentialMoves: string[] = [];
  potentialMoves.push(incrementRelativeFile(board, directlyAbove, -1));//up left
  potentialMoves.push(incrementRelativeFile(board, directlyAbove, 1));//up right
  potentialMoves.push(incrementRelativeFile(board, directlyBelow, -1));//down left
  potentialMoves.push(incrementRelativeFile(board, directlyBelow, 1));//down right
  potentialMoves.push(incrementRelativeRank(board, directlyLeft, 1));//left up
  potentialMoves.push(incrementRelativeRank(board, directlyLeft, -1));//left down
  potentialMoves.push(incrementRelativeRank(board, directlyRight, 1));//right up
  potentialMoves.push(incrementRelativeRank(board, directlyRight, -1));//right down

  for(let i: number = 0; i < potentialMoves.length; i++){
    if (potentialMoves[i] !== 'oob' && !board[potentialMoves[i]].occupied){
      moves.push(potentialMoves[i])
    }
  }

  return moves;
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
  if (isOpponentPiece(board, position, upAndLeft)) {
    moves.push(upAndLeft);
  };
  if (isOpponentPiece(board, position, upAndRight)) {
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