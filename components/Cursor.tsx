"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import "@/css/cursor.css";

export default function Cursor() {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isText, setIsText] = useState(false);
    const [isQuestion, setIsQuestion] = useState(false);
    const [textHeight, setTextHeight] = useState(20); // Default height
    const [isClicking, setIsClicking] = useState(false);

    // Faster, more responsive spring config
    const springConfig = { damping: 35, stiffness: 600, mass: 0.2 };
    const smoothX = useSpring(cursorX, springConfig);
    const smoothY = useSpring(cursorY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const handleElementInteraction = (e: MouseEvent) => {
            const target = e.target as Element;
            const parentElement = target.parentElement;

            // Check if the element or its parent is interactive
            const isInteractive = !!(
                // Direct interactive elements
                target.tagName.toLowerCase() === 'a' ||
                target.tagName.toLowerCase() === 'button' ||
                target.getAttribute('role') === 'button' ||
                target.classList.contains('hover-effect') ||
                target.classList.contains('question-hover') ||
                // Parent interactive elements
                parentElement?.tagName.toLowerCase() === 'a' ||
                parentElement?.tagName.toLowerCase() === 'button' ||
                parentElement?.getAttribute('role') === 'button' ||
                parentElement?.classList.contains('hover-effect') ||
                // Interactive containers
                target.closest('a') ||
                target.closest('button') ||
                target.closest('[role="button"]') ||
                target.closest('.hover-effect') ||
                // Check for clickable divs
                target.closest('div[onClick]') ||
                target.closest('div[onclick]')
            );

            // Check if element has text content
            const hasText = (element: Element): boolean => {
                // Skip elements that are hidden or have zero dimensions
                if (element instanceof HTMLElement) {
                    const style = window.getComputedStyle(element);
                    if (style.display === 'none' || style.visibility === 'hidden' ||
                        element.offsetWidth === 0 || element.offsetHeight === 0) {
                        return false;
                    }
                }

                // Direct text node check
                if (element.nodeType === Node.TEXT_NODE) {
                    const text = (element.textContent || '').trim();
                    return text.length > 0 && !/^[\s\r\n]*$/.test(text);
                }

                // Check immediate text content only, not nested
                const childNodes = Array.from(element.childNodes);
                const directTextContent = childNodes
                    .filter(node => node.nodeType === Node.TEXT_NODE)
                    .map(node => node.textContent || '')
                    .join('')
                    .trim();

                return directTextContent.length > 0 && !/^[\s\r\n]*$/.test(directTextContent);
            };

            // More precise text content detection
            const isTextContent = !!(
                // Check if it's a text-containing element
                ((target.nodeType === Node.TEXT_NODE) ||
                    ['p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(target.tagName.toLowerCase()) ||
                    // For div and footer, only consider them if they have immediate text content
                    ((target.tagName.toLowerCase() === 'div' || target.tagName.toLowerCase() === 'footer') &&
                        hasText(target))) &&
                // Make sure it's not inside an interactive element
                !target.closest('a') &&
                !target.closest('button') &&
                !target.closest('[role="button"]') &&
                !target.closest('.hover-effect') &&
                // Ensure the element is actually visible and has dimensions
                (!(target instanceof HTMLElement) || (
                    target.offsetWidth > 0 &&
                    target.offsetHeight > 0 &&
                    window.getComputedStyle(target).display !== 'none' &&
                    window.getComputedStyle(target).visibility !== 'hidden'
                ))
            );

            // Get text height if it's a text element
            if (isTextContent && target instanceof HTMLElement) {
                const computedStyle = window.getComputedStyle(target);
                const fontSize = parseFloat(computedStyle.fontSize);
                const lineHeight = computedStyle.lineHeight === 'normal'
                    ? fontSize * 1.2 // Default approximation
                    : parseFloat(computedStyle.lineHeight);
                setTextHeight(Math.max(fontSize, lineHeight));
            } else {
                setTextHeight(20); // Default height when not over text
            }

            // Check if element has question mark style
            const hasQuestionStyle = target.classList.contains('question-hover') ||
                target.closest('.question-hover') !== null;

            setIsHovered(isInteractive);
            setIsText(!isInteractive && isTextContent);
            setIsQuestion(hasQuestionStyle);
        };

        document.addEventListener("mousemove", handleMouseMove, { passive: true });
        document.addEventListener("mouseover", handleElementInteraction);
        document.addEventListener("mouseout", handleElementInteraction);

        // Add click handlers
        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);

        document.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseover", handleElementInteraction);
            document.removeEventListener("mouseout", handleElementInteraction);
            document.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isVisible]);

    // Completely hide cursor for mobile screens
    if (!isVisible || window.matchMedia("(pointer: coarse)").matches) return null;

    return (
        <>
            <motion.div
                className={`custom-cursor ${isText ? "text" : ""} ${isQuestion ? "question" : ""}`}
                style={{
                    left: smoothX,
                    top: smoothY,
                    ...(isText && { height: textHeight }),
                }}
                initial={{ opacity: 0 }}
                animate={{
                    opacity: 1,
                    scale: isHovered ? 1.5 : 1,
                    ...(isClicking && !isText ? {
                        scale: isHovered ? 1.2 : 0.8,
                    } : {}),
                }}
                transition={{
                    opacity: { duration: 0.1 },
                    scale: { type: "spring", damping: 25, stiffness: 400 }
                }}
            />

            <pre className="hidden">
                #V0ID
                x.com/v0id_user
            </pre>
        </>
    );
}
