/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 *
 * The bar's Contact button, as shadcn's button group pairs an action with
 * its menu: the label goes to the contact page as it is, and the button
 * beside it opens the offerings, each leading to the same page with its form
 * already about that offering.
 */

import { useState } from "react";
import { useLocation } from "react-router";
import { SERVICE_ICONS } from "@/components/command-palette/icons";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FlipChevron } from "@/components/ui/custom/flip-chevron";
import { MorphArrow } from "@/components/ui/custom/morph-arrow";
import { OFFERINGS } from "@/config/services";
import { contactUrl } from "@/lib/contact-url";
import { useTranslation } from "@/lib/language-provider";
import { Link } from "@/lib/locale-router";

export function ContactMenu() {
  const t = useTranslation();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <ButtonGroup>
      <Button
        nativeButton={false}
        render={<Link to="/contact" />}
        aria-current={pathname === "/contact" ? "page" : undefined}
      >
        {t.nav.contact}
      </Button>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger
          openOnHover
          delay={0}
          render={
            <Button size="icon" aria-label={t.services.getStarted}>
              {/* x.ai's 8 and 12: in a button whose right end is round, a chevron
                  in the true middle looks pushed right */}
              <FlipChevron open={open} className="mr-1" />
            </Button>
          }
        />
        <DropdownMenuContent align="end" sideOffset={8} className="w-80">
          <DropdownMenuGroup>
            {OFFERINGS.map((offering) => {
              const { key, service } = offering;
              const ServiceIcon = SERVICE_ICONS[service];
              return (
                <DropdownMenuItem
                  key={key}
                  render={<Link to={contactUrl(t, offering)} />}
                  className="items-start gap-3 py-2.5"
                >
                  {ServiceIcon && <ServiceIcon className="mt-0.5 size-4.5" />}
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    {t.services.page.offerings[key].name}
                    {/* stays quiet under the highlight: the item would turn
                      everything in it to full ink */}
                    <span className="text-xs leading-snug font-normal text-muted-foreground!">
                      {t.services.page.offerings[key].line}
                    </span>
                  </span>
                  <span className="absolute top-3 right-3 opacity-0 transition-opacity duration-150 ease-out group-focus/dropdown-menu-item:opacity-100">
                    <MorphArrow />
                  </span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
