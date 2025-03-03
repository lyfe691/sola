/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 * 
 * This file is part of the project and is subject to the terms of the project's LICENSE (GNU GPL v3).
 * Please refer to the LICENSE file in the project root for full licensing details.
 * 
 * All rights reserved.
 */

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
      <h1 className="text-4xl sm:text-5xl font-bold mb-4 sm:mb-6">404</h1>
      <p className="mt-2 sm:mt-4 text-base sm:text-lg text-gray-700 dark:text-gray-300 text-center max-w-md">
          Oops! The page you're looking for can't be found.
      </p>
      <Button asChild variant="outline" className="group border-foreground/20 mt-6 sm:mt-8">
        <a href="/">Go back home</a>
      </Button>
    </div>
    );
};

export default NotFound;

