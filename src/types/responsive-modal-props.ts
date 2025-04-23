import React from "react";

export interface ModalContextProps {
    openModalId: string | null;
    onOpen: (id: string) => void;
    onClose: () => void;
    openModalKey: string | null;
    setOpenModalKey: (id: string) => void;
}

export interface ModalProviderProps {
    children: React.ReactNode;
}

export interface ModalBodyProps {
    id?: string;
    modalKey: string;
    children: React.ReactNode;
    className?: string;
}

export interface ModalContentProps {
    children: React.ReactNode;
    className?: string;
}

export interface ModalFooterProps {
    children: React.ReactNode;
    className?: string;
}

export interface ModalOverlayProps {
    className?: string;
}
