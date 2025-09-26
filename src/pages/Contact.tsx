/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useState, useRef, useEffect } from "react";
import { Send, UploadCloud, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useLanguage } from "@/lib/language-provider";
import { translations, type Translation } from "@/lib/translations";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { IconButton } from "@/components/ui/custom/icon-button";
import ScrollReveal from "@/components/ScrollReveal";
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

type FileValidationResult = { ok: true } | { ok: false; code: "too_large" | "unsupported_type" };

function validateFile(file: File): FileValidationResult {
  if (file.size > MAX_FILE_BYTES) return { ok: false, code: "too_large" };
  const mimeOk = file.type ? ACCEPTED_MIME.has(file.type) : true;
  const ext = file.name.toLowerCase().split(".").pop() ?? "";
  const extOk = ["png", "jpg", "jpeg", "webp", "pdf", "doc", "docx"].includes(ext);
  if (!mimeOk && !extOk) return { ok: false, code: "unsupported_type" };
  return { ok: true };
}

const Contact = () => {
  const { language } = useLanguage();
  const t = translations[language] as Translation;
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isPageDragActive, setIsPageDragActive] = useState(false);
  const dragCounter = useRef(0);
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<Partial<Record<'name' | 'email' | 'subject' | 'message', string>>>({});
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const subjectRef = useRef<HTMLInputElement | null>(null);
  const messageRef = useRef<HTMLTextAreaElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const subject = params.get('subject');
    const message = params.get('message');
    
    if (subject || message) {
      setFormValues(prev => ({
        ...prev,
        subject: subject || '',
        message: message || ''
      }));
      
      setTimeout(() => {
        if (formRef.current) {
          const subjectEl = formRef.current.querySelector('[name="subject"]') as HTMLInputElement;
          const messageEl = formRef.current.querySelector('[name="message"]') as HTMLTextAreaElement;
          
          if (subjectEl && subject) subjectEl.value = subject;
          if (messageEl && message) messageEl.value = message;
        }
      }, 200);
    }
  }, [location.search]);

  // global drag overlay activation
  useEffect(() => {
    const hasFiles = (e: DragEvent) => !!e.dataTransfer && Array.from(e.dataTransfer.types).includes('Files');

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

    const onDrop = (e: DragEvent) => {
      if (hasFiles(e)) {
        const file = e.dataTransfer?.files?.[0] ?? null;
        if (file) onSelectFile(file);
        setIsPageDragActive(false);
        dragCounter.current = 0;
        e.preventDefault();
      }
    };

    window.addEventListener('dragenter', onDragEnter);
    window.addEventListener('dragover', onDragOver);
    window.addEventListener('dragleave', onDragLeave);
    window.addEventListener('drop', onDrop);
    window.addEventListener('dragend', onDrop);

    return () => {
      window.removeEventListener('dragenter', onDragEnter);
      window.removeEventListener('dragover', onDragOver);
      window.removeEventListener('dragleave', onDragLeave);
      window.removeEventListener('drop', onDrop);
      window.removeEventListener('dragend', onDrop);
    };
  }, []);

  const clearForm = () => {
    setFormValues({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    onSelectFile(null);
    setUploadedUrl(null);
    
    if (formRef.current) {
      formRef.current.reset();
    }
    
    if (window.location.search) {
      navigate('/contact', { replace: true });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting || isUploading) return;
    // validate before any async work
    const newErrors: Partial<Record<'name' | 'email' | 'subject' | 'message', string>> = {};
    const trim = (v: string) => v.trim();
    const isEmail = (v: string) => /^(?:[^\s@]+)@(?:[^\s@]+)\.[^\s@]{2,}$/i.test(v);
    if (!trim(formValues.name)) newErrors.name = t.contact.validation.nameRequired;
    if (!trim(formValues.email)) newErrors.email = t.contact.validation.emailRequired;
    else if (!isEmail(formValues.email)) newErrors.email = t.contact.validation.emailInvalid;
    if (!trim(formValues.subject)) newErrors.subject = t.contact.validation.subjectRequired;
    if (!trim(formValues.message)) newErrors.message = t.contact.validation.messageRequired;
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // focus first invalid field
      if (newErrors.name) nameRef.current?.focus();
      else if (newErrors.email) emailRef.current?.focus();
      else if (newErrors.subject) subjectRef.current?.focus();
      else if (newErrors.message) messageRef.current?.focus();
      return;
    }
    
    // reCAPTCHA validation disabled for now
    // const recaptchaResponse = (window as any).grecaptcha?.getResponse();
    // if (!recaptchaResponse) {
    //   toast.error(t.contact.recaptchaError);
    //   return;
    // }
    
    setIsSubmitting(true);
    
    const form = e.currentTarget;
    const formData = new FormData(form);

    // if a file is selected, upload to Cloudinary first, then include URL only
    try {
      if (selectedFile) {
        // validate before uploading
        const v = validateFile(selectedFile);
        if ("code" in v) {
          const message = v.code === "too_large"
            ? t.contact.fileTooLarge.replace("{max}", formatBytes(MAX_FILE_BYTES))
            : t.contact.unsupportedFileType;
          toast.error(message);
          setIsSubmitting(false);
          return;
        }

        setIsUploading(true);
        setUploadProgress(0);
        const url = await uploadToCloudinary(selectedFile, (p) => setUploadProgress(p));
        setUploadedUrl(url);
        formData.append('fileUrl', url);
        // ensure we don't send the original file to Formspree
        formData.delete('attachment');
      }

      const response = await fetch('https://formspree.io/f/xeqydavz', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        toast.success(t.contact.successMessage);
        clearForm();
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Form submission failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error("Something went wrong. Please try again."); // not translating--only fallback
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  // upload helper using XHR for progress
  function uploadToCloudinary(file: File, onProgress?: (progress: number) => void): Promise<string> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', 'unsigned_upload');

      xhr.open('POST', 'https://api.cloudinary.com/v1_1/dfgoxrimk/upload');

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const json = JSON.parse(xhr.responseText);
            resolve(json.secure_url as string);
          } catch (err) {
            reject(err);
          }
        } else {
          reject(new Error(`Cloudinary upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error('Network error during Cloudinary upload'));

      xhr.send(data);
    });
  }

  const onSelectFile = (file: File | null) => {
    if (file) {
      const v = validateFile(file);
      if ("code" in v) {
        const message = v.code === "too_large"
          ? t.contact.fileTooLarge.replace("{max}", formatBytes(MAX_FILE_BYTES))
          : t.contact.unsupportedFileType;
        toast.error(message);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setSelectedFile(null);
        setUploadedUrl(null);
        setUploadProgress(null);
        return;
      }
    }
    setSelectedFile(file);
    setUploadedUrl(null);
    setUploadProgress(null);
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
    <div className="flex flex-col w-full">
      <Helmet>
        <title>{t.seo.contact.title}</title>
        <meta name="description" content={t.seo.contact.description} />
        {/** reCAPTCHA removed for now
        <script src="https://www.google.com/recaptcha/api.js" async defer></script>
        */}
      </Helmet>

      <ScrollReveal variant="pageTitle">
        <h1 className="text-4xl font-bold mb-8 sm:mb-12">
          {t.contact.title}
        </h1>
      </ScrollReveal>
      
      <ScrollReveal variant="default">
        <p className="text-foreground/60 mb-8 sm:mb-12 max-w-2xl">
          {t.contact.description}
        </p>
      </ScrollReveal>
      
      <ScrollReveal variant="default">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
          className="space-y-6 sm:space-y-8 max-w-2xl"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  {t.contact.nameLabel}
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  appearance="glass"
                  radius="lg"
                  inputSize="lg"
                  placeholder={t.contact.namePlaceholder}
                  value={formValues.name}
                  onChange={(e) => {
                    setFormValues(prev => ({ ...prev, name: e.target.value }));
                    if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                  }}
                  onBlur={() => {
                    const v = formValues.name.trim();
                    setErrors(prev => ({ ...prev, name: v ? undefined : t.contact.validation.nameRequired }));
                  }}
                  ref={nameRef}
                  invalid={!!errors.name}
                />
                <AnimatePresence initial={false} mode="wait">
                  {errors.name && (
                    <motion.p
                      key="name-error"
                      className="text-sm text-destructive/90 mt-1"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      role="alert"
                      aria-live="polite"
                    >
                      {errors.name}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  {t.contact.emailLabel}
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  appearance="glass"
                  radius="lg"
                  inputSize="lg"
                  placeholder={t.contact.emailPlaceholder}
                  value={formValues.email}
                  onChange={(e) => {
                    setFormValues(prev => ({ ...prev, email: e.target.value }));
                    if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                  }}
                  onBlur={() => {
                    const v = formValues.email.trim();
                    const ok = /^(?:[^\s@]+)@(?:[^\s@]+)\.[^\s@]{2,}$/i.test(v);
                    setErrors(prev => ({ ...prev, email: v ? (ok ? undefined : t.contact.validation.emailInvalid) : t.contact.validation.emailRequired }));
                  }}
                  ref={emailRef}
                  invalid={!!errors.email}
                />
                <AnimatePresence initial={false} mode="wait">
                  {errors.email && (
                    <motion.p
                      key="email-error"
                      className="text-sm text-destructive/90 mt-1"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      role="alert"
                      aria-live="polite"
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                {t.contact.subjectLabel}
              </label>
              <Input
                id="subject"
                name="subject"
                type="text"
                required
                appearance="glass"
                radius="lg"
                inputSize="lg"
                placeholder={t.contact.subjectPlaceholder}
                value={formValues.subject}
                onChange={(e) => {
                  setFormValues(prev => ({ ...prev, subject: e.target.value }));
                  if (errors.subject) setErrors(prev => ({ ...prev, subject: undefined }));
                }}
                onBlur={() => {
                  const v = formValues.subject.trim();
                  setErrors(prev => ({ ...prev, subject: v ? undefined : t.contact.validation.subjectRequired }));
                }}
                ref={subjectRef}
                invalid={!!errors.subject}
              />
              <AnimatePresence initial={false} mode="wait">
                {errors.subject && (
                  <motion.p
                    key="subject-error"
                    className="text-sm text-destructive/90 mt-1"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    role="alert"
                    aria-live="polite"
                  >
                    {errors.subject}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                {t.contact.messageLabel}
              </label>
              <Textarea
                id="message"
                name="message"
                required
                placeholder={t.contact.messagePlaceholder}
                appearance="glass"
                radius="lg"
                minHeight="md"
                resizable={true}
                value={formValues.message}
                onChange={(e) => {
                  setFormValues(prev => ({ ...prev, message: e.target.value }));
                  if (errors.message) setErrors(prev => ({ ...prev, message: undefined }));
                }}
                onBlur={() => {
                  const v = formValues.message.trim();
                  setErrors(prev => ({ ...prev, message: v ? undefined : t.contact.validation.messageRequired }));
                }}
                ref={messageRef}
                invalid={!!errors.message}
              />
              <AnimatePresence initial={false} mode="wait">
                {errors.message && (
                  <motion.p
                    key="message-error"
                    className="text-sm text-destructive/90 mt-1"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    role="alert"
                    aria-live="polite"
                  >
                    {errors.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* attachment */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                {t.contact.attachmentLabel}
                <span className="text-xs text-foreground/50">{t.contact.attachmentHint}</span>
              </label>
              <div
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={(e) => { onDrop(e); setIsPageDragActive(false); dragCounter.current = 0; }}
                onClick={onClickDropzone}
                className={`group relative flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed transition-colors cursor-pointer p-4 sm:p-6 ${isPageDragActive ? 'border-foreground/40 bg-foreground/10 ring-2 ring-foreground/20' : 'border-foreground/20 bg-foreground/5 hover:bg-foreground/10'}`}
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
                  <UploadCloud className="w-4 h-4" />
                  <span className="text-sm">
                    {selectedFile ? `${selectedFile.name}${selectedFile.size ? ` • ${formatBytes(selectedFile.size)}` : ''}` : t.contact.attachmentPlaceholder}
                  </span>
                </div>
                {(isUploading || uploadProgress !== null) && (
                  <div className="w-full mt-2">
                    <div className="h-1.5 w-full rounded-full bg-foreground/10 overflow-hidden">
                      <div
                        className="h-full bg-foreground transition-all"
                        style={{ width: `${uploadProgress ?? 0}%` }}
                      />
                    </div>
                    <div className="mt-1 text-xs text-foreground/60 text-center">
                      {uploadProgress ?? 0}%
                    </div>
                  </div>
                )}
                {uploadedUrl && !isUploading && (
                  <div className="mt-2 text-xs text-foreground/60">
                    {t.contact.uploadedLabel}: <a className="underline" href={uploadedUrl} target="_blank" rel="noreferrer">{t.contact.cloudinaryLinkLabel}</a>
                  </div>
                )}
                {selectedFile && !isUploading && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onSelectFile(null); }}
                    className="absolute top-2 right-2 rounded-full p-1 text-foreground/60 hover:text-foreground hover:bg-foreground/10"
                    aria-label="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            
            {/** reCAPTCHA removed for now
            <div className="flex justify-start">
              <div 
                className="g-recaptcha" 
                data-sitekey="6Lc2gGorAAAAAFIQ_9x58ZfCKpvUlx7jR5Qj5kqG"
              ></div>
            </div>
            */}
            
            <IconButton
              type="submit"
              disabled={isSubmitting || isUploading}
              iconPosition="left"
              icon={
                isSubmitting ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
                ) : (
                  <Send className="w-4 h-4" />
                )
              }
              variant="default"
              className="group border-foreground/20"
            >
              <span className="flex items-center gap-2">
                {isSubmitting || isUploading ? t.contact.sending : t.contact.send}
              </span>
            </IconButton>
        </form>
      </ScrollReveal>
      {createPortal(
        <AnimatePresence>
          {isPageDragActive && (
            <motion.div
              className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center"
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
                initial={{ scale: 0.96, opacity: 0, filter: 'blur(6px)' }}
                animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                exit={{ scale: 0.98, opacity: 0, filter: 'blur(6px)' }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <div className="relative rounded-2xl border border-dashed border-foreground/30 bg-background/70 px-4 py-3 sm:px-6 sm:py-4 shadow-xl ring-1 ring-foreground/10">
                  <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-foreground/10 to-transparent blur-xl" />
                  <div className="relative flex items-center gap-2 text-foreground/80">
                    <UploadCloud className="w-5 h-5 sm:w-6 sm:h-6" />
                    <div className="h-2 w-2 rounded-full bg-foreground/50 animate-pulse" />
                    <span className="text-sm sm:text-base">{t.contact.dropOverlay}</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default Contact;

