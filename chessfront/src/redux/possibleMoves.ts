/* eslint-disable no-cond-assign */
import {
  board,
  tile
} from './types';
import possibleAttackers from './possibleAttackers';

const isOpponentPiece = (brd: board, firstPiece: string, secondPiece: string): boolean => {
  if (secondPiece === "oob") {
    return false;
  }
  return brd[firstPiece].occupied && brd[secondPiece].occupied && (brd[firstPiece].isWhite !== brd[secondPiece].isWhite);
};

export const isOpponentPieceOrUnoccupied = (brd: board, firstPos: string, secondPos: string): boolean => {
  if (firstPos === "oob" || secondPos === "oob") {
    return false;
  }
  return !brd[secondPos].occupied || isOpponentPiece(brd, firstPos, secondPos);
};

export const incrementAbsoluteFile = (position: string, n: number): string => {
  const newFile: number = position.charCodeAt(0) + n;
  if (position === "oob" || newFile < 97 || newFile > 104) {
    return "oob";
  }
  return String.fromCharCode(newFile) + position.charAt(1);
};

export const incrementAbsoluteRank = (position: string, n: number): string => {
  const newRank: number = parseInt(position.charAt(1)) + n;
  if (position === "oob" || newRank < 1 || newRank > 8) {
    return "oob"; // Out of bounds
  }
  return position.charAt(0) + newRank.toString();
};

export const incrementRelativeFile = (brd: board, position: string, n: number): string => {
  if (position === "oob") {
    return "oob";
  };
  const newIncrement: number = (brd[position].isWhite) ? n : -n;
  return incrementAbsoluteFile(position, newIncrement);
};

export const incrementRelativeRank = (brd: board, position: string, n: number): string => {
  if (position === "oob") {
    return "oob";
  };
  const newIncrement: number = (brd[position].isWhite) ? n : -n;
  return incrementAbsoluteRank(position, newIncrement);
};

const isUnderAttack = (pos: string, brd: board): boolean => {
  console.log('isUnderAttack called: ', pos);
  const pieces = ["Q", "R", "B", "N"];

  for (let i = 0; i < pieces.length; i++) {
    if (possibleAttackers(brd, pieces[i], pos, brd[pos].isWhite).length) {
      console.log('returned true');
      console.log(possibleAttackers(brd, pieces[i], pos, brd[pos].isWhite));
      return true;
    };
  }

  console.log('returned false');
  return false;
};

const moveArbitraryPiece = (oldPosition: string, newPosition: string, brd: board, isWhite: boolean): board => {
  return {
    ...brd,
    [oldPosition]: {
      occupied: false,
      occupier: null,
      isWhite: false,
    },
    [newPosition]: {
      occupied: true,
      occupier: null,
      isWhite: isWhite,
    }
  }
}

const isUnderAttackAfterMove = (kingPos: string, oldPos: string, newPos: string, brd: board, isWhite: boolean): boolean => {
  console.log('isUnderAttackAfterMove:\n')
  console.log(`kingPos: ${kingPos}`);
  console.log(`oldPos: ${oldPos}`);
  console.log(`newPos: ${newPos}`);
  console.log(`isWhite: ${isWhite}\n\n`);
  const boardWithMove = moveArbitraryPiece(oldPos, newPos, brd, isWhite);
  const underAttack = isUnderAttack(kingPos, boardWithMove);
  return underAttack;
}

const possibleKingMoves = (position: string, brd: board, isWhite: boolean): string[] => {
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
    if (potentialMoves[i] !== "oob" && isOpponentPieceOrUnoccupied(brd, position, potentialMoves[i])) {
      moves.push(potentialMoves[i]);
    };
  };

 return moves;
};

const possibleDiagonalMoves = (position: string, brd: board, kingPos: string, isWhite: boolean): string[] => {
  let moves: string[] = [];

  for (let i: number = 1; i < 5; i++) {
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
      if (nextPosition === "oob") {
        break;
      } else if (brd[nextPosition].occupied) {
        if (isOpponentPiece(brd, position, nextPosition) && !isUnderAttackAfterMove(kingPos, position, nextPosition, brd, isWhite)) {
          moves.push(nextPosition);
        }
        break;
      }
      if (!isUnderAttackAfterMove(kingPos, position, nextPosition, brd, isWhite)) {
        moves.push(nextPosition);
      }
    }
  }

  return moves;
}

const possibleSquareMoves = (position: string, brd: board, kingPos: string, isWhite: boolean): string[] => {
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
      if (nextPosition === "oob") {
        break;
      } else if (brd[nextPosition].occupied) {
        if (isOpponentPiece(brd, position, nextPosition) && !isUnderAttackAfterMove(kingPos, position, nextPosition, brd, isWhite)) {
          moves.push(nextPosition);
        }
        break;
      }
      if (!isUnderAttackAfterMove(kingPos, position, nextPosition, brd, isWhite)) {
        moves.push(nextPosition);
      }
    };
  }
  return moves;
}

const possibleQueenMoves = (position: string, brd: board, kingPos: string, isWhite: boolean) => {
  return possibleSquareMoves(position, brd, kingPos, isWhite).concat(possibleDiagonalMoves(position, brd, kingPos, isWhite));
};

const possibleKnightMoves = (position: string, brd: board, kingPos: string, isWhite: boolean): string[] => {
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
    if (potentialMoves[i] !== 'oob' && isOpponentPieceOrUnoccupied(brd, position, potentialMoves[i])) {
      if (!isUnderAttackAfterMove(kingPos, position, potentialMoves[i], brd, isWhite)) {
        moves.push(potentialMoves[i]);
      }
    }
  }

  return moves;
};

const possiblePawnMoves = (position: string, brd: board, kingPos: string, isWhite: boolean) => {
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
  if (!brd[directlyAbove].occupied && !isUnderAttackAfterMove(kingPos, position, directlyAbove, brd, isWhite)) {
    moves.push(directlyAbove)
  }
  /* (2) 2 spaces above if unoccupied and 1 space above is unoccupied and hasn't been moved already */
  if ((brd[position].isWhite && position[1] === "2") || (!brd[position].isWhite && position[1] === "7")) {
    if (!brd[directlyAbove].occupied) {
      const twoSpacesAbove: string = incrementRelativeRank(brd, position, 2);
      if (!brd[twoSpacesAbove].occupied && !isUnderAttackAfterMove(kingPos, position, twoSpacesAbove, brd, isWhite)) {
        moves.push(twoSpacesAbove);
      };
    };
  };
  /* (3) 1 space above 1 space left/right if occupied by opponent piece */
  if (isOpponentPiece(brd, position, upAndLeft) && !isUnderAttackAfterMove(kingPos, position, upAndLeft, brd, isWhite)) {
    moves.push(upAndLeft);
  };
  if (isOpponentPiece(brd, position, upAndRight) && !isUnderAttackAfterMove(kingPos, position, upAndRight, brd, isWhite)) {
    moves.push(upAndRight);
  };
  
  return moves;
};

const possibleMoves = (position: string, brd: board, kingPos: string, isWhite: boolean): string[] => {
  console.log(brd);
  switch (brd[position].occupier) {
    case "king":
      return possibleKingMoves(position, brd, isWhite);
    case "queen":
      return possibleQueenMoves(position, brd, kingPos, isWhite);
    case "rook":
      return possibleSquareMoves(position, brd, kingPos, isWhite);
    case "bishop":
      return possibleDiagonalMoves(position, brd, kingPos, isWhite);
    case "knight":
      return possibleKnightMoves(position, brd, kingPos, isWhite);
    case "pawn":
      return possiblePawnMoves(position, brd, kingPos, isWhite);
    default: {
      return [];
    }
  }
};

export default possibleMoves;