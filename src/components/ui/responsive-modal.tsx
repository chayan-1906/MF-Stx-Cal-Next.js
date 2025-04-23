'use client';

import * as React from 'react';
import {createContext, useContext, useEffect, useRef, useState} from 'react';
import {cn} from '@/lib/utils';
import {ModalBodyProps, ModalContentProps, ModalContextProps, ModalFooterProps, ModalOverlayProps, ModalProviderProps} from "@/types/responsive-modal-props";
import {X} from "lucide-react";

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const useModal = (): ModalContextProps => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
}

export function ModalProvider({children}: ModalProviderProps) {
    const [openModalId, setOpenModalId] = useState<string | null>(null);
    const [openModalKey, setOpenModalKey] = useState<string | null>(null);

    const onOpen = (id: string | null) => setOpenModalId(id ?? '');
    const onClose = () => (setOpenModalId(null), setOpenModalKey(null));

    return (
        <ModalContext.Provider value={{openModalId, onOpen, onClose, openModalKey, setOpenModalKey}}>
            {children}
        </ModalContext.Provider>
    );
}

export const ModalBody = ({id, modalKey, children, className}: ModalBodyProps) => {
    const {openModalId, openModalKey, onClose} = useModal();

    const modalRef = useRef<HTMLDivElement>(null);

    // MAY NEED TO COMMENT OUT -- useOutsideClick, handleOutsideClick, useEffect
    /*useOutsideClick(modalRef, onClose);

    const handleOutsideClick = (e: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            // onClose();
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);*/

    useEffect(() => {
        if (openModalKey === modalKey) {
            document.body.style.overflow = 'hidden';
            document.body.style.height = '100vh';
            document.body.style.width = '100%';
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            document.body.style.height = '';
            document.body.style.width = '';
            document.documentElement.style.overflow = '';
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = '';
            document.body.style.height = '';
            document.body.style.width = '';
            document.documentElement.style.overflow = '';
        };
    }, [openModalId, openModalKey, modalKey]);

    // console.log('inside ModalBody:', {id, openModalId, openModalKey, modalKey});

    return (
        <div>
            {(openModalId === id && openModalKey === modalKey) && (
                <div className={'fixed inset-0 h-full w-full flex z-50 sm:items-center sm:justify-center'}>
                    <Overlay/>
                    <div ref={modalRef}
                         className={cn('fixed sm:relative bottom-0 z-50 flex flex-col flex-1 max-h-[75%] w-full sm:max-w-lg md:max-w-xl bg-primary-200 dark:bg-primary-900 rounded-t-2xl sm:rounded-3xl overflow-hidden shadow-md dark:shadow-primary/20 dark:shadow-[30px_30px_100px]', className)}>
                        <X className={'absolute top-6 right-6 text-text-100 dark:text-text-900 hover:scale-110 transition-all cursor-pointer size-5'} onClick={onClose}/>
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
}

export const ModalContent = function ({children, className}: ModalContentProps) {
    return (
        <div className={cn('flex flex-col flex-1 p-8 md:p-10', className)}>{children}</div>
    );
}

export const ModalFooter = function ({children, className}: ModalFooterProps) {
    return (
        <div className={cn('flex justify-end', className)}>{children}</div>
    );
}

export const Overlay = ({className}: ModalOverlayProps) => {
    return (
        <div className={cn('fixed inset-0 h-full w-full bg-black/20 z-50 drop-shadow-2xl drop-shadow-primary', className)}/>
    );
}
