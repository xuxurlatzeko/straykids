import React from 'react';
import type { RevealData } from '../types';
import { GRID_COLS, GRID_ROWS } from '../constants';
import { LinkIcon } from './IconComponents';

interface GridOverlayProps {
  globalReveals: Map<number, RevealData>;
  onBlockClick: (index: number) => void;
  canUnlock: boolean;
  isLoggedIn: boolean;
  overlayOpacity: number;
}

const Block: React.FC<{
  index: number;
  revealData?: RevealData;
  onBlockClick: (index: number) => void;
  canUnlock: boolean;
  isLoggedIn: boolean;
  overlayOpacity: number;
}> = ({ index, revealData, onBlockClick, canUnlock, isLoggedIn, overlayOpacity }) => {
  const isRevealed = !!revealData;
  const hasLink = isRevealed && !!revealData.profileUrl;

  let overlayClasses = 'absolute inset-0 transition-all duration-300 ease-in-out';
  let cursorClass = 'cursor-pointer';
  
  if (isRevealed) {
    overlayClasses += ' opacity-0 pointer-events-none';
  } else {
    overlayClasses += ` bg-white`;
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

  const BlockContent = (
    <div
      className={`relative group h-full w-full ${!hasLink ? cursorClass : ''}`}
      onClick={() => !hasLink && onBlockClick(index)}
      title={!isLoggedIn && !isRevealed ? 'Inicia sesión para revelar' : undefined}
    >
      <div className={overlayClasses} style={{ opacity: isRevealed ? 0 : overlayOpacity }}></div>
      
      {isRevealed && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 text-xs font-semibold text-white bg-slate-900/80 backdrop-blur-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap flex items-center gap-1.5">
          <span>{revealData.username}</span>
          {hasLink && <LinkIcon className="w-3 h-3" />}
        </div>
      )}
    </div>
  );

  if (hasLink) {
    return (
      <a
        href={revealData.profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full w-full cursor-pointer"
        title={`Visitar el perfil de ${revealData.username}`}
      >
        {BlockContent}
      </a>
    );
  }

  return BlockContent;
};


const MemoizedBlock = React.memo(Block);

const GridOverlay: React.FC<GridOverlayProps> = ({ globalReveals, onBlockClick, canUnlock, isLoggedIn, overlayOpacity }) => {
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
          revealData={globalReveals.get(index)}
          onBlockClick={onBlockClick}
          canUnlock={canUnlock}
          isLoggedIn={isLoggedIn}
          overlayOpacity={overlayOpacity}
        />
      ))}
    </div>
  );
};

export default GridOverlay;