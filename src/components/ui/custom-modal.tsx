'use client';

import {cn, isStringInvalid} from "@/lib/utils";
import React, {createContext, useCallback, useContext, useEffect, useRef, useState} from "react";
import {useOutsideClick} from "@/lib/hooks/useOutsideClick";
import {Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";

interface ModalContextType {
    openModalId: string | null;
    onOpen: (eventId?: string) => void;
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

    const onOpen = (eventId: string | null = null) => setOpenModalId(eventId);
    const onClose = () => {
        setOpenModalId(null);
        setOpenModalKey(null);
    }

    return (
        <ModalContext.Provider value={{openModalId, onOpen, onClose, openModalKey, setOpenModalKey}}>
            {children}
        </ModalContext.Provider>
    );
}

interface ModalBodyProps {
    id?: string;
    modalKey: string | null;
    title?: string;
    description?: string;
    children: React.ReactNode;
    showClose: boolean;
    onCloseAction?: () => void;
    className?: string;
}

export const Modal = ({id, modalKey, title, description, children, showClose = true, onCloseAction, className}: ModalBodyProps) => {
    const {openModalId, openModalKey, onClose: onModalClose} = useModal();
    const modalRef = useRef<HTMLDivElement>(null);
    const isOpen = !isStringInvalid(modalKey) && !isStringInvalid(openModalKey) && modalKey === openModalKey;

    useEffect(() => {
        if (openModalId) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [openModalId]);

    useOutsideClick(modalRef, onModalClose);

    const handleCloseModal = useCallback(() => {
        if (onCloseAction) {
            onCloseAction();
        }
        onModalClose();
    }, [onCloseAction, onModalClose]);

    console.log('inside ModalBody:', {id, openModalId, openModalKey, modalKey});

    return (
        <Dialog open={isOpen}>
            <DialogContent className={cn(className, 'max-h-[calc(100vh-4rem)] flex flex-col')} onClose={handleCloseModal}>
                {/** header */}
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                {/** content */}
                <div className={'overflow-y-auto flex-1'}>{children}</div>

                {/** footer */}
                <DialogFooter>
                    <DialogClose asChild className={showClose ? 'block' : 'hidden'}>
                        <Button onClick={handleCloseModal}>Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

/*
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
*/
