import { useLocation } from "react-router-dom";
import Footer from "./Footer";
import HireMe from "./HireMe";
import { SearchToggle } from "./search-toggle";
import { LanguageToggle } from "./language-toggle";
import { ThemeToggle } from "./theme-toggle";

export const Conditionals = () => {

    const ConditionalToggles = () => {
        const location = useLocation();
        
        // hide toggles on these paths and render on all others
        const hideTogglesOn = ["/a"];
        const shouldRender = !hideTogglesOn.some(path => location.pathname === path);
        
        if (!shouldRender) return null;
        
        return (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2">
            <SearchToggle />
            <LanguageToggle />
            <ThemeToggle />
        </div>
        );
    };
    
    const ConditionalHireMe = () => {
        const location = useLocation();
        
        // hide HireMe on these paths and render on all others
        const hideHireMeOn = ["/404", "/a"];
        const shouldRender = !hideHireMeOn.some(path => location.pathname === path);
        
        if (!shouldRender) return null;
        
        return <HireMe />;
    };
    

    const ConditionalFooter = () => {
        const location = useLocation();
        
        // hide footer on these paths and render on all others
        const hideFooterOn = ['/', '*', "/404", "/a"];
        const shouldRender = !hideFooterOn.some(path => location.pathname === path);
        
        if (!shouldRender) return null;
        
        return <Footer />;
    };
    return (
        <>
            <ConditionalFooter />
            <ConditionalHireMe />
            <ConditionalToggles />
        </>
    );
};
