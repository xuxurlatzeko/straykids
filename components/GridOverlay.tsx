import React from 'react';
import { GRID_COLS, GRID_ROWS } from '../constants';

interface GridOverlayProps {
  globalReveals: Map<number, string>;
  onBlockClick: (index: number) => void;
  canUnlock: boolean;
  isLoggedIn: boolean;
}

const Block: React.FC<{
  index: number;
  revealer?: string;
  onBlockClick: (index: number) => void;
  canUnlock: boolean;
  isLoggedIn: boolean;
}> = ({ index, revealer, onBlockClick, canUnlock, isLoggedIn }) => {
  const isRevealed = !!revealer;

  let overlayClasses = 'absolute inset-0 transition-opacity duration-500 ease-in-out';
  let cursorClass = '';
  
  if (isRevealed) {
    overlayClasses += ' opacity-0 pointer-events-none';
  } else {
    overlayClasses += ' bg-white/80';
    if (isLoggedIn) {
      if (canUnlock) {
        cursorClass = ' cursor-pointer hover:bg-cyan-300/50';
      } else {
        cursorClass = ' cursor-not-allowed';
      }
    } else {
      cursorClass = ' cursor-help'; // Prompt to login
    }
  }

  return (
    <div 
      className="relative group h-full w-full"
      onClick={() => onBlockClick(index)}
      title={!isLoggedIn && !isRevealed ? 'Inicia sesión para revelar' : undefined}
    >
      <div className={overlayClasses + cursorClass}></div>
      
      {isRevealed && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 text-xs font-semibold text-white bg-slate-900/80 backdrop-blur-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
          {revealer}
        </div>
      )}
    </div>
  );
};


const MemoizedBlock = React.memo(Block);

const GridOverlay: React.FC<GridOverlayProps> = ({ globalReveals, onBlockClick, canUnlock, isLoggedIn }) => {
  const totalBlocks = GRID_COLS * GRID_ROWS;

  return (
    <div 
      className="relative w-full h-full grid"
      style={{
        gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
        gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
      }}
    >
      {Array.from({ length: totalBlocks }).map((_, index) => (
        <MemoizedBlock
          key={index}
          index={index}
          revealer={globalReveals.get(index)}
          onBlockClick={onBlockClick}
          canUnlock={canUnlock}
          isLoggedIn={isLoggedIn}
        />
      ))}
    </div>
  );
};

export default GridOverlay;