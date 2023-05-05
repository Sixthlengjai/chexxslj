const common = require('./common.js')

class Game {
    constructor(bonusPacks = null) {
        this.turn = 0 // Int
        this.chessRecords = [] // Array<ChessRecord>
        this.width = 8 // Int
        this.height = 8 // Int
        this.chessboard = [] // Array<ChessCell>
        this.bonusPacks = bonusPacks // Game
        this.winner = null // either 'white' or 'black' or null
        this.ended = false // Bool

        this.setupDefault()
        this.applyBonusPack()
    }

    setupDefault() {
        this.chessboard = defaultChessboard
    }

    applyBonusPack() {
        if (this.bonusPacks == null) {
            return true
        }
        try {
            Object.keys(this.bonusPacks).forEach((prop) => {
                this.prop = this.bonusPacks[prop]
            })
        } catch (e) {
            console.log(e)
            return false
        }
        return true
    }

    calCost() {
        var white = 0
        var black = 0

        for (var chessCell of this.chessboard) {
            if (chessCell.color === WHITE) {
                white += chessCell.chessPiece.cost
            } else if (chessCell.color === BLACK) {
                black += chessCell.chessPiece.cost
            }
        }

        return {
            white: white,
            black: black
        }
    }

    movePiece(chessRecord) {
        var oldPieceFound = false
        for (var chessCell of this.chessboard) {
            // Overlaps the 'to' chess piece (if have)
            if (chessCell.row === chessRecord.to.row && chessCell.col === chessRecord.to.col) {
                chessCell.chessPiece = chessRecord.to.chessPiece
                chessCell.color = chessRecord.to.color
                oldPieceFound = true
            }
        }
        if (!oldPieceFound) {
            this.chessboard.push(chessRecord.to)
        }
    }

    applyTurn(chessRecord) {
        this.movePiece(chessRecord)
        this.chessRecords.push(chessRecord)
        this.turn += 1
        // TODO: Check for checking
    }

    socketChessBoard() {
        var cb = []
        for (var chess of this.chessboard) {
            cb.push(chess.display)
        }
        return cb
    }
}

class ChessPiece {
    constructor(display, fullName, directions, captures, cost,
        startDirections = null, specialDirections = null, undirectedPiece = false) {
        this.display = display // Char
        this.fullName = fullName // String
        this.directions = directions // ChessDirection
        this.captures = captures // ChessDirection
        this.cost = cost // Double

        this.startDirections = startDirections // ChessDirection
        this.specialDirections = specialDirections // ChessDirection
        this.undirectedPiece = undirectedPiece // Bool -> Need additional functions
    }
}

class ChessDirection {
    constructor(e, se, s, sw, w, nw, n, ne, e_p, se_p, s_p, sw_p, w_p, nw_p, n_p, ne_p, sim = []) {
        /*
            Directions is relating to the perspective from the user's side,
            i.e., n (North) means forward from perspective from the user's side (not the chessboard)
            With p: pene <Int>
            Without p: directs <Int>
            0 means cannot
            1 means infinite
            -2 means infinite but can cross board
            sim: compulsorily move more than one directions at the same time
            sim would override original ChessDirection object
        */
        this.e = e
        this.se = se
        this.s = s
        this.sw = sw
        this.w = w
        this.nw = nw
        this.n = n
        this.ne = ne
        this.e_p = e_p
        this.se_p = se_p
        this.s_p = s_p
        this.sw_p = sw_p
        this.w_p = w_p
        this.nw_p = nw_p
        this.n_p = n_p
        this.ne_p = ne_p
        this.sim = sim
    }

    arr() {
        return {
            directs: [this.e, this.se, this.s, this.sw, this.w, this.nw, this.n, this.ne],
            pene: [this.e_p, this.se_p, this.s_p, this.sw_p, this.w_p, this.nw_p, this.n_p, this.ne_p]
        }
    }
}

class ChessCell {
    constructor(row, col, chessPiece, color) {
        this.row = row // Int
        this.col = col // Int
        this.chessPiece = chessPiece // ChessPiece
        this.color = color // 'black' or 'white' or null
    }

    displayCell() {
        return `${(col - 'A').charCodeAt(0)}${row}`
    }
}

class ChessRecord {
    constructor(from, to) {
        this.from = from // ChessCell
        this.to = to // ChessCell
    }
}

const defaultChessPieces = [
    new ChessPiece(
        'K', 'King',
        new ChessDirection(
            1, 1, 1, 1, 1, 1, 1, 1,
            0, 0, 0, 0, 0, 0, 0, 0
        ),
        new ChessDirection(
            1, 1, 1, 1, 1, 1, 1, 1,
            0, 0, 0, 0, 0, 0, 0, 0
        ),
        -1
    ),
    new ChessPiece(
        'Q', 'Queen',
        new ChessDirection(
            -1, -1, -1, -1, -1, -1, -1, -1,
            0, 0, 0, 0, 0, 0, 0, 0
        ),
        new ChessDirection(
            -1, -1, -1, -1, -1, -1, -1, -1,
            0, 0, 0, 0, 0, 0, 0, 0
        ),
        10
    ),
    new ChessPiece(
        'R', 'Rook',
        new ChessDirection(
            -1, 0, -1, 0, -1, 0, -1, 0,
            0, 0, 0, 0, 0, 0, 0, 0
        ),
        new ChessDirection(
            0, -1, 0, -1, 0, -1, 0, -1,
            0, 0, 0, 0, 0, 0, 0, 0
        ),
        5.5
    ),
    new ChessPiece(
        'B', 'Bishop',
        new ChessDirection(
            0, -1, 0, -1, 0, -1, 0, -1,
            0, 0, 0, 0, 0, 0, 0, 0
        ),
        new ChessDirection(
            0, -1, 0, -1, 0, -1, 0, -1,
            0, 0, 0, 0, 0, 0, 0, 0
        ),
        3.5
    ),
    new ChessPiece(
        'N', 'Knight', null, null, 3.5, null, null, true
    ),
    new ChessPiece(
        'P', 'Pawn',
        new ChessDirection(
            0, 0, 0, 0, 0, 0, 1, 0,
            0, 0, 0, 0, 0, 0, 0, 0
        ),
        new ChessDirection(
            0, 0, 0, 0, 0, 1, 0, 1,
            0, 0, 0, 0, 0, 0, 0, 0
        ),
        1,
        new ChessDirection(
            0, 0, 0, 0, 0, 0, 2, 0,
            0, 0, 0, 0, 0, 0, 0, 0
        ),
        null, true
    )
]

const King = defaultChessPieces[0]
const Queen = defaultChessPieces[1]
const Rook = defaultChessPieces[2]
const Bishop = defaultChessPieces[3]
const Knight = defaultChessPieces[4]
const Pawn = defaultChessPieces[5]

const WHITE = 'white'
const BLACK = 'black'

const COLORS = [WHITE, BLACK]

const defaultChessboard = [
    new ChessCell(0, 0, Rook, BLACK),
    new ChessCell(0, 1, Knight, BLACK),
    new ChessCell(0, 2, Bishop, BLACK),
    new ChessCell(0, 3, Queen, BLACK),
    new ChessCell(0, 4, King, BLACK),
    new ChessCell(0, 5, Bishop, BLACK),
    new ChessCell(0, 6, Knight, BLACK),
    new ChessCell(0, 7, Rook, BLACK),
    new ChessCell(1, 0, Pawn, BLACK),
    new ChessCell(1, 1, Pawn, BLACK),
    new ChessCell(1, 2, Pawn, BLACK),
    new ChessCell(1, 3, Pawn, BLACK),
    new ChessCell(1, 4, Pawn, BLACK),
    new ChessCell(1, 5, Pawn, BLACK),
    new ChessCell(1, 6, Pawn, BLACK),
    new ChessCell(1, 7, Pawn, BLACK),

    new ChessCell(6, 0, Pawn, WHITE),
    new ChessCell(6, 1, Pawn, WHITE),
    new ChessCell(6, 2, Pawn, WHITE),
    new ChessCell(6, 3, Pawn, WHITE),
    new ChessCell(6, 4, Pawn, WHITE),
    new ChessCell(6, 5, Pawn, WHITE),
    new ChessCell(6, 6, Pawn, WHITE),
    new ChessCell(6, 7, Pawn, WHITE),
    new ChessCell(7, 0, Rook, WHITE),
    new ChessCell(7, 1, Knight, WHITE),
    new ChessCell(7, 2, Bishop, WHITE),
    new ChessCell(7, 3, Queen, WHITE),
    new ChessCell(7, 4, King, WHITE),
    new ChessCell(7, 5, Bishop, WHITE),
    new ChessCell(7, 6, Knight, WHITE)
]

module.exports = {
    Game,
    ChessPiece,
    ChessDirection,
    ChessCell,
    ChessRecord,
    COLORS
}