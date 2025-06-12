/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 * 
 * This file is part of a proprietary project and is governed by the terms in LICENSE.
 * Unauthorized use, modification, or distribution is prohibited. All rights reserved.
 * For permissions, contact yanis.sebastian.zuercher@gmail.com
 */

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../lib/language-provider";
import { translations } from "../lib/translations";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import { containerVariants, itemVariants, titleVariants, usePageInit } from "@/utils/transitions";
import { Helmet } from "react-helmet-async";

const Contact = () => {
  const isLoaded = usePageInit(100);
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
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isLoaded && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col w-full"
        >

          <Helmet>
            <title>Contact • Yanis Sebastian Zürcher</title>
          </Helmet>

          <motion.h1 variants={titleVariants} className="text-4xl font-bold mb-8 sm:mb-12">
            {t.contact.title}
          </motion.h1>
          <motion.p variants={itemVariants} className="text-foreground/60 mb-8 sm:mb-12 max-w-2xl">
            {t.contact.description}
          </motion.p>
          <motion.form
            ref={formRef}
            onSubmit={handleSubmit}
            variants={itemVariants}
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
                  placeholder={t.contact.emailPlaceholder}
                  value={formValues.email}
                  onChange={(e) => setFormValues(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject
              </label>
              <Input
                id="subject"
                name="subject"
                type="text"
                required
                placeholder="Enter your subject"
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
                className="min-h-48"
                value={formValues.message}
                onChange={(e) => setFormValues(prev => ({ ...prev, message: e.target.value }))}
              />
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="outline"
              className="group border-foreground/20"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
                  {t.contact.sending}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  {t.contact.send}
                </span>
              )}
            </Button>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Contact;

