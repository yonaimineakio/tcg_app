'use client';

import React, { useState } from 'react';

interface TruncatedDescriptionProps {
  text: string;
  maxLength?: number;
}

const TruncatedDescription = ({ text, maxLength = 100 }: TruncatedDescriptionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // テキストが短い場合は省略しない
  if (!text || text.length <= maxLength) {
    return (
      <span className="text-gray-700 mb-4 whitespace-pre-line break-words">
        {text}
      </span>
    );
  }
  
  return (
    <div className="text-gray-700 mb-4">
      <span className="whitespace-pre-line break-words">
        {isExpanded ? text : `${text.substring(0, maxLength)}...`}
      </span>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-blue-500 hover:underline ml-1 block mt-1 text-sm"
      >
        {isExpanded ? '閉じる' : '続きを読む'}
      </button>
    </div>
  );
};

export default TruncatedDescription;