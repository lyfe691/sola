/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Check,
  Github,
  Linkedin,
  Mail,
  Send,
  UploadCloud,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useLanguage } from "@/lib/language-provider";
import { translations, type Translation } from "@/lib/translations";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { IconButton } from "@/components/ui/custom/icon-button";
import ScrollReveal from "@/components/ScrollReveal";
import { SOCIAL_LINKS } from "@/config/social";
import { createPortal } from "react-dom";

// file constraints
const ACCEPTED_MIME = new Set<string>([
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const ACCEPTED_EXT = ".png,.jpg,.jpeg,.webp,.pdf,.doc,.docx";
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

type FieldName = "name" | "email" | "subject" | "message";
const FIELD_ORDER: FieldName[] = ["name", "email", "subject", "message"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

const DIRECT_LINKS = [
  { ...SOCIAL_LINKS.email, Icon: Mail },
  { ...SOCIAL_LINKS.github, Icon: Github },
  { ...SOCIAL_LINKS.linkedin, Icon: Linkedin },
] as const;

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes)) return "";
  const units = ["B", "KB", "MB", "GB"] as const;
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }
  const rounded = Math.round(size * 10) / 10;
  return `${Number.isInteger(rounded) ? rounded : rounded.toFixed(1)} ${units[unitIndex]}`;
}

type FileValidationResult =
  | { ok: true }
  | { ok: false; code: "too_large" | "unsupported_type" };

function validateFile(file: File): FileValidationResult {
  if (file.size > MAX_FILE_BYTES) return { ok: false, code: "too_large" };
  const mimeOk = file.type ? ACCEPTED_MIME.has(file.type) : true;
  const ext = file.name.toLowerCase().split(".").pop() ?? "";
  const extOk = ["png", "jpg", "jpeg", "webp", "pdf", "doc", "docx"].includes(
    ext,
  );
  if (!mimeOk && !extOk) return { ok: false, code: "unsupported_type" };
  return { ok: true };
}

function uploadToCloudinary(
  file: File,
  onProgress?: (progress: number) => void,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "unsigned_upload");

    xhr.open("POST", "https://api.cloudinary.com/v1_1/dfgoxrimk/upload");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText).secure_url as string);
        } catch (err) {
          reject(err);
        }
      } else {
        reject(new Error(`Cloudinary upload failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = () =>
      reject(new Error("Network error during Cloudinary upload"));

    xhr.send(data);
  });
}

const FieldError = ({ name, error }: { name: string; error?: string }) => (
  <div className="min-h-6">
    <AnimatePresence initial={false}>
      {error && (
        <motion.p
          key={`${name}-error`}
          initial={{ opacity: 0, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -2 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="pt-1 text-sm leading-5 text-destructive/90"
          role="alert"
          aria-live="polite"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

const Contact = () => {
  const { language } = useLanguage();
  const t = translations[language] as Translation;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isPageDragActive, setIsPageDragActive] = useState(false);
  const dragCounter = useRef(0);
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const subjectRef = useRef<HTMLInputElement | null>(null);
  const messageRef = useRef<HTMLTextAreaElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const validateField = (
    name: FieldName,
    value: string,
  ): string | undefined => {
    const v = value.trim();
    if (!v) return t.contact.validation[`${name}Required`];
    if (name === "email" && !EMAIL_RE.test(v))
      return t.contact.validation.emailInvalid;
    return undefined;
  };

  const handleFieldChange =
    (name: FieldName) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = e.target;
      setFormValues((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
    };

  const handleFieldBlur = (name: FieldName) => () => {
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, formValues[name]),
    }));
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const subject = params.get("subject") ?? "";
    const message = params.get("message") ?? "";
    if (subject || message) {
      setFormValues((prev) => ({ ...prev, subject, message }));
    }
  }, [location.search]);

  const onSelectFile = useCallback(
    (incoming: File | null) => {
      let file = incoming;
      if (file) {
        const v = validateFile(file);
        if (!v.ok) {
          toast.error(
            v.code === "too_large"
              ? t.contact.fileTooLarge.replace(
                  "{max}",
                  formatBytes(MAX_FILE_BYTES),
                )
              : t.contact.unsupportedFileType,
          );
          file = null;
        }
      }
      if (!file && fileInputRef.current) fileInputRef.current.value = "";
      setSelectedFile(file);
      setUploadedUrl(null);
      setUploadProgress(null);
    },
    [t],
  );

  // global drag overlay activation
  useEffect(() => {
    const hasFiles = (e: DragEvent) =>
      !!e.dataTransfer && Array.from(e.dataTransfer.types).includes("Files");

    const onDragEnter = (e: DragEvent) => {
      if (hasFiles(e)) {
        dragCounter.current += 1;
        setIsPageDragActive(true);
        e.preventDefault();
      }
    };

    const onDragOver = (e: DragEvent) => {
      if (hasFiles(e)) {
        e.preventDefault();
      }
    };

    const onDragLeave = (e: DragEvent) => {
      if (hasFiles(e)) {
        dragCounter.current = Math.max(0, dragCounter.current - 1);
        if (dragCounter.current === 0) setIsPageDragActive(false);
        e.preventDefault();
      }
    };

    const onWindowDrop = (e: DragEvent) => {
      if (hasFiles(e)) {
        const file = e.dataTransfer?.files?.[0] ?? null;
        if (file) onSelectFile(file);
        setIsPageDragActive(false);
        dragCounter.current = 0;
        e.preventDefault();
      }
    };

    window.addEventListener("dragenter", onDragEnter);
    window.addEventListener("dragover", onDragOver);
    window.addEventListener("dragleave", onDragLeave);
    window.addEventListener("drop", onWindowDrop);
    window.addEventListener("dragend", onWindowDrop);

    return () => {
      window.removeEventListener("dragenter", onDragEnter);
      window.removeEventListener("dragover", onDragOver);
      window.removeEventListener("dragleave", onDragLeave);
      window.removeEventListener("drop", onWindowDrop);
      window.removeEventListener("dragend", onWindowDrop);
    };
  }, [onSelectFile]);

  const clearForm = () => {
    setFormValues({ name: "", email: "", subject: "", message: "" });
    onSelectFile(null);
    if (location.search) {
      navigate("/contact", { replace: true });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting || isUploading) return;

    const newErrors: Partial<Record<FieldName, string>> = {};
    for (const name of FIELD_ORDER) {
      const err = validateField(name, formValues[name]);
      if (err) newErrors[name] = err;
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (newErrors.name) nameRef.current?.focus();
      else if (newErrors.email) emailRef.current?.focus();
      else if (newErrors.subject) subjectRef.current?.focus();
      else if (newErrors.message) messageRef.current?.focus();
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      if (selectedFile) {
        const v = validateFile(selectedFile);
        if (!v.ok) {
          toast.error(
            v.code === "too_large"
              ? t.contact.fileTooLarge.replace(
                  "{max}",
                  formatBytes(MAX_FILE_BYTES),
                )
              : t.contact.unsupportedFileType,
          );
          setIsSubmitting(false);
          return;
        }

        setIsUploading(true);
        setUploadProgress(0);
        const url = await uploadToCloudinary(selectedFile, (p) =>
          setUploadProgress(p),
        );
        setUploadedUrl(url);
        formData.append("fileUrl", url);
        formData.delete("attachment");
      }

      const response = await fetch("https://formspree.io/f/xeqydavz", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        toast.success(t.contact.successMessage);
        clearForm();
      } else {
        const data = await response.json();
        throw new Error(data.error || "Form submission failed");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(t.contact.errorMessage);
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onSelectFile(e.dataTransfer.files[0]);
    }
    setIsPageDragActive(false);
    dragCounter.current = 0;
  };

  const onClickDropzone = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex w-full flex-1 flex-col justify-center">
      <Helmet>
        <title>{t.seo.contact.title}</title>
        <meta name="description" content={t.seo.contact.description} />
      </Helmet>

      <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
        {/* left: intro, expectations, direct links */}
        <div className="flex flex-col gap-8">
          <ScrollReveal variant="pageTitle" className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {t.contact.title}
            </h1>
            <p className="max-w-md text-foreground/60">
              {t.contact.description}
            </p>
          </ScrollReveal>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col gap-8"
          >
            <div className="flex flex-col gap-4">
              <h2 className="text-sm font-semibold">
                {t.contact.expectations.title}
              </h2>
              <ul className="flex flex-col gap-3">
                {t.contact.expectations.items.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.1 + 0.08 * i }}
                    className="flex items-start gap-3 text-sm text-foreground/70"
                  >
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Check className="size-3 text-primary" strokeWidth={3} />
                    </span>
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-sm font-semibold">{t.contact.reachOut}</h2>
              <div className="flex flex-wrap gap-2">
                {DIRECT_LINKS.map(({ id, label, href, Icon }) => {
                  const external = href.startsWith("http");
                  return (
                    <a
                      key={id}
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm text-foreground/70 transition-colors hover:border-foreground/40 hover:text-foreground"
                    >
                      <Icon className="size-4" />
                      {label}
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* right: form card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Card className="gap-0 bg-card/60 p-6 backdrop-blur-md sm:p-8">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-5"
            >
              <h2 className="text-lg font-semibold sm:text-xl">
                {t.contact.formTitle}
              </h2>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="flex flex-col">
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    aria-label={t.contact.nameLabel}
                    placeholder={t.contact.namePlaceholder}
                    value={formValues.name}
                    onChange={handleFieldChange("name")}
                    onBlur={handleFieldBlur("name")}
                    ref={nameRef}
                    aria-invalid={!!errors.name || undefined}
                  />
                  <FieldError name="name" error={errors.name} />
                </div>

                <div className="flex flex-col">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    aria-label={t.contact.emailLabel}
                    placeholder={t.contact.emailPlaceholder}
                    value={formValues.email}
                    onChange={handleFieldChange("email")}
                    onBlur={handleFieldBlur("email")}
                    ref={emailRef}
                    aria-invalid={!!errors.email || undefined}
                  />
                  <FieldError name="email" error={errors.email} />
                </div>
              </div>

              <div className="flex flex-col">
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  aria-label={t.contact.subjectLabel}
                  placeholder={t.contact.subjectPlaceholder}
                  value={formValues.subject}
                  onChange={handleFieldChange("subject")}
                  onBlur={handleFieldBlur("subject")}
                  ref={subjectRef}
                  aria-invalid={!!errors.subject || undefined}
                />
                <FieldError name="subject" error={errors.subject} />
              </div>

              <div className="flex flex-col">
                <Textarea
                  id="message"
                  name="message"
                  required
                  aria-label={t.contact.messageLabel}
                  placeholder={t.contact.messagePlaceholder}
                  className="min-h-32"
                  value={formValues.message}
                  onChange={handleFieldChange("message")}
                  onBlur={handleFieldBlur("message")}
                  ref={messageRef}
                  aria-invalid={!!errors.message || undefined}
                />
                <FieldError name="message" error={errors.message} />
              </div>

              {/* attachment */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={onDrop}
                onClick={onClickDropzone}
                className={`group relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed p-4 transition-colors sm:p-6 ${isPageDragActive ? "border-foreground/40 bg-foreground/10 ring-2 ring-foreground/20" : "border-foreground/20 bg-foreground/5 hover:bg-foreground/10"}`}
              >
                <input
                  ref={fileInputRef}
                  id="attachment"
                  name="attachment"
                  type="file"
                  className="hidden"
                  accept={ACCEPTED_EXT}
                  onChange={(e) => onSelectFile(e.target.files?.[0] ?? null)}
                />
                <div className="flex items-center gap-2 text-foreground/70">
                  <UploadCloud className="size-4" />
                  <span className="text-sm">
                    {selectedFile
                      ? `${selectedFile.name}${selectedFile.size ? ` • ${formatBytes(selectedFile.size)}` : ""}`
                      : t.contact.attachmentPlaceholder}
                  </span>
                </div>
                {(isUploading || uploadProgress !== null) && (
                  <div className="mt-2 w-full">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
                      <div
                        className="h-full bg-foreground transition-all"
                        style={{ width: `${uploadProgress ?? 0}%` }}
                      />
                    </div>
                    <div className="mt-1 text-center text-xs text-foreground/60">
                      {uploadProgress ?? 0}%
                    </div>
                  </div>
                )}
                {uploadedUrl && !isUploading && (
                  <div className="mt-2 text-xs text-foreground/60">
                    {t.contact.uploadedLabel}:{" "}
                    <a
                      className="underline"
                      href={uploadedUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t.contact.cloudinaryLinkLabel}
                    </a>
                  </div>
                )}
                {selectedFile && !isUploading && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectFile(null);
                    }}
                    className="absolute top-2 right-2 rounded-full p-1 text-foreground/60 hover:bg-foreground/10 hover:text-foreground"
                    aria-label="Remove file"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              <IconButton
                type="submit"
                disabled={isSubmitting || isUploading}
                iconPosition="left"
                icon={isSubmitting ? <Spinner /> : <Send className="h-4 w-4" />}
                variant="default"
                size="lg"
                className="mt-1 w-full"
                label={
                  isSubmitting || isUploading
                    ? t.contact.sending
                    : t.contact.send
                }
              />
            </form>
          </Card>
        </motion.div>
      </div>

      {createPortal(
        <AnimatePresence>
          {isPageDragActive && (
            <motion.div
              className="fixed inset-0 z-100 pointer-events-none flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="absolute inset-0 bg-foreground/5 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              <motion.div
                className="relative"
                initial={{ scale: 0.96, opacity: 0, filter: "blur(6px)" }}
                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                exit={{ scale: 0.98, opacity: 0, filter: "blur(6px)" }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <div className="relative rounded-2xl border border-dashed border-foreground/30 bg-background/70 px-4 py-3 shadow-xl ring-1 ring-foreground/10 sm:px-6 sm:py-4">
                  <div className="absolute -inset-4 rounded-3xl bg-linear-to-tr from-foreground/10 to-transparent blur-xl" />
                  <div className="relative flex items-center gap-2 text-foreground/80">
                    <UploadCloud className="size-5 sm:size-6" />
                    <div className="size-2 animate-pulse rounded-full bg-foreground/50" />
                    <span className="text-sm sm:text-base">
                      {t.contact.dropOverlay}
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
};

export default Contact;
