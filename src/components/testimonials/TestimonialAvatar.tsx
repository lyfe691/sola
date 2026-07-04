/**
 * Copyright (c) 2026 Yanis Sebastian Zürcher
 *
 * This file is part of a proprietary software project.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * Refer to LICENSE for details or contact yanis.sebastian.zuercher@gmail.com for permissions.
 */

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { getLinkedInAvatarUrl } from "@/lib/linkedin-avatar";
import { cn } from "@/lib/utils";

const initialsOf = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

type TestimonialAvatarProps = {
  author: string;
  linkedin?: string;
  className?: string;
};

const TestimonialAvatar = ({
  author,
  linkedin,
  className,
}: TestimonialAvatarProps) => {
  const src = linkedin ? getLinkedInAvatarUrl(linkedin) : undefined;
  const [loading, setLoading] = useState(Boolean(src));

  return (
    <Avatar className={cn("relative shrink-0", className)}>
      {loading && src ? (
        <Skeleton className="absolute inset-0 rounded-full" aria-hidden />
      ) : null}
      {src ? (
        <AvatarImage
          src={src}
          alt={author}
          className={cn(
            "transition-opacity duration-200",
            loading ? "opacity-0" : "opacity-100",
          )}
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
        />
      ) : null}
      <AvatarFallback>{initialsOf(author)}</AvatarFallback>
    </Avatar>
  );
};

export default TestimonialAvatar;
