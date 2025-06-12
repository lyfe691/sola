/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary project and is governed by the terms in LICENSE.
 * Unauthorized use, modification, or distribution is prohibited. All rights reserved.
 * For permissions, contact yanis.sebastian.zuercher@gmail.com
 */

import { Search } from "lucide-react"
import { Button } from "./ui/button"
import { useCommandMenu } from "../hooks/use-command-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

export function SearchToggle() {
  const { toggleCommandMenu } = useCommandMenu()
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className="w-9 h-9 transition-colors hover:bg-muted"
            onClick={toggleCommandMenu}
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Search (Ctrl+K)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
} 