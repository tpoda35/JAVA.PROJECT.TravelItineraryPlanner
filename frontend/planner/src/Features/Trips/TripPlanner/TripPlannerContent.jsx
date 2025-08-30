import {Box, useTheme} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import useScrollSpy from "./Hooks/useScrollSpy.js";
import LoadingScreen from "../../../Components/LoadingScreen/LoadingScreen.jsx";
import SidebarNav from "./Components/SidebarNav.jsx";
import TripPlannerContentSections from "./Components/TripPlannerContentSections.jsx";
import {useTripDataProvider} from "./Contexts/TripDataContext.jsx";

export default function TripPlannerContent() {
    const theme = useTheme();
    const {
        trip,
        loading
    } = useTripDataProvider();

    const [activeSection, setActiveSection] = useState("notes");
    const isScrollingProgrammatically = useRef(false);
    const debounceTimer = useRef(null);
    const containerRef = useRef(null);

    const sectionRefs = {
        notes: useRef(null),
        tripDays: useRef(null),
        budget: useRef(null),
    };
    const buttonRefs = {
        notes: useRef(null),
        tripDays: useRef(null),
        budget: useRef(null),
    };

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    const scrollToSection = (ref) => {
        if (containerRef.current && ref?.current) {
            const navbarOffset = 65;
            const scrollY = ref.current.offsetTop - navbarOffset;
            containerRef.current.scrollTo({ top: scrollY, behavior: "smooth" });
        }
    };

    const handleScrollClick = (key) => {
        isScrollingProgrammatically.current = true;
        setActiveSection(key);
        scrollToSection(sectionRefs[key]);
        setTimeout(() => {
            isScrollingProgrammatically.current = false;
        }, 1000);
    };

    useScrollSpy({
        containerRef,
        sectionRefs,
        buttonRefs,
        setActiveSection,
        isScrollingProgrammatically,
        debounceTimer,
        activeSection,
        enabled: !!trip && !loading,
    });

    if (loading || !trip) return <LoadingScreen transparent />;

    return (
        <Box sx={{ display: "flex", bgcolor: theme.palette.background.default }}>
            <SidebarNav
                sections={[
                    { key: "notes", label: "Notes" },
                    { key: "tripDays", label: "Days" },
                    { key: "budget", label: "Budget" },
                ]}
                activeSection={activeSection}
                onClick={handleScrollClick}
                buttonRefs={buttonRefs}
                theme={theme}
            />
            <TripPlannerContentSections
                trip={trip}
                containerRef={containerRef}
                sectionRefs={sectionRefs}
                theme={theme}
            />
        </Box>
    )
}