import {
  board,
} from "./types";
import {
  incrementAbsoluteFile,
  incrementAbsoluteRank,
  incrementRelativeFile,
  incrementRelativeRank,
} from './possibleMoves';

const isOpponentPiece = (piece: string, brd: board, pos: string, isWhite: boolean): boolean => {
  return brd[pos].occupier === piece && (brd[pos].isWhite !== isWhite)
}

const possibleKingAttackers = (brd: board, pos: string, isWhite: boolean): string[] => {
  let potentialSpaces: string[] = [];
  let moves: string[] = [];

  potentialSpaces.push(incrementRelativeRank(brd, pos, 1)); // Up
  potentialSpaces.push(incrementRelativeFile(brd, pos, 1)); // Right
  potentialSpaces.push(incrementRelativeRank(brd, pos, -1)); // Down
  potentialSpaces.push(incrementRelativeFile(brd, pos, -1)); // Left
  potentialSpaces.push(incrementRelativeFile(brd, potentialSpaces[0], 1)); // Up and right
  potentialSpaces.push(incrementRelativeFile(brd, potentialSpaces[2], 1)); // Down and right
  potentialSpaces.push(incrementRelativeFile(brd, potentialSpaces[2], -1)); // Down and left
  potentialSpaces.push(incrementRelativeFile(brd, potentialSpaces[0], -1)); // Up and left

  for (let i: number = 0; i < potentialSpaces.length; i++) {
    if (isOpponentPiece("king", brd, potentialSpaces[i], isWhite)) {
      moves.push(potentialSpaces[i]);
    };
  };

  return moves;
};

const possibleQueenAttackers = (brd: board, pos: string, isWhite: boolean): string[] => {
  const squares = possibleSquareAttackers("queen", brd, pos, isWhite);
  const diagonals = possibleDiagonalAttackers("queen", brd, pos, isWhite);
  return squares.concat(diagonals);
};

const possibleSquareAttackers = (piece: string, brd: board, pos: string, isWhite: boolean): string[] => {
  let moves: string[] = [];
  
  for (let i: number = 1; i < 5; i++) {
    const increment: number = (i < 3) ? 1 : -1;
    let nextPosition: string = pos;
    while (true) {
      if (i & 1) {
        nextPosition = incrementAbsoluteRank(nextPosition, increment);
      } else {
        nextPosition = incrementAbsoluteFile(nextPosition, increment);
      }
      if (nextPosition === "oob") {
        break;
      } else if (brd[nextPosition].occupied) {
        if (isOpponentPiece(piece, brd, nextPosition, isWhite)) {
          moves.push(nextPosition);
        }
        break;
      }
    };
  }
  return moves;
};

const possibleDiagonalAttackers = (piece: string, brd: board, pos: string, isWhite: boolean): string[] => {
  let moves: string[] = [];

  for (let i: number = 1; i < 5; i++) {
    const increment: number = (i < 3) ? 1 : -1;
    let nextPosition: string = pos;
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
        if (isOpponentPiece(piece, brd, nextPosition, isWhite)) {
          console.log(nextPosition);
          moves.push(nextPosition);
        }
        break;
      }
    }
  }

  return moves;
};

const possibleKnightAttackers = (brd: board, pos: string, isWhite: boolean): string[] => {
  let potentialSpaces: string[] = [];
  let moves: string[] = [];

  const directlyAbove: string = incrementRelativeRank(brd, pos, 2);
  const directlyBelow: string = incrementRelativeRank(brd, pos, -2);
  const directlyLeft: string = incrementRelativeFile(brd, pos, -2);
  const directlyRight: string = incrementRelativeFile(brd, pos, 2);

  potentialSpaces.push(incrementRelativeFile(brd, directlyAbove, -1));//up left
  potentialSpaces.push(incrementRelativeFile(brd, directlyAbove, 1));//up right
  potentialSpaces.push(incrementRelativeFile(brd, directlyBelow, -1));//down left
  potentialSpaces.push(incrementRelativeFile(brd, directlyBelow, 1));//down right
  potentialSpaces.push(incrementRelativeRank(brd, directlyLeft, 1));//left up
  potentialSpaces.push(incrementRelativeRank(brd, directlyLeft, -1));//left down
  potentialSpaces.push(incrementRelativeRank(brd, directlyRight, 1));//right up
  potentialSpaces.push(incrementRelativeRank(brd, directlyRight, -1));//right down

  for(let i: number = 0; i < potentialSpaces.length; i++){
    if (potentialSpaces[i] !== "oob" && isOpponentPiece("knight", brd, potentialSpaces[i], isWhite)) {
      moves.push(potentialSpaces[i]);
    }
  }

  return moves;
};


const possibleAttackers = (brd: board, piece: string, pos: string, isWhite: boolean): string[] => {
  switch (piece) {
    case "K": {
      return possibleKingAttackers(brd, pos, isWhite);
    }
    case "Q": {
      return possibleQueenAttackers(brd, pos, isWhite);
    }
    case "R": {
      return possibleSquareAttackers("rook", brd, pos, isWhite);
    }
    case "B": {
      return possibleDiagonalAttackers("bishop", brd, pos, isWhite);
    }
    case "N": {
      return possibleKnightAttackers(brd, pos, isWhite);
    }
    default:
      return [];
  };
};

export default possibleAttackers;