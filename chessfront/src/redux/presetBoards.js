const emptyTile = { occupied: false, occupier: null };
const tileNames = [];
let emptyBoard = {};


for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
        const fileName = String.fromCharCode(i + 97);
        const rankName = (j + 1).toString();
        tileNames.push(fileName + rankName);
    }
}
tileNames.forEach(value => {
    emptyBoard[value] = emptyTile
});

export const startingBoard = {
    tiles: {
        a1: { occupied: true, occupier: "rook", isWhite: true },
        a2: { occupied: true, occupier: "pawn", isWhite: true },
        a3: emptyTile,
        a4: emptyTile,
        a5: emptyTile,
        a6: emptyTile,
        a7: { occupied: true, occupier: "pawn", isWhite: false },
        a8: { occupied: true, occupier: "rook", isWhite: false },
        b1: { occupied: true, occupier: "knight", isWhite: true },
        b2: { occupied: true, occupier: "pawn", isWhite: true },
        b3: emptyTile,
        b4: emptyTile,
        b5: emptyTile,
        b6: emptyTile,
        b7: { occupied: true, occupier: "pawn", isWhite: false },
        b8: { occupied: true, occupier: "knight", isWhite: false },
        c1: { occupied: true, occupier: "bishop", isWhite: true },
        c2: { occupied: true, occupier: "pawn", isWhite: true },
        c3: emptyTile,
        c4: emptyTile,
        c5: emptyTile,
        c6: emptyTile,
        c7: { occupied: true, occupier: "pawn", isWhite: false },
        c8: { occupied: true, occupier: "bishop", isWhite: false },
        d1: { occupied: true, occupier: "queen", isWhite: true },
        d2: { occupied: true, occupier: "pawn", isWhite: true },
        d3: emptyTile,
        d4: emptyTile,
        d5: emptyTile,
        d6: emptyTile,
        d7: { occupied: true, occupier: "pawn", isWhite: false },
        d8: { occupied: true, occupier: "queen", isWhite: false },
        e1: { occupied: true, occupier: "king", isWhite: true },
        e2: { occupied: true, occupier: "pawn", isWhite: true },
        e3: emptyTile,
        e4: emptyTile,
        e5: emptyTile,
        e6: emptyTile,
        e7: { occupied: true, occupier: "pawn", isWhite: false },
        e8: { occupied: true, occupier: "king", isWhite: false },
        f1: { occupied: true, occupier: "bishop", isWhite: true },
        f2: { occupied: true, occupier: "pawn", isWhite: true },
        f3: emptyTile,
        f4: emptyTile,
        f5: emptyTile,
        f6: emptyTile,
        f7: { occupied: true, occupier: "pawn", isWhite: false },
        f8: { occupied: true, occupier: "bishop", isWhite: false },
        g1: { occupied: true, occupier: "knight", isWhite: true },
        g2: { occupied: true, occupier: "pawn", isWhite: true },
        g3: emptyTile,
        g4: emptyTile,
        g5: emptyTile,
        g6: emptyTile,
        g7: { occupied: true, occupier: "pawn", isWhite: false },
        g8: { occupied: true, occupier: "knight", isWhite: false },
        h1: { occupied: true, occupier: "rook", isWhite: true },
        h2: { occupied: true, occupier: "pawn", isWhite: true },
        h3: emptyTile,
        h4: emptyTile,
        h5: emptyTile,
        h6: emptyTile,
        h7: { occupied: true, occupier: "pawn", isWhite: false },
        h8: { occupied: true, occupier: "rook", isWhite: false },
    },
};

export const concedeCheckBoard = {
    ...emptyBoard,
    e1: { occupied: true, occupier: "king", isWhite: true },
    e4: { occupied: true, occupier: "rook", isWhite: true },
    e5: { occupied: true, occupier: "rook", isWhite: false },
    e8: { occupied: true, occupier: "king", isWhite: false },
};