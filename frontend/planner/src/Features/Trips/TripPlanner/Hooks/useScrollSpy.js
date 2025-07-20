import { useEffect } from "react";

export default function useScrollSpy({
                                         containerRef,
                                         sectionRefs,
                                         buttonRefs,
                                         setActiveSection,
                                         isScrollingProgrammatically,
                                         debounceTimer,
                                         activeSection,
                                         enabled = true
                                     }) {
    useEffect(() => {
        const container = containerRef.current;
        if (!container || !enabled) return;

        const handleScroll = () => {
            if (isScrollingProgrammatically.current) return;

            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }

            debounceTimer.current = setTimeout(() => {
                const scrollTop = container.scrollTop;
                const containerHeight = container.clientHeight;
                const scrollHeight = container.scrollHeight;
                const triggerPoint = scrollTop + 150;

                let newActiveSection = "notes";

                if (scrollTop + containerHeight >= scrollHeight - 50) {
                    newActiveSection = "budget";
                } else {
                    const sectionOrder = ["notes", "tripDays", "budget"];
                    for (const key of sectionOrder) {
                        const ref = sectionRefs[key];
                        if (ref.current && triggerPoint >= ref.current.offsetTop) {
                            newActiveSection = key;
                        }
                    }
                }

                if (newActiveSection !== activeSection) {
                    setActiveSection(newActiveSection);
                    if (buttonRefs[newActiveSection]?.current) {
                        buttonRefs[newActiveSection].current.focus();
                    }
                }
            }, 50);
        };

        container.addEventListener("scroll", handleScroll);
        return () => {
            container.removeEventListener("scroll", handleScroll);
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [enabled, activeSection]);
}
