/**
 * Copyright (c) 2025 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { Search } from "lucide-react"
import { Button } from "./ui/button"
import { useCommandMenu } from "@/hooks/use-command-menu"
import { Tooltip, TooltipContent,TooltipTrigger } from "@/components/ui/tooltip"

export function SearchToggle() {
  const { toggleCommandMenu } = useCommandMenu()
  
  return (
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
          <span>Search</span>
          <span className="ml-2 text-xs text-muted-foreground">⌘K</span>
        </TooltipContent>
      </Tooltip>
  )
} 