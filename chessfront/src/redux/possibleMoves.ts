/* eslint-disable no-cond-assign */
import {
  position,
  board,
} from './types';

const isOpponentPiece = (brd: board, firstPiece: string, secondPiece: string): boolean => {
  if (secondPiece === "oob") {
    return false;
  }
  return brd[firstPiece].occupied && brd[secondPiece].occupied && (brd[firstPiece].isWhite !== brd[secondPiece].isWhite);
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

const incrementRelativeFile = (brd: board, position: string, n: number): string => {
  if (position === "oob") {
    return "oob";
  };
  const newIncrement: number = (brd[position].isWhite) ? n : -n;
  return incrementAbsoluteFile(position, newIncrement);
};

const incrementRelativeRank = (brd: board, position: string, n: number): string => {
  if (position === "oob") {
    return "oob";
  };
  const newIncrement: number = (brd[position].isWhite) ? n : -n;
  return incrementAbsoluteRank(position, newIncrement);
};

const possibleKingMoves = (position: position, brd: board): string[] => {
  let potentialMoves: string[] = [];
  let moves: string[] = [];

  potentialMoves.push(incrementRelativeRank(brd, position, 1)); // Up
  potentialMoves.push(incrementRelativeFile(brd, position, 1)); // Right
  potentialMoves.push(incrementRelativeRank(brd, position, -1)); // Down
  potentialMoves.push(incrementRelativeFile(brd, position, -1)); // Left
  potentialMoves.push(incrementRelativeFile(brd, potentialMoves[0], 1)); // Up and right
  potentialMoves.push(incrementRelativeFile(brd, potentialMoves[2], 1)); // Down and right
  potentialMoves.push(incrementRelativeFile(brd, potentialMoves[2], -1)); // Down and left
  potentialMoves.push(incrementRelativeFile(brd, potentialMoves[0], -1)); // Up and left

  for (let i: number = 0; i < potentialMoves.length; i++) {
    if (potentialMoves[i] !== "oob" && !brd[potentialMoves[i]].occupied) {
      moves.push(potentialMoves[i]);
    };
  };

 return moves;
};

const possibleDiagonalMoves = (position: position, brd: board): string[] => {
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
      if (nextPosition === "oob" || brd[nextPosition].occupied) {
        break;
      };
      moves.push(nextPosition);
    }
  }

  return moves;
}

const possibleSquareMoves = (position: position, brd: board): string[] => {
  console.log("POSSIBLE SQUARE MOVES");
  let moves: string[] = [];
  
  for (let i: number = 1; i < 5; i++) {
    const increment: number = (i < 3) ? 1 : -1;
    let nextPosition: string = position;
    while (true) {
      if (i & 1) {
        nextPosition = incrementAbsoluteRank(nextPosition, increment);
      } else {
        nextPosition = incrementAbsoluteFile(nextPosition, increment);
      }
      if (nextPosition === "oob" || brd[nextPosition].occupied) {
        break;
      }
      moves.push(nextPosition);
    };
  }
  return moves;
}

const possibleQueenMoves = (position: position, brd: board) => {
  return possibleSquareMoves(position, brd).concat(possibleDiagonalMoves(position, brd));
};

const possibleKnightMoves = (position: position, brd: board): string[] => {
  let moves: string[] = [];
  
  const directlyAbove: string = incrementRelativeRank(brd, position, 2);
  const directlyBelow: string = incrementRelativeRank(brd, position, -2);
  const directlyLeft: string = incrementRelativeFile(brd, position, -2);
  const directlyRight: string = incrementRelativeFile(brd, position, 2);

  let potentialMoves: string[] = [];
  potentialMoves.push(incrementRelativeFile(brd, directlyAbove, -1));//up left
  potentialMoves.push(incrementRelativeFile(brd, directlyAbove, 1));//up right
  potentialMoves.push(incrementRelativeFile(brd, directlyBelow, -1));//down left
  potentialMoves.push(incrementRelativeFile(brd, directlyBelow, 1));//down right
  potentialMoves.push(incrementRelativeRank(brd, directlyLeft, 1));//left up
  potentialMoves.push(incrementRelativeRank(brd, directlyLeft, -1));//left down
  potentialMoves.push(incrementRelativeRank(brd, directlyRight, 1));//right up
  potentialMoves.push(incrementRelativeRank(brd, directlyRight, -1));//right down

  for(let i: number = 0; i < potentialMoves.length; i++){
    if (potentialMoves[i] !== 'oob' && !brd[potentialMoves[i]].occupied){
      moves.push(potentialMoves[i])
    }
  }

  return moves;
};

const possiblePawnMoves = (position: position, brd: board) => {
  let moves: string[] = [];

  /*
  ** 1. 1 space above if unoccupied
  ** 2. 2 spaces above if unoccupied and 1 space above is unoccupied and hasn't been moved already
  ** 3. 1 space above 1 space left/right if occupied by opponent piece
  */

  const directlyAbove: string = incrementRelativeRank(brd, position, 1);
  const upAndLeft: string = incrementRelativeFile(brd, directlyAbove, -1);
  const upAndRight: string = incrementRelativeFile(brd, directlyAbove, 1);

  /* (1) 1 space above if unoccupied */
  if (!brd[directlyAbove].occupied) {
    moves.push(directlyAbove)
  }
  /* (2) 2 spaces above if unoccipied and 1 space above is unoccupied and hasn't been moved already */
  if ((brd[position].isWhite && position[1] === "2") || (!brd[position].isWhite && position[1] === "7")) {
    if (!brd[directlyAbove].occupied) {
      const twoSpacesAbove: string = incrementRelativeRank(brd, position, 2);
      if (!brd[directlyAbove].occupied) {
        moves.push(twoSpacesAbove);
      };
    };
  };
  /* (3) 1 space above 1 space left/right if occupied by opponent piece */
  if (isOpponentPiece(brd, position, upAndLeft)) {
    moves.push(upAndLeft);
  };
  if (isOpponentPiece(brd, position, upAndRight)) {
    moves.push(upAndRight);
  };
  
  return moves;
};


const possibleMoves = (position: position, brd: board): string[] => {
  console.log(brd);
  switch (brd[position].occupier) {
    case "king":
      return possibleKingMoves(position, brd);
    case "queen":
      return possibleQueenMoves(position, brd);
    case "rook":
      return possibleSquareMoves(position, brd);
    case "bishop":
      return possibleDiagonalMoves(position, brd);
    case "knight":
      return possibleKnightMoves(position, brd);
    case "pawn":
      return possiblePawnMoves(position, brd);
    default: {
      return [];
    }
  }
};

export default possibleMoves;