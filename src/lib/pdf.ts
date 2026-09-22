/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * pdf.js, loaded on first use; an open document stays open for the visit.
 */

import type { PDFDocumentProxy } from "pdfjs-dist";

let library: Promise<typeof import("pdfjs-dist")> | null = null;
const documents = new Map<string, Promise<PDFDocumentProxy>>();

const loadLibrary = () => {
  library ??= Promise.all([
    import("pdfjs-dist"),
    import("pdfjs-dist/build/pdf.worker.min.mjs?url"),
  ]).then(([pdfjs, worker]) => {
    pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
    return pdfjs;
  });
  return library;
};

export function loadPdf(url: string): Promise<PDFDocumentProxy> {
  let pending = documents.get(url);
  if (!pending) {
    pending = loadLibrary().then((pdfjs) => pdfjs.getDocument({ url }).promise);
    pending.catch(() => documents.delete(url));
    documents.set(url, pending);
  }
  return pending;
}
