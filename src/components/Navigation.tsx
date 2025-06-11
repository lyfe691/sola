/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 * 
 * This file is part of the project and is subject to the terms of the project's LICENSE (GNU GPL v3).
 * Please refer to the LICENSE file in the project root for full licensing details.
 * 
 * All rights reserved.
 */

import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useEffect, useState, useCallback, memo, forwardRef } from "react";
import { useLanguage } from "../lib/language-provider";
import { translations } from "../lib/translations";

// define types for the navitem component
interface NavItemProps {
  item: {
    text: string;
    path: string;
    icon?: React.ElementType;
  };
  index: number;
  isActive: (path: string) => boolean;
  isMobile?: boolean;
  onClick?: () => void;
}

// app version from package
import pkg from "../../package.json" assert { type: "json" };
const APP_VERSION: string = (pkg as { version: string }).version;

// memoized navigation item for better performance
const NavItem = memo(forwardRef<HTMLAnchorElement, NavItemProps>(({ 
  item, 
  index, 
  isActive, 
  isMobile = false, 
  onClick = () => {} 
}, ref) => {
  const itemVariants = isMobile 
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { 
          opacity: 1, 
          y: 0, 
          transition: { delay: index * 0.05, duration: 0.3, ease: "easeOut" }
        }
      }
    : {
        hidden: { opacity: 0, y: -10 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            delay: index * 0.05,
            duration: 0.3,
            ease: "easeOut"
          }
        }
      };

  const Component = motion.div;
  const activeClass = isActive(item.path) 
    ? 'text-foreground font-medium'
    : 'text-foreground/60 hover:text-foreground';

  if (isMobile) {
    const isItemActive = isActive(item.path);
    
    return (
      <Component
        layout
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
            relative flex items-center w-full p-2
            transition-colors duration-300 rounded-md
            text-2xl font-medium tracking-tight
            ${isItemActive 
              ? 'text-primary' 
              : 'text-foreground/60 hover:text-foreground'}
          `}
        >
          {item.icon && <item.icon className="w-6 h-6 mr-3" />}
          {item.text}
        </Link>
      </Component>
    );
  }

  return (
    <Component
      layout
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
        className={`relative px-6 py-3 text-base font-medium rounded-full transition-colors duration-300 z-10 flex items-center gap-2 ${activeClass}`}
      >
        {isActive(item.path) && (
          <motion.div
            layoutId="nav-active"
            className="absolute inset-0 rounded-full bg-foreground/10"
            initial={false}
            transition={{ type: 'spring', stiffness: 400, damping: 35, mass: 0.8 }}
          />
        )}
        {item.icon && <item.icon className="w-4 h-4" />}
        <span className="relative z-10">{item.text}</span>
      </Link>
    </Component>
  );
}));

// ensure display name is set for devtools
NavItem.displayName = "navitem";

// mobile menu button with animated hamburger
const MobileMenuButton = ({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) => {
  return (
    <motion.button
      onClick={onClick}
      className="p-3 rounded-full bg-background/80 backdrop-blur-sm border border-border/20
                hover:bg-foreground/5 transition-colors duration-300 shadow-sm z-[51]"
      whileTap={{ scale: 0.92 }}
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      <div className="w-5 h-4 relative flex flex-col items-center justify-center">
        <div className="relative w-[18px] h-[10px] flex flex-col justify-between">
          {/* Top bar */}
          <motion.span
            className="h-[1.4px] bg-current rounded-full w-full absolute top-0"
            initial={false}
            animate={{ 
              rotate: isOpen ? 45 : 0,
              y: isOpen ? 0 : -3,
              top: "50%",
              marginTop: "-0.7px"
            }}
            style={{ transformOrigin: "center" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          />
          
          {/* Bottom bar */}
          <motion.span
            className="h-[1.4px] bg-current rounded-full w-full absolute bottom-0"
            initial={false}
            animate={{ 
              rotate: isOpen ? -45 : 0,
              y: isOpen ? 0 : 3,
              bottom: "50%",
              marginBottom: "-0.7px"
            }}
            style={{ transformOrigin: "center" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.button>
  );
};

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];
  const location = useLocation();

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);

  // memoized navigation items
  const homeItem = { text: "Home", path: "/", icon: Home };
  const navItems = [
    { text: t.nav.about, path: "/about" },
    { text: t.nav.experience, path: "/experience" },
    { text: t.nav.projects, path: "/projects" },
    { text: t.nav.skills, path: "/skills" },
    { text: t.nav.services, path: "/services" },
    { text: t.nav.contact, path: "/contact" }
  ];

  // memoized isactive check
  const isActive = useCallback((path: string) => {
    return location.pathname === path;
  }, [location.pathname]);


  // effect to handle clicks outside the menu
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

  // prevent body scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      // prevent scrolling on body when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      // restore scrolling
      document.body.style.overflow = '';
    }
    
    return () => {
      // cleanup in case component unmounts while menu is open
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // close menu when route changes
  useEffect(() => {
    closeMenu();
  }, [location.pathname, closeMenu]);


  // mobile menu animations
  const mobileMenuVariants = {
    hidden: { 
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeIn",
        when: "afterChildren"
      }
    },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        when: "beforeChildren",
      }
    },
  };

  const mobileNavContainer = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      }
    }
  }

  return (
    <header className="w-full mb-4 sm:mb-6 md:mb-8 lg:mb-12 sticky top-4 z-40 px-4">
      
      {/* desktop navigation */}
      <div className="flex justify-center items-center">
        <motion.div
          className="hidden md:flex items-center justify-center mx-auto gap-x-1 bg-background/60 backdrop-blur-2xl py-4 px-4 rounded-full border-2 border-border/20 shadow-lg shadow-black/5"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          style={{
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          }}
        >
          {/* home navigation - simple layout*/}
          <LayoutGroup id="home-nav">
            <NavItem
              item={homeItem}
              index={0}
              isActive={isActive}
            />  
          </LayoutGroup>
          
          <div className="h-8 w-px bg-border/30 mx-3" />
          
          {/* main navigation - main layout */}
          <LayoutGroup id="main-nav">
            {navItems.map((item, i) => (
              <NavItem
                key={item.path}
                item={item}
                index={i}
                isActive={isActive}
              />
            ))}
          </LayoutGroup>
        </motion.div>
      </div>

      {/* mobile menu button */}
      <div className="md:hidden fixed top-5 left-5 z-[51] menu-button">
        <MobileMenuButton isOpen={isMenuOpen} onClick={toggleMenu} />
      </div>

      {/* mobile navigation menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileMenuVariants}
            className="fixed inset-0 bg-background/80 backdrop-blur-xl z-50 md:hidden mobile-menu"
          >
            <motion.nav 
              variants={mobileNavContainer}
              initial="hidden"
              animate="visible"
              className="flex flex-col h-full max-w-sm mx-auto px-8 pt-24 pb-12 relative z-10"
            >
              <div className="flex-grow">
                <NavItem
                  item={homeItem}
                  index={0}
                  isActive={isActive}
                  isMobile={true}
                  onClick={closeMenu}
                />
                <div className="my-4 h-px w-full bg-border" />
                <div className="space-y-2">
                  {navItems.map((item, i) => (
                    <NavItem
                      key={item.path}
                      item={item}
                      index={i + 1}
                      isActive={isActive}
                      isMobile={true}
                      onClick={closeMenu}
                    />
                  ))}
                </div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navigation; 
