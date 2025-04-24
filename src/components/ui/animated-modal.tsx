'use client';

import {cn} from "@/lib/utils";
import {AnimatePresence, motion} from "framer-motion";
import React, {createContext, useContext, useEffect, useRef, useState} from "react";
import {useOutsideClick} from "@/lib/hooks/useOutsideClick";

interface ModalContextType {
    openModalId: string | null;
    onOpen: (eventId: string) => void;
    onClose: () => void;
    openModalKey: string | null;
    setOpenModalKey: (key: string | null) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = (): ModalContextType => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};

interface ModalProviderProps {
    children: React.ReactNode;
}

export function ModalProvider({children}: ModalProviderProps) {
    const [openModalId, setOpenModalId] = useState<string | null>(null);
    const [openModalKey, setOpenModalKey] = useState<string | null>(null);

    const onOpen = (eventId: string) => setOpenModalId(eventId);
    const onClose = () => {
        setOpenModalId(null);
        setOpenModalKey(null);
    };

    return (
        <ModalContext.Provider value={{openModalId, onOpen, onClose, openModalKey, setOpenModalKey}}>
            {children}
        </ModalContext.Provider>
    );
}

interface ModalBodyProps {
    id: string;
    modalKey: string;
    children: React.ReactNode;
    className?: string;
}

export const ModalBody = ({id, modalKey, children, className}: ModalBodyProps) => {
    const {openModalId, openModalKey, onClose} = useModal();
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (openModalId) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [openModalId]);

    useOutsideClick(modalRef, onClose);

    console.log('inside ModalBody:', {id, openModalId, openModalKey, modalKey});

    return (
        <AnimatePresence>
            {openModalId === id && openModalKey === modalKey && (
                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1, backdropFilter: 'blur(12px)'}}
                    exit={{opacity: 0, backdropFilter: 'blur(0px)'}}
                    className="fixed [perspective:800px] [transform-style:preserve-3d] inset-0 h-full w-full flex items-center justify-center z-50"
                >
                    <Overlay/>

                    <motion.div
                        ref={modalRef}
                        className={cn(
                            'flex flex-col flex-1 max-h-[90%] max-w-[90%] sm:max-w-lg md:max-w-xl bg-black rounded-2xl sm:rounded-3xl relative z-50 overflow-hidden shadow-secondary-800 shadow-[30px_30px_100px]',
                            className
                        )}
                        initial={{opacity: 0, scale: 0.5, rotateX: 40, y: 40}}
                        animate={{opacity: 1, scale: 1, rotateX: 0, y: 0}}
                        exit={{opacity: 0, scale: 0.8, rotateX: 10}}
                        transition={{type: 'spring', stiffness: 260, damping: 15}}
                    >
                        <CloseIcon/>
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

interface ModalContentProps {
    children: React.ReactNode;
    className?: string;
}

export const ModalContent = ({children, className}: ModalContentProps) => (
    <div className={cn('flex flex-col flex-1 p-8 md:p-10', className)}>{children}</div>
);

interface ModalFooterProps {
    children: React.ReactNode;
    className?: string;
}

export const ModalFooter = ({children, className}: ModalFooterProps) => (
    <div className={cn('flex justify-end', className)}>{children}</div>
);

interface OverlayProps {
    className?: string;
}

export const Overlay = ({className}: OverlayProps) => (
    <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1, backdropFilter: 'blur(12px)'}}
        exit={{opacity: 0, backdropFilter: 'blur(0px)'}}
        className={`fixed inset-0 h-full w-full bg-black/20 z-50 ${className || ''}`}
    />
);

const CloseIcon = () => {
    const {onClose} = useModal();

    return (
        <button
            onClick={onClose}
            className="absolute top-6 sm:top-8 right-6 sm:right-8 group"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 group-hover:scale-125 group-hover:rotate-3 transition duration-200"
            >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M18 6l-12 12"/>
                <path d="M6 6l12 12"/>
            </svg>
        </button>
    );
}
