import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import useTripPlanner from "./Hooks/useTripPlanner.js";
import LoadingScreen from "../../../Components/LoadingScreen/LoadingScreen.jsx";
import { TripPlannerContext } from "./Contexts/TripPlannerContext.js";
import { Box, useTheme } from "@mui/material";
import SidebarNav from "./Components/SidebarNav.jsx";
import TripContentSections from "./Components/TripContentSections.jsx";
import useScrollSpy from "./Hooks/useScrollSpy.js";

export default function TripPlanner() {
    const { tripId } = useParams();
    const planner = useTripPlanner(tripId);
    const theme = useTheme();

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
        enabled: !!planner.trip && !planner.loading,
    });

    if (planner.loading || !planner.trip) return <LoadingScreen />;

    return (
        <TripPlannerContext.Provider value={planner}>
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
                <TripContentSections
                    trip={planner.trip}
                    containerRef={containerRef}
                    sectionRefs={sectionRefs}
                    theme={theme}
                    tripId={tripId}
                />
            </Box>
        </TripPlannerContext.Provider>
    );
}
