import React, { useState, useRef, useEffect } from 'react';

const STATUS = [
  { label: 'Off Duty', color: 'bg-gray-200' },
  { label: 'Sleeper Berth', color: 'bg-cyan-200' },
  { label: 'Driving', color: 'bg-yellow-200' },
  { label: 'On Duty', color: 'bg-orange-200' },
];

const HOURS = 24;
const BLOCKS_PER_HOUR = 4;
const TOTAL_BLOCKS = HOURS * BLOCKS_PER_HOUR;

const BLOCK_HEIGHTS = ['h-5', 'h-3', 'h-2.5', 'h-3'];

export default function DailyLogGrid() {
  const [blocks, setBlocks] = useState(Array(TOTAL_BLOCKS).fill(0));
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const lastClicked = useRef(null);

  const handleMouseDown = (blockIdx, rowIdx) => {
    setDragging(true);
    setDragStart({ idx: blockIdx, row: rowIdx });
    updateBlocks(blockIdx, blockIdx, rowIdx);
    lastClicked.current = { idx: blockIdx, row: rowIdx };
  };

  const handleMouseEnter = (blockIdx, rowIdx) => {
    if (dragging && dragStart) {
      updateBlocks(dragStart.idx, blockIdx, dragStart.row);
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    setDragStart(null);
  };

  const handleBlockClick = (blockIdx, rowIdx, e) => {
    if (e.shiftKey && lastClicked.current) {
      if (lastClicked.current.row === rowIdx) {
        updateBlocks(lastClicked.current.idx, blockIdx, rowIdx);
      }
    } else {
      updateBlocks(blockIdx, blockIdx, rowIdx);
      lastClicked.current = { idx: blockIdx, row: rowIdx };
    }
  };

  const updateBlocks = (start, end, rowIdx) => {
    const [from, to] = [start, end].sort((a, b) => a - b);
    setBlocks((prev) => {
      const newBlocks = [...prev];
      for (let i = from; i <= to; i++) {
        newBlocks[i] = rowIdx;
      }
      return newBlocks;
    });
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mouseup', handleMouseUp);
      return () => window.removeEventListener('mouseup', handleMouseUp);
    }
  }, [dragging]);

  return (
    <div className="p-4 max-w-full select-none">
      <div className="flex ml-28 mb-1">
        {Array.from({ length: HOURS }).map((_, hourIdx) => (
          <div key={hourIdx} className="flex flex-col items-center" style={{ width: 40 }}>
            <span className="text-xs text-gray-700">{hourIdx === 0 ? 'Mid' : hourIdx}</span>
            <span className="text-[10px] text-gray-400">|</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-1 overflow-x-auto">
        {STATUS.map((status, rowIdx) => (
          <div key={status.label} className="flex items-center">
            <span className="w-28 text-sm font-medium pr-2 whitespace-nowrap">{status.label}</span>
            <div className="flex">
              {Array.from({ length: HOURS }).map((_, hourIdx) => (
                <div key={hourIdx} className="flex">
                  {Array.from({ length: BLOCKS_PER_HOUR }).map((_, blockIdx) => {
                    const globalIdx = hourIdx * BLOCKS_PER_HOUR + blockIdx;
                    const heightClass = BLOCK_HEIGHTS[blockIdx];
                    return (
                      <div
                        key={blockIdx}
                        onMouseDown={() => handleMouseDown(globalIdx, rowIdx)}
                        onMouseEnter={() => handleMouseEnter(globalIdx, rowIdx)}
                        onClick={(e) => handleBlockClick(globalIdx, rowIdx, e)}
                        className={`w-2.5 border border-gray-300 cursor-pointer ${heightClass} ${blocks[globalIdx] === rowIdx ? status.color : 'bg-white'} hover:ring-2 hover:ring-blue-300`}
                        title={`Hour: ${hourIdx}, Min: ${blockIdx * 15}`}
                        style={{ userSelect: 'none' }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-xs text-gray-500">
        <b>Tip:</b> Just drag, click, or shift+click in any row to fill time for that status.<br />
        Each row is a status, each hour contains 4 blocks (15-min each, 24 hours total).<br />
        0 min blocks are tallest; 15, 30, 45 min blocks are shorter for easier reading.
      </div>
    </div>
  );
} 