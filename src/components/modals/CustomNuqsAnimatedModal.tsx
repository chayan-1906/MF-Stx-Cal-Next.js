/*
'use client';

import {Button} from "@/components/ui/button";
import React, {useCallback} from "react";
import {cn} from "@/lib/utils";
import NuqsAnimatedModal from "@/components/ui/custom/nuqs-animated-modal";
import {ModalContent, ModalFooter} from "@/components/ui/animated-modal";
import {LoadingButton} from "@/components/loading-button";

interface CustomNuqsAnimatedModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    titleColor?: string;
    body: React.ReactNode;
    footer?: React.ReactNode;
    onAction?: () => void;
    actionLabel?: string;
    actionBgColor?: 'default' | 'secondary' | 'destructive' | 'link' | 'outline' | 'ghost';
    onSecondaryAction?: () => void;
    secondaryActionLabel?: string;
    isDisabled?: boolean;
    isLoading?: boolean;
    classes?: string;
}

const CustomNuqsAnimatedModal: React.FC<CustomNuqsAnimatedModalProps> = ({
                                                                             isOpen,
                                                                             onClose,
                                                                             title,
                                                                             titleColor,
                                                                             body,
                                                                             footer,
                                                                             onAction,
                                                                             actionLabel,
                                                                             actionBgColor,
                                                                             onSecondaryAction,
                                                                             secondaryActionLabel,
                                                                             isDisabled = false,
                                                                             isLoading = false,
                                                                             classes,
                                                                         }) => {
    const handleSubmit = useCallback(() => {
        if (isDisabled) return;
        if (onAction) onAction();
    }, [isDisabled, onAction]);

    const handleSecondaryAction = useCallback(() => {
        onClose();
        if (onSecondaryAction) onSecondaryAction();
    }, [onSecondaryAction, onClose]);

    return (
        <NuqsAnimatedModal isOpen={isOpen} onClose={onClose}>
            <div className={cn('cursor-auto', classes)}>
                <ModalContent className={cn('flex flex-col gap-4', '')}>
                    <h2
                        className={cn(
                            'text-primary-foreground font-bold text-lg sm:text-xl text-center px-7 sm:px-10',
                            titleColor || 'text-primary-foreground'
                        )}
                    >
                        {title}
                    </h2>
                    <div>{body}</div>
                </ModalContent>
                <ModalFooter
                    className={cn(
                        'flex flex-wrap items-center justify-end gap-4',
                        (secondaryActionLabel || (onAction && actionLabel) || footer) && 'p-8 md:p-10 pb-6 md:pb-6 pt-0 md:pt-0'
                    )}
                >
                    {secondaryActionLabel && (
                        <Button variant="outline" size="sm" onClick={handleSecondaryAction}>
                            {secondaryActionLabel}
                        </Button>
                    )}
                    {onAction && actionLabel && (
                        <LoadingButton
                            variant={actionBgColor || 'secondary'}
                            size="sm"
                            loading={isLoading}
                            disabled={isLoading || isDisabled}
                            onClick={handleSubmit}
                        >
                            {actionLabel}
                        </LoadingButton>
                    )}
                    {footer}
                </ModalFooter>
            </div>
        </NuqsAnimatedModal>
    );
}

export default CustomNuqsAnimatedModal;
*/
