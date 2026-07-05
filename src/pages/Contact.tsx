/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useState, useRef } from "react";
import { Check, Github, Linkedin, Mail, Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useLanguage } from "@/lib/language-provider";
import { translations, type Translation } from "@/lib/translations";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router";
import { IconButton } from "@/components/ui/custom/icon-button";
import ScrollReveal from "@/components/ScrollReveal";
import { SOCIAL_LINKS } from "@/config/social";
import { EASE_OUT } from "@/utils/transitions";

type FieldName = "name" | "email" | "subject" | "message";
const FIELD_ORDER: FieldName[] = ["name", "email", "subject", "message"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

const DIRECT_LINKS = [
  { ...SOCIAL_LINKS.email, Icon: Mail },
  { ...SOCIAL_LINKS.github, Icon: Github },
  { ...SOCIAL_LINKS.linkedin, Icon: Linkedin },
] as const;

const FieldError = ({ name, error }: { name: string; error?: string }) => (
  <div className="min-h-6">
    <AnimatePresence initial={false}>
      {error && (
        <motion.p
          key={`${name}-error`}
          initial={{ opacity: 0, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -2 }}
          transition={{ duration: 0.15, ease: EASE_OUT }}
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
  // prefill lands with the navigation (services deep-links); Contact remounts
  // on every route change, so reading the query string once at mount is enough
  const [formValues, setFormValues] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      name: "",
      email: "",
      subject: params.get("subject") ?? "",
      message: params.get("message") ?? "",
    };
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

  const clearForm = () => {
    setFormValues({ name: "", email: "", subject: "", message: "" });
    if (location.search) {
      navigate("/contact", { replace: true });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

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
    }
  };

  return (
    <div className="flex w-full flex-1 flex-col justify-center">
      <meta name="description" content={t.seo.contact.description} />

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
            transition={{ duration: 0.4, delay: 0.1, ease: EASE_OUT }}
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
                    transition={{
                      duration: 0.3,
                      delay: 0.1 + 0.08 * i,
                      ease: EASE_OUT,
                    }}
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
          transition={{ duration: 0.4, delay: 0.15, ease: EASE_OUT }}
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

              <IconButton
                type="submit"
                disabled={isSubmitting}
                iconPosition="left"
                icon={isSubmitting ? <Spinner /> : <Send className="h-4 w-4" />}
                variant="default"
                size="lg"
                className="mt-1 w-full"
                label={isSubmitting ? t.contact.sending : t.contact.send}
              />
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
