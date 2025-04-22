/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 * 
 * This file is part of the project and is subject to the terms of the project's LICENSE (GNU GPL v3).
 * Please refer to the LICENSE file in the project root for full licensing details.
 * 
 * All rights reserved.
 */

import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../lib/language-provider";
import { translations } from "../lib/translations";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Contact = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.215, 0.61, 0.355, 1] } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.215, 0.61, 0.355, 1] } },
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

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
        form.reset();
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
                />
              </div>
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
                className="min-h-44"
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

