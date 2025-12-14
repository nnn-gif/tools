"use client";

import { Download, FileText, FileType } from "lucide-react";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";
import { useState } from "react";

interface ExportMenuProps {
    markdown: string;
}

export function ExportMenu({ markdown }: ExportMenuProps) {
    const [isExporting, setIsExporting] = useState(false);

    const handleExportPDF = async () => {
        setIsExporting(true);
        try {
            // Dynamic import to avoid SSR issues
            const html2pdf = (await import("html2pdf.js")).default;
            const element = document.getElementById("preview-content");
            if (!element) return;

            const opt = {
                margin: 10,
                filename: 'document.pdf',
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
            };

            await html2pdf().set(opt).from(element).save();
        } catch (error) {
            console.error("PDF Export failed", error);
        } finally {
            setIsExporting(false);
        }
    };

    const handleExportDOCX = async () => {
        setIsExporting(true);
        try {
            // Simple Parser for MVP: Split by newlines and create paragraphs
            // A more robust solution would use a markdown parser to traverse the AST
            const lines = markdown.split("\n");
            const children = lines.map((line) => {
                if (line.startsWith("# ")) {
                    return new Paragraph({
                        text: line.replace("# ", ""),
                        heading: HeadingLevel.HEADING_1,
                    });
                }
                if (line.startsWith("## ")) {
                    return new Paragraph({
                        text: line.replace("## ", ""),
                        heading: HeadingLevel.HEADING_2,
                    });
                }
                if (line.startsWith("### ")) {
                    return new Paragraph({
                        text: line.replace("### ", ""),
                        heading: HeadingLevel.HEADING_3,
                    });
                }
                if (line.startsWith("- ")) {
                    return new Paragraph({
                        text: line.replace("- ", ""),
                        bullet: { level: 0 }
                    });
                }
                // Basic paragraph
                return new Paragraph({
                    children: [new TextRun(line)],
                });
            });

            const doc = new Document({
                sections: [
                    {
                        properties: {},
                        children: children,
                    },
                ],
            });

            const blob = await Packer.toBlob(doc);
            saveAs(blob, "document.docx");
        } catch (error) {
            console.error("DOCX Export failed", error);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="flex gap-2">
            <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="flex items-center gap-2 rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50"
            >
                <FileType className="h-4 w-4" />
                {isExporting ? "Exporting..." : "PDF"}
            </button>
            <button
                onClick={handleExportDOCX}
                disabled={isExporting}
                className="flex items-center gap-2 rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50"
            >
                <FileText className="h-4 w-4" />
                {isExporting ? "Exporting..." : "DOCX"}
            </button>
        </div>
    );
}
