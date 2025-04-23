import {ModalBody, ModalContent, ModalFooter, useModal} from "@/components/ui/responsive-modal";
import {cn} from "@/lib/utils";
import React, {useCallback, useEffect} from "react";
import {Button} from "@/components/ui/button";
import {LoadingButton} from "@/components/loading-button";
import {CustomResponsiveModalFooterProps, CustomResponsiveModalProps} from "@/types";

function CustomResponsiveModal({
                                   id,
                                   modalKey,
                                   title,
                                   titleColor,
                                   body,
                                   onAction,
                                   actionLabel,
                                   actionBgColor,
                                   onSecondaryAction,
                                   secondaryActionLabel,
                                   footer,
                                   isDisabled,
                                   isLoading,
                                   className
                               }: CustomResponsiveModalProps) {
    return (
        <>
            {/** trigger */}
            {/*<ModalTrigger variant={triggerVariant} size={triggerSize} className={cn('relative z-10', (!showTriggerButton || isStringInvalid(trigger)) && 'hidden')}>
                <span>{trigger}</span>
            </ModalTrigger>*/}

            {/** body */}
            <ModalBody id={id ?? ''} modalKey={modalKey} className={cn('', className)}>
                {/** content */}
                <ModalContent className={cn('flex flex-col gap-4', '')}>
                    <h2 className={cn('text-primary-foreground font-bold text-lg sm:text-xl text-center px-7 sm:px-10', titleColor || 'text-primary-foreground')}>{title}</h2>
                    <CustomModalBody body={body}/>
                </ModalContent>

                {/** footer */}
                <ModalFooter>
                    <FooterContent onAction={onAction} actionLabel={actionLabel} actionBgColor={actionBgColor} onSecondaryAction={onSecondaryAction} secondaryActionLabel={secondaryActionLabel}
                                   footer={footer} isDisabled={isLoading || isDisabled} isLoading={isLoading}/>
                </ModalFooter>
            </ModalBody>
        </>
    );
}

const CustomModalBody = ({body}: { body: React.ReactNode }) => {
    return (
        <div>{body}</div>
    );
}

const FooterContent = ({onAction, actionLabel, actionBgColor, onSecondaryAction, secondaryActionLabel, footer, isDisabled, isLoading}: CustomResponsiveModalFooterProps) => {
    const {openModalId, onClose} = useModal();

    const handleSubmit = useCallback(async () => {
        if (isDisabled) return;

        if (onAction) {
            onAction();
        }
    }, [isDisabled, onAction]);

    const handleSecondaryAction = useCallback(() => {
        onClose();
        if (onSecondaryAction) onSecondaryAction();
    }, [onSecondaryAction, onClose]);

    useEffect(() => {
        if (!openModalId && onSecondaryAction) {
            onSecondaryAction();
        }
    }, [onSecondaryAction, openModalId]);

    return (
        <div className={cn('flex flex-wrap items-center justify-end gap-4 w-full', (secondaryActionLabel || (onAction && actionLabel) || footer) && 'p-8 md:p-10 pb-6 md:pb-6 pt-0 md:pt-0')}>
            {
                secondaryActionLabel && (
                    <Button variant={'outline'} size={'sm'} onClick={handleSecondaryAction}>{secondaryActionLabel}</Button>
                )
            }
            {
                onAction && actionLabel && (
                    <LoadingButton variant={actionBgColor || 'secondary'} size={'sm'} loading={isLoading} disabled={isLoading || isDisabled} onClick={handleSubmit}>{actionLabel}</LoadingButton>
                )
            }
            {footer}
        </div>
    )
}

export default CustomResponsiveModal;
