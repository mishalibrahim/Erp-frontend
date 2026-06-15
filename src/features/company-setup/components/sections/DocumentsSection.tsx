import { DOCUMENT_TYPES } from "@/features/company-setup/constants";
import { FolderOpen, Upload, FileCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";

interface UploadedFile {
  type: string;
  typeLabel: string;
  file: File;
}

export const DocumentsSection = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadType, setActiveUploadType] = useState<string | null>(null);

  const handleUpload = (type: string, typeLabel: string) => {
    setActiveUploadType(type);
    // Store label in a data attribute approach — we'll read it in onChange
    if (fileInputRef.current) {
      fileInputRef.current.dataset.type = type;
      fileInputRef.current.dataset.typeLabel = typeLabel;
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeUploadType) {
      const typeLabel =
        fileInputRef.current?.dataset.typeLabel || activeUploadType;
      setUploadedFiles((prev) => [
        ...prev.filter((f) => f.type !== activeUploadType),
        { type: activeUploadType, typeLabel, file },
      ]);
    }
    // Reset
    if (fileInputRef.current) fileInputRef.current.value = "";
    setActiveUploadType(null);
  };

  const removeFile = (type: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.type !== type));
  };

  const getFileForType = (type: string) =>
    uploadedFiles.find((f) => f.type === type);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border/50">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
          <FolderOpen className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Document Management</h3>
          <p className="text-sm text-muted-foreground">
            Upload required UAE company documents
          </p>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        onChange={handleFileChange}
      />

      {/* Document Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DOCUMENT_TYPES.map((docType) => {
          const uploaded = getFileForType(docType.value);

          return (
            <div
              key={docType.value}
              className={`rounded-xl border p-5 transition-all duration-200 ${
                uploaded
                  ? "border-emerald-400/40 bg-emerald-500/5"
                  : "border-border/60 bg-card/50 hover:border-border"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className={`flex items-center justify-center w-9 h-9 rounded-lg shrink-0 ${
                      uploaded
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {uploaded ? (
                      <FileCheck className="w-4 h-4" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {docType.label}
                    </p>
                    {uploaded ? (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 truncate">
                        {uploaded.file.name}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        PDF, JPG, PNG, DOC
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {uploaded && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(docType.value)}
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant={uploaded ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleUpload(docType.value, docType.label)}
                    className="text-xs"
                  >
                    {uploaded ? "Replace" : "Upload"}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="rounded-xl border border-border/60 p-4 bg-muted/30">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Documents uploaded:{" "}
            <span className="font-semibold text-foreground">
              {uploadedFiles.length}
            </span>{" "}
            / {DOCUMENT_TYPES.length}
          </p>
          {uploadedFiles.length === DOCUMENT_TYPES.length && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
              <FileCheck className="w-3 h-3" />
              All uploaded
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
