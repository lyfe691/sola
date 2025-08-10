/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useState, useRef, useEffect } from "react";
import { Send, Info } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { IconButton } from "@/components/ui/custom/IconButton";
import ScrollReveal from "@/components/ScrollReveal";

const Contact = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
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

  const clearForm = () => {
    setFormValues({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    
    if (formRef.current) {
      formRef.current.reset();
    }
    
    if (window.location.search) {
      navigate('/contact', { replace: true });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    const recaptchaResponse = (window as any).grecaptcha?.getResponse();
    if (!recaptchaResponse) {
      toast.error(t.contact.recaptchaError);
      return;
    }
    
    setIsSubmitting(true);
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
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
    }
  };

  return (
    <div className="flex flex-col w-full">
      <Helmet>
        <title>Contact • Yanis Sebastian Zürcher</title>
        <script src="https://www.google.com/recaptcha/api.js" async defer></script>
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
                  onChange={(e) => setFormValues(prev => ({ ...prev, name: e.target.value }))}
                />
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
                  onChange={(e) => setFormValues(prev => ({ ...prev, email: e.target.value }))}
                />
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
                onChange={(e) => setFormValues(prev => ({ ...prev, subject: e.target.value }))}
              />
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
                onChange={(e) => setFormValues(prev => ({ ...prev, message: e.target.value }))}
              />
            </div>
            
            {/* reCAPTCHA */}
            <div className="flex justify-start">
              <div 
                className="g-recaptcha" 
                data-sitekey="6Lc2gGorAAAAAFIQ_9x58ZfCKpvUlx7jR5Qj5kqG"
              ></div>
            </div>
            
            <IconButton
              type="submit"
              disabled={isSubmitting}
              iconPosition="left"
              icon={
                isSubmitting ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
                ) : (
                  <Send className="w-4 h-4" />
                )
              }
              variant="outline"
              className="group border-foreground/20"
            >
              <span className="flex items-center gap-2">
                {isSubmitting ? t.contact.sending : t.contact.send}
              </span>
            </IconButton>

            {/* Credit Formspree */}
              <div className="flex items-center justify-start gap-2 text-xs text-muted-foreground/60 mt-2">
                <Info className="w-3 h-3" />
                <span>
                  Powered by{" "}
                  <a 
                    href="https://formspree.io" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-muted-foreground transition-colors duration-200 underline underline-offset-2"
                  >
                    Formspree
                  </a>
                </span>
              </div>
        </form>
      </ScrollReveal>
    </div>
  );
};

export default Contact;

