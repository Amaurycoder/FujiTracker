import { ComponentType } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageTransitionProps {
    children: React.ReactNode;
}

const pageVariants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    enter: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: 'easeOut',
        },
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.2,
            ease: 'easeIn',
        },
    },
};

export function PageTransition({ children }: PageTransitionProps) {
    return (
        <motion.div
            initial="initial"
            animate="enter"
            exit="exit"
            variants={pageVariants}
            className="w-full h-full"
        >
            {children}
        </motion.div>
    );
}

// HOC to wrap page components
export function withPageTransition<P extends object>(Component: ComponentType<P>) {
    return function WrappedComponent(props: P) {
        return (
            <PageTransition>
                <Component {...props} />
            </PageTransition>
        );
    };
}
