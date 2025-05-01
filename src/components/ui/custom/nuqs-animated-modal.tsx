/*
import {AnimatePresence, motion} from "framer-motion";
import {cn} from "@/lib/utils";
import React, {useRef} from "react";
import {X} from "lucide-react";
import {useOutsideClick} from "@/lib/hooks/useOutsideClick";
import {Overlay} from "@/components/ui/animated-modal";

interface NuqsAnimatedModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const NuqsAnimatedModal: React.FC<NuqsAnimatedModalProps> = ({isOpen, onClose, children}) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useOutsideClick(modalRef, () => onClose());

    return (
        <AnimatePresence>
            {isOpen && (
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
                            'flex flex-col flex-1 max-h-[90%] max-w-[90%] sm:max-w-lg md:max-w-xl bg-black rounded-2xl sm:rounded-3xl relative z-50 overflow-hidden shadow-secondary-800 shadow-[30px_30px_100px] cursor-pointer',
                            ''
                        )}
                        initial={{opacity: 0, scale: 0.5, rotateX: 40, y: 40}}
                        animate={{opacity: 1, scale: 1, rotateX: 0, y: 0}}
                        exit={{opacity: 0, scale: 0.8, rotateX: 10}}
                        transition={{type: 'spring', stiffness: 260, damping: 15}}
                    >
                        <div className="absolute top-6 sm:top-8 right-6 sm:right-8 group" onClick={onClose}>
                            <X size={16} className="size-4 group-hover:scale-125 group-hover:rotate-3 transition duration-200"/>
                        </div>
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default NuqsAnimatedModal;
*/
