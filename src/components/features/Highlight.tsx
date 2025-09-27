"use client";

export function Highlight({
  text,
  indices,
}: {
  text: string;
  indices: readonly [number, number][];
}) {
  if (!indices || indices.length === 0) {
    return <span>{text}</span>;
  }

  const sortedIndices = [...indices].sort((a, b) => a[0] - b[0]);
  let lastIndex = 0;
  const parts = [];

  sortedIndices.forEach(([start, end]) => {
    if (start > lastIndex) {
      parts.push(
        <span key={lastIndex}>{text.substring(lastIndex, start)}</span>
      );
    }

    parts.push(
      <strong key={start} className="bg-yellow-200 font-bold">
        {text.substring(start, end + 1)}
      </strong>
    );
    lastIndex = end + 1;
  });

  if (lastIndex < text.length) {
    parts.push(<span key={lastIndex}>{text.substring(lastIndex)}</span>);
  }

  return <>{parts}</>;
}

