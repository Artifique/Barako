"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";

export function InteractiveButton({ href, primaryOrange }: { href: string, primaryOrange: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={href}>
      <Button
        variant="outline"
        className="w-full transition-colors duration-200"
        style={{
          borderColor: primaryOrange,
          color: isHovered ? 'white' : primaryOrange,
          backgroundColor: isHovered ? primaryOrange : 'transparent'
        }}
        onMouseOver={() => setIsHovered(true)}
        onMouseOut={() => setIsHovered(false)}
      >
        Voir détails
      </Button>
    </Link>
  );
}