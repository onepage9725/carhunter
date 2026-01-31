"use client";

import Link, { LinkProps } from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "@/context/TransitionContext";
import React from "react";

interface TransitionLinkProps extends LinkProps {
    children: React.ReactNode;
    className?: string;
    href: string;
}

export default function TransitionLink({ children, href, ...props }: TransitionLinkProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { startTransition } = useTransition();

    const handleTransition = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();

        if (pathname === href) {
            return;
        }

        // Start animation
        await startTransition();

        // Navigate
        router.push(href);
    };

    return (
        <Link {...props} href={href} onClick={handleTransition}>
            {children}
        </Link>
    );
}
