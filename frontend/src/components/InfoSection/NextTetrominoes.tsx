// Component to display upcoming Tetris tetrominoes
import React from "react";
import { NextTetrominoesProps } from "./types";
import "./NextTetrominoes.css";

const NextTetrominoes: React.FC<NextTetrominoesProps> = ({ tetrominoes }) => {
  return (
    <div className="info-section-middle">
      <div className="next-container">
        <h3>Next Pieces:</h3>
        <div className="next-tetrominoes-row">
          {tetrominoes.map((tetromino, index) => {
            const displayShape = tetromino.shape.slice(0, 2);
            while (displayShape.length < 2) {
              displayShape.push(Array(tetromino.shape[0].length).fill(0));
            }

            return (
              <div className="next-tetromino" key={`next-${index}`}>
                <div className="next-tetromino-grid">
                  {displayShape.map((row, y) => (
                    <div className="preview-row" key={`preview-row-${index}-${y}`}>
                      {row.map((cell, x) => (
                        <div
                          className="preview-cell"
                          key={`preview-cell-${index}-${x}-${y}`}
                          style={{
                            backgroundColor: cell ? tetromino.color : "transparent",
                            width: "15px",
                            height: "15px",
                            margin: "1px",
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NextTetrominoes;
