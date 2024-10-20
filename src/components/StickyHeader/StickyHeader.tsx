import { useEffect, useState } from 'react';

const useStickyHeader = () => {
    const [isSticky, setSticky] = useState(false);

    const handleScroll = () => {
        setSticky(window.scrollY > 100);  // Adjust this value based on when you want the header to become sticky
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return isSticky;
};

export default useStickyHeader;
