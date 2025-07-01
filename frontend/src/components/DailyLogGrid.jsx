import React, { useRef, useEffect } from 'react';

const STATUS = [
  { label: 'Off Duty', color: 'bg-gray-200', key: 'off' },
  { label: 'Sleeper Berth', color: 'bg-cyan-200', key: 'sleeper' },
  { label: 'Driving', color: 'bg-yellow-200', key: 'driving' },
  { label: 'On Duty', color: 'bg-orange-200', key: 'on' },
];

const HOURS = 24;
const BLOCKS_PER_HOUR = 4;
const TOTAL_BLOCKS = HOURS * BLOCKS_PER_HOUR;
const BLOCK_HEIGHTS = ['h-5', 'h-3', 'h-2.5', 'h-3'];

function formatHours(h) {
  return h % 1 === 0 ? `${h}h` : `${Math.floor(h)}h ${(h % 1) * 60}m`;
}

export default function DailyLogGrid({ blocks, setBlocks, totals }) {
  const [dragging, setDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState(null);
  const lastClicked = useRef(null);

  const computedTotals = [0, 0, 0, 0];
  if (blocks) {
    blocks.forEach((status) => {
      if (status >= 0 && status < 4) computedTotals[status] += 15;
    });
  }
  const computedTotalsHours = computedTotals.map((mins) => +(mins / 60).toFixed(2));

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mouseup', handleMouseUp);
      return () => window.removeEventListener('mouseup', handleMouseUp);
    }
  }, [dragging]);

  function handleMouseDown(blockIdx, rowIdx) {
    if (!setBlocks) return;
    setDragging(true);
    setDragStart({ idx: blockIdx, row: rowIdx });
    updateBlocks(blockIdx, blockIdx, rowIdx);
    lastClicked.current = { idx: blockIdx, row: rowIdx };
  }
  function handleMouseEnter(blockIdx, rowIdx) {
    if (!setBlocks) return;
    if (dragging && dragStart) {
      updateBlocks(dragStart.idx, blockIdx, dragStart.row);
    }
  }
  function handleMouseUp() {
    setDragging(false);
    setDragStart(null);
  }
  function handleBlockClick(blockIdx, rowIdx, e) {
    if (!setBlocks) return;
    if (e.shiftKey && lastClicked.current) {
      if (lastClicked.current.row === rowIdx) {
        updateBlocks(lastClicked.current.idx, blockIdx, rowIdx);
      }
    } else {
      updateBlocks(blockIdx, blockIdx, rowIdx);
      lastClicked.current = { idx: blockIdx, row: rowIdx };
    }
  }
  function updateBlocks(start, end, rowIdx) {
    if (!setBlocks) return;
    const [from, to] = [start, end].sort((a, b) => a - b);
    setBlocks((prev) => {
      const newBlocks = [...prev];
      for (let i = from; i <= to; i++) {
        newBlocks[i] = rowIdx;
      }
      return newBlocks;
    });
  }

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
            <span className="w-20 text-xs text-blue-700 pl-2">
              {totals && typeof totals[status.key] !== 'undefined'
                ? formatHours(totals[status.key])
                : formatHours(computedTotalsHours[rowIdx])}
            </span>
          </div>
        ))}
      </div>
      {/* Summary row for totals */}
      <div className="flex items-center justify-end mt-2 bg-gray-50 rounded px-2 py-1">
        <span className="text-xs font-medium mr-4">Totals:</span>
        {STATUS.map((status, idx) => (
          <span key={status.key} className="w-24 text-xs text-blue-700 text-center">
            {totals && typeof totals[status.key] !== 'undefined'
              ? formatHours(totals[status.key])
              : formatHours(computedTotalsHours[idx])}
            <span className="ml-1 text-gray-500">{status.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
} 