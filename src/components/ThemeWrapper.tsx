'use client';

import {ReactNode, useEffect, useState} from 'react';
import {ThemeProvider} from 'next-themes';

function ThemeWrapper({children}: { children: ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // return <div className={children.props.className}>{children}</div>;
        return null;
    }

    return (
        <ThemeProvider attribute={'class'} defaultTheme={'system'} enableSystem disableTransitionOnChange>
            {children}
        </ThemeProvider>
    );
}

export default ThemeWrapper;
