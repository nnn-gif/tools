import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import "github-markdown-css/github-markdown.css";
import "highlight.js/styles/github-dark.css";
import { cn } from "@/lib/utils";

interface PreviewProps {
    markdown: string;
    className?: string;
}

export function Preview({ markdown, className }: PreviewProps) {
    return (
        <div className={cn("h-full w-full overflow-auto bg-white p-8 dark:bg-[#0d1117]", className)} id="preview-content">
            <article className="markdown-body bg-transparent">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeHighlight]}
                >
                    {markdown}
                </ReactMarkdown>
            </article>
        </div>
    );
}
