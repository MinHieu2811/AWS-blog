import { FuseResultMatch } from "fuse.js";
import { Highlight } from "@/components/features/Highlight";

export function generateSnippet(content: string, matches: readonly FuseResultMatch[] | undefined): React.ReactNode {
    const contentMatch = matches?.find(m => m.key === 'content');
    if (!contentMatch || !contentMatch.indices || contentMatch.indices.length === 0) {
        return `${content.substring(0, 100)}...`;
    }
    
    const firstMatchIndex = contentMatch.indices[0][0];
    const snippetRadius = 50;
    
    const start = Math.max(0, firstMatchIndex - snippetRadius);
    const end = Math.min(content.length, firstMatchIndex + snippetRadius);

    const snippetText = content.substring(start, end);
    const snippetIndices = contentMatch.indices.map(([s, e]) => [s - start, e - start] as [number, number]);

    return (
        <>
            {start > 0 && '...'}
            <Highlight text={snippetText} indices={snippetIndices} />
            {end < content.length && '...'}
        </>
    );
}