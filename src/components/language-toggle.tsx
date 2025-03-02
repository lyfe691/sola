import { Check, Languages } from "lucide-react"
import { useLanguage } from "../lib/language-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Button } from "./ui/button"

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="w-9 h-9"
        >
          <Languages className="h-4 w-4" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background"> {/* bg-background makes it not be transparent */}
        <DropdownMenuItem onClick={() => setLanguage("en")} className="flex justify-between">
          English
          {language === "en" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("de")} className="flex justify-between">
          Deutsch
          {language === "de" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setLanguage("es")} className="flex justify-between">
          Español
          {language === "es" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("ja")} className="flex justify-between">
          日本語
          {language === "ja" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("cn")} className="flex justify-between">
          中文
          {language === "cn" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 