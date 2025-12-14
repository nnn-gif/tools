"use client";

import { useState, useRef } from "react";
import { Editor } from "@/components/Editor";
import { Preview } from "@/components/Preview";
import { ExportMenu } from "@/components/ExportMenu";
import { FileCode, Sparkles, Upload } from "lucide-react";

// Client component, so we can't export metadata directly unless we split it.
// For MVP/Single file, we can either use layout.tsx or just document title.
// But since this is "use client", we can't export Metadata. 
// I will move metadata to layout.tsx separately or ignore strict SEO Requirement for the *Page* file if I can't split.
// Actually, I can just change document.title in useEffect or rely on layout.
// User requirement: "SEO Page Generator... Metadata". 
// I should probably edit layout.tsx for the global metadata.
// For now, I will implement File Upload here.

export default function Home() {
    const [markdown, setMarkdown] = useState<string>(`# Welcome to Markdown Tools

Start typing in the editor on the left to see the live preview on the right.

## Features
- **Live Preview**: See changes instantly
- **Export**: Download as PDF or DOCX
- **Clean UI**: Distraction-free writing environment

## Code Example
\`\`\`javascript
console.log("Hello, World!");
\`\`\`

## Lists
- Item 1
- Item 2
  - Subitem A
`);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 1024 * 1024) { // 1MB limit for safety
            alert("File is too large. Max 1MB.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            setMarkdown(content);
        };
        reader.readAsText(file);
    };

    return (
        <div className="flex h-screen flex-col bg-background text-foreground">
            {/* Header */}
            <header className="flex h-14 items-center justify-between border-b px-6 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <FileCode className="h-5 w-5" />
                    </div>
                    <h1 className="text-lg font-bold tracking-tight">Markdown Tools</h1>
                </div>

                <div className="flex items-center gap-4">
                    <input
                        type="file"
                        accept=".md,.markdown,.txt"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                        title="Upload Markdown File"
                    >
                        <Upload className="h-4 w-4" />
                        <span className="hidden sm:inline">Import</span>
                    </button>
                    <ExportMenu markdown={markdown} />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex flex-1 overflow-hidden">
                {/* Editor Pane */}
                <div className="flex-1 border-r">
                    <Editor
                        markdown={markdown}
                        onChange={setMarkdown}
                        className="h-full"
                    />
                </div>

                {/* Preview Pane */}
                <div className="hidden flex-1 md:flex bg-muted/30">
                    <Preview
                        markdown={markdown}
                        className="h-full"
                    />
                </div>
            </main>

            {/* Mobile Preview Toggle (Simple MVP approach: hidden on mobile default, could add toggle) */}
            <div className="md:hidden absolute bottom-4 right-4 bg-primary text-primary-foreground p-3 rounded-full shadow-lg">
                <Sparkles className="w-6 h-6" />
            </div>
        </div>
    );
}
