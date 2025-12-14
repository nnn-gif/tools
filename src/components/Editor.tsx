import { cn } from "@/lib/utils";

interface EditorProps {
    markdown: string;
    onChange: (value: string) => void;
    className?: string;
}

export function Editor({ markdown, onChange, className }: EditorProps) {
    return (
        <div className={cn("relative h-full w-full", className)}>
            <textarea
                className="h-full w-full resize-none bg-background p-4 font-mono text-sm leading-relaxed text-foreground focus:outline-none"
                placeholder="Type some markdown..."
                value={markdown}
                onChange={(e) => onChange(e.target.value)}
                spellCheck={false}
            />
        </div>
    );
}
