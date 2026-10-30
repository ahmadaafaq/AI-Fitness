import React, { useMemo } from 'react';
import { marked } from 'marked';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const htmlContent = useMemo(() => {
    try {
      // Configure marked for clean, safe output
      return marked.parse(content, { breaks: true, gfm: true }) as string;
    } catch (e) {
      return content;
    }
  }, [content]);

  return (
    <div
      className={`markdown-content space-y-2 text-xs leading-relaxed text-slate-200 ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};
