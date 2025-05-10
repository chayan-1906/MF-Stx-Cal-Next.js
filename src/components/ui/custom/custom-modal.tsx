'use client';

import {cn, isStringInvalid} from "@/lib/utils";
import React, {createContext, useCallback, useContext, useEffect, useRef, useState} from "react";
import {useOutsideClick} from "@/lib/hooks/useOutsideClick";
import {Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {useMediaQuery} from "usehooks-ts";
import {Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle} from "@/components/ui/drawer";

interface ModalContextType {
    openModalId: string | null;
    onOpen: (id?: string) => void;
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

    const onOpen = (id: string | null = null) => setOpenModalId(id);
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

interface ModalProps {
    id?: string | null;
    modalKey: string | null;
    title?: string;
    description?: string;
    children: React.ReactNode;
    showClose?: boolean;
    onCloseAction?: () => void;
    actionButtonLabel?: string;
    actionButtonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    onAction?: () => void;
    className?: string;
    titleClassName?: string;
}

export const Modal = ({
                          id = null, modalKey, title, description, children, showClose = true, onCloseAction, actionButtonLabel, actionButtonVariant,
                          onAction, className, titleClassName,
                      }: ModalProps) => {
    const {openModalId, openModalKey, onClose: onModalClose} = useModal();
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const modalRef = useRef<HTMLDivElement>(null);
    const isOpen = (id === openModalId) && (!isStringInvalid(modalKey) && !isStringInvalid(openModalKey) && modalKey === openModalKey);

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

    if (isDesktop) {
        return (
            <Dialog open={isOpen}>
                <DialogContent className={cn(className, 'max-h-[calc(100vh-4rem)] flex flex-col pt-8')} onClose={handleCloseModal}>
                    {/** header */}
                    <DialogHeader>
                        <DialogTitle className={cn('text-center font-bold text-text-900 text-2xl', titleClassName)}>{title}</DialogTitle>
                        <DialogDescription className={'text-center font-medium text-text-800'}>{description}</DialogDescription>
                    </DialogHeader>

                    {/** content */}
                    <div className={'overflow-y-auto flex-1'}>{children}</div>

                    {/** footer */}
                    <DialogFooter>
                        <DialogClose asChild className={showClose ? 'block' : 'hidden'}>
                            <Button variant={'outline'} onClick={handleCloseModal}>Close</Button>
                        </DialogClose>
                        <Button variant={actionButtonVariant} onClick={onAction} className={cn(!isStringInvalid(actionButtonLabel) && onAction ? 'flex' : 'hidden')}>{actionButtonLabel}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={isOpen}>
            <DrawerContent onClose={handleCloseModal}>
                {/** header */}
                <DrawerHeader>
                    <DrawerTitle className={cn('text-center font-bold text-text-900 text-2xl', titleClassName)}>{title}</DrawerTitle>
                    <DrawerDescription className={'text-center font-medium text-text-800'}>{description}</DrawerDescription>
                </DrawerHeader>

                {/** content */}
                <div className={'overflow-y-auto flex-1'}>{children}</div>

                <DrawerFooter>
                    <DrawerClose asChild className={showClose ? 'block' : 'hidden'}>
                        <Button variant={'outline'} onClick={handleCloseModal}>Close</Button>
                    </DrawerClose>
                    <Button variant={actionButtonVariant} onClick={onAction} className={cn(!isStringInvalid(actionButtonLabel) && onAction ? 'flex' : 'hidden')}>{actionButtonLabel}</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
