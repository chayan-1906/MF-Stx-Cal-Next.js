import {MFFundFormProps} from "@/types";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {MFFundFormValues, mfFundSchema} from "@/lib/formValidationSchemas";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import axios from "axios";
import {ApiResponse} from "@/types/ApiResponse";
import apis from "@/lib/apis";
import {toast} from "react-toastify";
import {Input} from "@/components/ui/input";
import {capitalizeFirst, cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import React, {useEffect} from "react";
import {LoadingButton} from "@/components/loading-button";
import {PencilIcon, PlusIcon} from "lucide-react";
import {useModal} from "@/components/ui/custom-modal";
import {useRouter} from "next/navigation";

function MFFundForm({userId, mfFund, mfSipForm}: MFFundFormProps) {
    const defaultValues: Partial<MFFundFormValues> = {userId: userId || ''};
    const mfFundForm = useForm<MFFundFormValues>({
        resolver: zodResolver(mfFundSchema),
        defaultValues,
    });
    const {register: register, handleSubmit, formState: {errors, isValid, isSubmitting}, reset} = mfFundForm;
    const router = useRouter();

    const {onClose} = useModal();

    const createNewMfFund = async () => {
        console.log('createNewMfFund:', mfFundForm.getValues());
        const formData = mfFundForm.getValues();

        // Format fields
        formData.fundName = formData.fundName?.toUpperCase() || '';
        formData.fundCode = formData.fundCode?.toUpperCase() || '';
        formData.schemeName = capitalizeFirst(formData.schemeName);
        console.log('formData:', formData);

        try {
            const addMfFundApiResponse = (await axios.post<ApiResponse>(apis.addMFFundApi(), formData)).data;

            if (addMfFundApiResponse.success) {
                toast(addMfFundApiResponse.message, {type: 'success'});
                reset();
                router.refresh();
                onClose();
                mfSipForm.setValue('mfFundId', addMfFundApiResponse.data.mfFundId);
            } else {
                toast(addMfFundApiResponse.message, {type: 'error'});
            }
        } catch (error) {
            toast('Something went wrong', {type: 'error'});
        }
    }

    const updateExistingMfFund = () => {

    }

    return (
        <Form {...mfFundForm}>
            <form onSubmit={handleSubmit(mfFund ? updateExistingMfFund : createNewMfFund)} className={'flex flex-col gap-5 px-4 py-1'}>
                {/** userId */}
                <FormField control={mfFundForm.control} name={'userId'} render={({field}) => (
                    <FormItem className={''}>
                        <FormLabel htmlFor={field.name} className={''}>UserId *</FormLabel>
                        <FormControl>
                            <Input {...field} id={field.name} value={field.value ?? ''} type={'text'} disabled placeholder={'UserId...'}
                                   className={''} onChange={(e) => field.onChange(e)}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}/>

                {/** fund name */}
                <FormField control={mfFundForm.control} name={'fundName'} render={({field}) => (
                    <FormItem>
                        <FormLabel htmlFor={field.name} className={''}>Fund name *</FormLabel>
                        <FormControl>
                            <Input {...field} id={field.name} value={field.value ?? ''} type={'text'} placeholder={'Mirae Asset Mutual Fund'} className={'uppercase'}
                                   onChange={(e) => field.onChange(e)}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}/>

                {/** fund code */}
                <FormField control={mfFundForm.control} name={'fundCode'} render={({field}) => (
                    <FormItem>
                        <FormLabel htmlFor={field.name} className={''}>Fund code (Optional)</FormLabel>
                        <FormControl>
                            <Input {...field} id={field.name} value={field.value ?? ''} type={'text'} placeholder={'INF769K01GU0'} className={'uppercase'}
                                   onChange={(e) => field.onChange(e)}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}/>

                {/** scheme name */}
                <FormField control={mfFundForm.control} name={'schemeName'} render={({field}) => (
                    <FormItem>
                        <FormLabel htmlFor={field.name} className={''}>Scheme name *</FormLabel>
                        <FormControl>
                            <Input {...field} id={field.name} value={field.value ?? ''} type={'text'} placeholder={'Mirae Asset Large Cap Fund - Direct Plan - Growth'}
                                   className={'capitalize'} onChange={(e) => field.onChange(e)}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}/>

                {/** folio no */}
                <FormField control={mfFundForm.control} name={'folioNo'} render={({field}) => (
                    <FormItem>
                        <FormLabel htmlFor={field.name} className={''}>Folio no *</FormLabel>
                        <FormControl>
                            <Input {...field} id={field.name} value={field.value ?? ''} placeholder={'79943003995'}
                                   className={''} onChange={(e) => field.onChange(e)} onWheel={(e) => e.currentTarget.blur()}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}/>

                {/** category */}
                <FormField control={mfFundForm.control} name={'category'} render={({field}) => (
                    <FormItem>
                        <FormLabel htmlFor={field.name} className={''}>Category *</FormLabel>
                        <FormControl>
                            <div className={'flex flex-wrap gap-4'}>
                                {['equity', 'debt', 'liquid'].map(category => (
                                    <Button key={category} type={'button'} onClick={() => field.onChange(category)}
                                            className={cn('flex flex-1 justify-center items-center capitalize bg-transparent border border-input text-text-900', field.value === category && 'bg-primary border-none text-primary-foreground')}>
                                        {category}
                                    </Button>
                                ))}
                            </div>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}/>

                <div className={'flex gap-4 items-center justify-end'}>
                    <Button variant={'destructive'} type={'reset'} className={'h-10'} onClick={onClose}>Cancel</Button>
                    <LoadingButton variant={'secondary'} loading={isSubmitting} className={'h-10'}>
                        {mfFund ? <PencilIcon/> : <PlusIcon/>}
                        {mfFund ? 'Update' : 'Create'}
                    </LoadingButton>
                </div>
            </form>
        </Form>
    );
}

export default MFFundForm;
