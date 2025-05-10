/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 * 
 * This file is part of the project and is subject to the terms of the project's LICENSE (GNU GPL v3).
 * Please refer to the LICENSE file in the project root for full licensing details.
 * 
 * All rights reserved.
 */

import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, ChevronRight, Circle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react"
import { useEffect, useState, useRef, useCallback, memo, forwardRef } from "react";
import { useLanguage } from "../lib/language-provider";
import { translations } from "../lib/translations";

// Define types for the NavItem component
interface NavItemProps {
  item: {
    text: string;
    path: string;
  };
  index: number;
  isActive: (path: string) => boolean;
  isMobile?: boolean;
  onClick?: () => void;
}

// app version from package
import pkg from "../../package.json" assert { type: "json" };
const APP_VERSION: string = (pkg as { version: string }).version;

// Memoized navigation item for better performance 
const NavItem = memo(forwardRef<HTMLAnchorElement, NavItemProps>(({ 
  item, 
  index, 
  isActive, 
  isMobile = false, 
  onClick = () => {} 
}, ref) => {
  const itemVariants = isMobile 
    ? {
        initial: { opacity: 0, x: -20 },
        animate: { 
          opacity: 1, 
          x: 0, 
          transition: { delay: index * 0.1 }
        }
      }
    : {
        hidden: { opacity: 0, y: -10 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            delay: index * 0.1,
            duration: 0.4,
            ease: [0.215, 0.61, 0.355, 1]
          }
        }
      };

  const Component = motion.div;
  const activeClass = isActive(item.path) 
    ? isMobile 
      ? 'bg-primary/10 text-foreground shadow-sm' 
      : 'text-foreground font-medium'
    : isMobile
      ? 'text-foreground/70 hover:text-foreground hover:bg-foreground/5 hover:border-border/20'
      : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5';

  if (isMobile) {
    const isItemActive = isActive(item.path);
    
    return (
      <Component
        key={item.text}
        custom={index}
        variants={itemVariants}
        initial="initial"
        animate="animate"
        className="w-full"
      >
        <Link 
          to={item.path} 
          onClick={onClick}
          ref={ref}
          className={`
            relative flex items-center w-full px-4 py-3.5
            transition-all duration-300 rounded-md
            ${isItemActive 
              ? 'text-primary font-medium' 
              : 'text-foreground/80 hover:text-foreground'}
          `}
        >
          {/* Background for active item */}
          {isItemActive && (
            <motion.div 
              className="absolute inset-0 bg-primary/5 rounded-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
          
          <div className={`h-5 w-[2px] mr-3 rounded-full ${isItemActive ? 'bg-primary' : 'bg-transparent'}`} />
          
          <span className="relative z-10 text-base tracking-wide">{item.text}</span>
          
          {/* Arrow indicator */}
          <motion.div 
            className="ml-auto relative z-10"
            initial={false}
            animate={{ 
              x: isItemActive ? 0 : -5,
              opacity: isItemActive ? 0.8 : 0
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        </Link>
      </Component>
    );
  }

  return (
    <Component
      key={item.text}
      custom={index}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
      <Link 
        to={item.path} 
        onClick={onClick}
        ref={ref}
        className={`
          ${isMobile 
            ? 'flex items-center justify-between group py-3 px-4 text-lg font-medium rounded-xl transition-all duration-300 border border-border/10' 
            : 'relative px-4 py-2 text-base rounded-full transition-all duration-300 z-10 hover:scale-105'} 
          ${activeClass}
        `}
      >
        <span>{item.text}</span>
        {isMobile && (
          <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
        )}
      </Link>
    </Component>
  );
}));

// Ensure display name is set for devtools
NavItem.displayName = "NavItem";

// Mobile menu button with animated hamburger
const MobileMenuButton = ({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) => {
  return (
    <motion.button
      onClick={onClick}
      className="p-3 rounded-full bg-background/80 backdrop-blur-sm border border-border/20
                hover:bg-foreground/5 transition-colors duration-300 shadow-sm z-[51]"
      whileTap={{ scale: 0.92 }}
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      <div className="w-6 h-5 relative">
        {/* Top bar */}
        <motion.span
          className="absolute h-[2px] bg-current rounded-full w-full top-0 left-0"
          initial={false}
          animate={{ 
            rotate: isOpen ? 45 : 0,
            y: isOpen ? 9 : 0
          }}
          style={{ transformOrigin: "center" }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Middle bar */}
        <motion.span
          className="absolute h-[2px] bg-current rounded-full w-full top-[9px] left-0"
          initial={false}
          animate={{ 
            opacity: isOpen ? 0 : 1,
            x: isOpen ? 8 : 0,
            scale: isOpen ? 0 : 1,
          }}
          transition={{ duration: 0.2 }}
        />
        
        {/* Bottom bar */}
        <motion.span
          className="absolute h-[2px] bg-current rounded-full w-full bottom-0 left-0"
          initial={false}
          animate={{ 
            rotate: isOpen ? -45 : 0,
            y: isOpen ? -9 : 0
          }}
          style={{ transformOrigin: "center" }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.button>
  );
};

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];
  const location = useLocation();
  const [activeItemWidth, setActiveItemWidth] = useState(0);
  const [activeItemLeft, setActiveItemLeft] = useState(0);
  const [activeIndex, setActiveIndex] = useState(-1);
  const navRef = useRef<HTMLDivElement>(null);
  const navItemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const isInitialRender = useRef(true);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);

  // Memoized navigation items
  const navItems = [
    { text: t.nav.about, path: "/about" },
    { text: t.nav.experience, path: "/experience" },
    { text: t.nav.projects, path: "/projects" },
    { text: t.nav.skills, path: "/skills" },
    { text: t.nav.services, path: "/services" },
    { text: t.nav.contact, path: "/contact" }
  ];

  // Memoized isActive check
  const isActive = useCallback((path: string) => {
    return location.pathname === path;
  }, [location.pathname]);

  const getPathFromIndex = useCallback((index: number) => {
    return navItems[index]?.path || '';
  }, [navItems]);

  // Effect to handle clicks outside the menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen) {
        const menu = document.querySelector('.mobile-menu');
        const menuButton = document.querySelector('.menu-button');
        
        if (menu && menuButton && 
            !menu.contains(event.target as Node) && 
            !menuButton.contains(event.target as Node)) {
          closeMenu();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen, closeMenu]);

  // Prevent body scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Add class to prevent scrolling
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflowY = 'scroll';
    } else {
      // Restore scrolling and scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
      
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
      }
    }
    
    return () => {
      // Cleanup in case component unmounts while menu is open
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
    };
  }, [isMenuOpen]);

  // Close menu when route changes
  useEffect(() => {
    closeMenu();
  }, [location.pathname, closeMenu]);

  // Find the active index whenever path or navItems change
  useEffect(() => {
    const newActiveIndex = navItems.findIndex(item => item.path === location.pathname);
    setActiveIndex(newActiveIndex);
  }, [location.pathname, navItems]);

  // Update the active item position for the sliding effect
  const updateActiveItemPosition = useCallback(() => {
    if (activeIndex !== -1 && navItemRefs.current[activeIndex] && navRef.current) {
      const activeItem = navItemRefs.current[activeIndex];
      const navRect = navRef.current.getBoundingClientRect();
      const activeRect = activeItem.getBoundingClientRect();
      
      if (!isInitialRender.current) {
        setActiveItemWidth(activeRect.width);
        setActiveItemLeft(activeRect.left - navRect.left);
      } else {
        // On initial render, set with no animation by directly setting values
        setActiveItemWidth(activeRect.width);
        setActiveItemLeft(activeRect.left - navRect.left);
        isInitialRender.current = false;
      }
    }
  }, [activeIndex]);

  // Use ResizeObserver for more reliable size/position measurement
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      updateActiveItemPosition();
    });
    
    if (navRef.current) {
      observer.observe(navRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, [updateActiveItemPosition]);

  useEffect(() => {
    // Delay measurement to ensure DOM is updated
    const timerId = setTimeout(() => {
      updateActiveItemPosition();
    }, 50);

    window.addEventListener('resize', updateActiveItemPosition);
    
    return () => {
      clearTimeout(timerId);
      window.removeEventListener('resize', updateActiveItemPosition);
    };
  }, [location.pathname, updateActiveItemPosition, activeIndex]);

  // Mobile menu animations
  const mobileMenuVariants = {
    hidden: { 
      opacity: 0, 
      x: "-100%",
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        when: "beforeChildren",
        staggerChildren: 0.05
      }
    },
    exit: {
      opacity: 0,
      x: "-100%",
      transition: {
        duration: 0.25,
        ease: "easeInOut"
      }
    }
  };

  return (
    <nav className="w-full mb-4 sm:mb-6 md:mb-8 lg:mb-12 sticky top-4 z-40 px-4">
      {/* Desktop Navigation */}
      <div className="flex justify-center items-center">
        <motion.div 
          ref={navRef}
          className="hidden md:flex items-center justify-center mx-auto gap-x-2 gap-y-2 bg-background/75 backdrop-blur-xl py-3.5 px-7 rounded-full border-2 border-border/40 shadow-lg relative overflow-hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
        >
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-50 pointer-events-none"></div>
          
          {/* Home Link + Separator */}
          <Link 
            to="/" 
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 mr-1 relative z-20
                      ${isActive('/') 
                        ? 'bg-primary/20 text-foreground font-medium shadow-sm' 
                        : 'text-foreground/80 hover:text-foreground hover:bg-foreground/5'}`}
          >
            <Home className="w-4 h-4" />
            <span className="font-medium">Home</span>
          </Link>
          
          <div className="h-6 w-[1.5px] bg-foreground/10 mx-1.5 relative z-10"></div>
          
          {/* Sliding indicator for active item */}
          {activeItemWidth > 0 && (
            <motion.div 
              className="absolute rounded-full bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 h-[calc(100%-18px)] top-[9px] z-0 pointer-events-none"
              initial={false}
              animate={{
                width: activeItemWidth,
                left: activeItemLeft,
              }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 30
              }}
            />
          )}

          {navItems.map((item, i) => (
            <NavItem
              key={item.path}
              item={item}
              index={i}
              isActive={isActive}
              ref={el => navItemRefs.current[i] = el}
            />
          ))}
        </motion.div>
      </div>

      {/* Mobile Menu Button - Positioned further from content */}
      <div className="md:hidden fixed top-6 left-6 z-[51] menu-button">
        <MobileMenuButton isOpen={isMenuOpen} onClick={toggleMenu} />
      </div>

      {/* Spacer for mobile view to prevent content from being too close to the menu button */}
      <div className="md:hidden h-14"></div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuVariants}
            className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 md:hidden mobile-menu overflow-hidden"
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-30 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ duration: 0.5 }}
            />

            <div className="flex flex-col h-full max-w-sm mx-auto px-6 py-20 relative z-10">
              {/* Current route indicator */}
              <motion.div 
                className="mb-8 border-b border-border/10 pb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <div className="text-xs uppercase tracking-wider text-primary/70 font-medium mb-1">Current</div>
                <div className="text-xl font-medium">{location.pathname === "/" ? "Home" : navItems.find(item => item.path === location.pathname)?.text || ""}</div>
              </motion.div>
              
              {/* Navigation Links */}
              <div className="mt-4">
                <Link 
                  to="/" 
                  onClick={closeMenu}
                  className={`
                    relative flex items-center w-full px-4 py-3.5
                    transition-all duration-300 rounded-md mb-2
                    ${isActive('/') 
                      ? 'text-primary font-medium' 
                      : 'text-foreground/80 hover:text-foreground'}
                  `}
                >
                  {/* Background for active state */}
                  {isActive('/') && (
                    <motion.div 
                      className="absolute inset-0 bg-primary/5 rounded-md"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                  
                  <div className={`h-5 w-[2px] mr-3 rounded-full ${isActive('/') ? 'bg-primary' : 'bg-transparent'}`} />
                  
                  <div className="flex items-center gap-3">
                    <Home className="w-4 h-4" />
                    <span className="text-base tracking-wide relative z-10">Home</span>
                  </div>
                  
                  {/* Arrow indicator */}
                  <motion.div 
                    className="ml-auto"
                    animate={{ 
                      x: isActive('/') ? 0 : -5,
                      opacity: isActive('/') ? 0.8 : 0
                    }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </motion.div>
                </Link>
                
                {navItems.map((item, i) => (
                  <NavItem
                    key={item.path}
                    item={item}
                    index={i}
                    isActive={isActive}
                    isMobile={true}
                    onClick={closeMenu}
                  />
                ))}
              </div>
              
              {/* App version */}
              <motion.div 
                className="mt-auto pt-8 border-t border-border/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-foreground/50">Version</span>
                  <span className="text-xs font-medium text-foreground/40">{APP_VERSION}</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation; 
