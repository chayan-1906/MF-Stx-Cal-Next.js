'use client';

import React, {useEffect, useMemo} from "react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {MFLumpsumFormValues, mfLumpsumSchema} from "@/lib/formValidationSchemas";
import {DollarSign, FileText, PencilIcon, PlusIcon} from "lucide-react";
import {capitalizeFirst, cn} from "@/lib/utils";
import {BiRupee} from "react-icons/bi";
import {MdNotes} from "react-icons/md";
import {MFLumpsumFormProps} from "@/types";
import apis from "@/lib/apis";
import axios from "axios";
import {ApiResponse} from "@/types/ApiResponse";
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";
import {LoadingButton} from "../loading-button";
import routes from "@/lib/routes";
import {Textarea} from "@/components/ui/textarea";
import MFFundsSelect from "@/components/MFFundsSelect";
import {useModal} from "@/components/ui/custom/custom-modal";
import {modalKeys} from "@/lib/modalKeys";
import AddUpdateMFFundModal from "@/components/mutual-funds/modals/AddUpdateMFFundModal";

function MFLumpsumForm({userId, mfLumpsum}: MFLumpsumFormProps) {
    const defaultValues = useMemo(() => mfLumpsum
            ? mfLumpsumSchema.parse({
                ...mfLumpsum,
                date: new Date(mfLumpsum.date),
            }) : {userId, active: true},
        [mfLumpsum, userId],
    );
    console.log('defaultValues:', defaultValues);

    const mfLumpsumForm = useForm<MFLumpsumFormValues>({
        resolver: zodResolver(mfLumpsumSchema),
        defaultValues,
    });
    const {register: register, handleSubmit, formState: {errors, isValid, isSubmitting}, reset} = mfLumpsumForm;
    const router = useRouter();

    const {onOpen: onAddFundModalOpen, openModalKey, setOpenModalKey} = useModal();

    const cardWrapperClassNames = 'rounded-xl overflow-hidden shadow-lg border-3 border-primary-600 flex-1';
    const cardHeaderClassNames = 'bg-card-header uppercase font-semibold text-sm sm:text-base p-4 text-primary-foreground rounded-t-xl';
    const cardBgClassNames = 'h-full bg-background/40 p-6 space-y-5 rounded-b-xl';

    const createNewMfLumpsum = async () => {
        console.log('createNewMfLumpsum:', mfLumpsumForm.getValues());
        const formData = mfLumpsumForm.getValues();

        // Format fields
        formData.fundName = formData.fundName?.toUpperCase() || '';
        formData.fundCode = formData.fundCode?.toUpperCase() || '';
        formData.schemeName = capitalizeFirst(formData.schemeName);
        console.log('formData:', formData);

        try {
            const addMfLumpsumApiResponse = (await axios.post<ApiResponse>(apis.addMFLumpsumApi(), formData)).data;

            if (addMfLumpsumApiResponse.success) {
                toast(addMfLumpsumApiResponse.message, {type: 'success'});
                reset();
                router.refresh();
                router.push(routes.homePath());
            } else {
                toast(addMfLumpsumApiResponse.message, {type: 'error'});
            }
        } catch (error) {
            toast('Something went wrong', {type: 'error'});
        }
    }

    const updateExistingMfLumpsum = async () => {
        console.log('updateExistingMfLumpsum:', mfLumpsumForm.getValues());
        const formData = mfLumpsumForm.getValues();

        // Format fields
        formData.fundName = formData.fundName?.toUpperCase() || '';
        formData.fundCode = formData.fundCode?.toUpperCase() || '';
        formData.schemeName = capitalizeFirst(formData.schemeName);
        console.log('formData:', formData);

        try {
            const updateMfLumpsumApiResponse = await axios.put<ApiResponse>(apis.updateMFLumpsumApi(), formData);

            if (updateMfLumpsumApiResponse.data.success) {
                toast(updateMfLumpsumApiResponse.data.message, {type: 'success'});
                reset();
                router.refresh();
                router.push(routes.homePath());
            } else {
                toast(updateMfLumpsumApiResponse.data.message, {type: 'error'});
            }
        } catch (error: any) {
            toast('Something went wrong', {type: 'error'});
        }
    }

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

    return (
        <div className={'mx-auto px-4'}>
            <div className={'mb-2 sm:mb-5 md:mb-8 text-center'}>
                <h2 className={'sm:mb-2 text-lg sm:text-xl md:text-2xl font-bold text-text-900 tracking-wide'}>{mfLumpsum ? 'Update Lumpsum' : 'Create New Lumpsum'}</h2>
                <p className={'text-sm sm:text-base md:text-lg text-text-800'}>
                    {mfLumpsum ? 'Update your lumpsum investment details below' : 'Create a lumpsum investment log to track your progress'}
                </p>
            </div>

            <AddUpdateMFFundModal userId={userId} openModalKey={openModalKey} mfLumpsumForm={mfLumpsumForm}/>

            <Form {...mfLumpsumForm}>
                <form onSubmit={handleSubmit(mfLumpsum ? updateExistingMfLumpsum : createNewMfLumpsum)} className={'relative space-y-5 overflow-auto'}>

                    {/** cards */}
                    <div className={'flex flex-col gap-5'}>
                        {/** Card 1: Fund Details */}
                        <div className={cn(cardWrapperClassNames, 'flex-1 overflow-visible')}>
                            <div className={cardHeaderClassNames}>
                                <div className={'flex items-center gap-2 text-primary-foreground'}>
                                    <FileText className={'size-4 sm:size-5'}/>
                                    <h3>Fund Information</h3>
                                </div>
                            </div>

                            {/** form - Fund Information */}
                            <div className={cardBgClassNames}>
                                {/** fund select & add fund */}
                                <div className={'flex flex-col lg:flex-row gap-4 lg:items-end'}>
                                    <FormField control={mfLumpsumForm.control} name={'mfFundId'} render={({field}) => (
                                        <FormItem className={'w-full'}>
                                            <FormLabel>Mutual Fund *</FormLabel>
                                            <FormControl>
                                                <MFFundsSelect value={field.value} onChange={(fund) => {
                                                    if (!fund) {
                                                        mfLumpsumForm.setValue('mfFundId', '');
                                                        mfLumpsumForm.setValue('fundName', '');
                                                        mfLumpsumForm.setValue('fundCode', '');
                                                        mfLumpsumForm.setValue('schemeName', '');
                                                        mfLumpsumForm.setValue('folioNo', '');
                                                        mfLumpsumForm.setValue('category', null);
                                                    } else {
                                                        mfLumpsumForm.setValue('mfFundId', fund.mfFundId ?? '');
                                                        mfLumpsumForm.setValue('fundName', fund.schemeName ?? '');
                                                        mfLumpsumForm.setValue('fundCode', fund.fundCode ?? '');
                                                        mfLumpsumForm.setValue('schemeName', fund.schemeName ?? '');
                                                        mfLumpsumForm.setValue('folioNo', fund.folioNo ?? '');
                                                        mfLumpsumForm.setValue('category', fund.category ?? null);
                                                    }
                                                }}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>
                                    <Button type={'button'} variant={'secondary'} onClick={() => {
                                        onAddFundModalOpen();
                                        setOpenModalKey(modalKeys.addUpdateMfFund)
                                    }}>Add Fund</Button>
                                </div>

                                <div className={'hidden'}>
                                    {/** userId */}
                                    <FormField control={mfLumpsumForm.control} name={'userId'} render={({field}) => (
                                        <FormItem className={''}>
                                            <FormLabel htmlFor={field.name} className={''}>UserId *</FormLabel>
                                            <FormControl>
                                                <Input {...field} id={field.name} value={field.value ?? ''} type={'text'} disabled placeholder={'UserId...'}
                                                       className={''} onChange={(e) => field.onChange(e)}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>

                                    {/** lumpsumId */}
                                    <FormField control={mfLumpsumForm.control} name={'mfLumpsumId'} render={({field}) => (
                                        <FormItem className={cn('', mfLumpsum ? 'block' : 'hidden')}>
                                            <FormLabel htmlFor={field.name} className={''}>MfLumpsumId *</FormLabel>
                                            <FormControl>
                                                <Input {...field} id={field.name} value={field.value ?? ''} type={'text'} disabled placeholder={'MfLumpsumId...'}
                                                       className={''} onChange={(e) => field.onChange(e)}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>

                                    {/** fund name */}
                                    <FormField control={mfLumpsumForm.control} name={'fundName'} render={({field}) => (
                                        <FormItem>
                                            <FormLabel htmlFor={field.name} className={''}>Fund name *</FormLabel>
                                            <FormControl>
                                                <Input {...field} id={field.name} value={field.value ?? ''} type={'text'} disabled placeholder={'Mirae Asset Mutual Fund'} className={'uppercase'}
                                                       onChange={(e) => field.onChange(e)}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>

                                    {/** fund code */}
                                    <FormField control={mfLumpsumForm.control} name={'fundCode'} render={({field}) => (
                                        <FormItem>
                                            <FormLabel htmlFor={field.name} className={''}>Fund code (Optional)</FormLabel>
                                            <FormControl>
                                                <Input {...field} id={field.name} value={field.value ?? ''} type={'text'} disabled placeholder={'INF769K01GU0'} className={'uppercase'}
                                                       onChange={(e) => field.onChange(e)}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>

                                    {/** scheme name */}
                                    <FormField control={mfLumpsumForm.control} name={'schemeName'} render={({field}) => (
                                        <FormItem>
                                            <FormLabel htmlFor={field.name} className={''}>Scheme name *</FormLabel>
                                            <FormControl>
                                                <Input {...field} id={field.name} value={field.value ?? ''} type={'text'} disabled placeholder={'Mirae Asset Large Cap Fund - Direct Plan - Growth'}
                                                       className={'capitalize'} onChange={(e) => field.onChange(e)}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>

                                    {/** folio no */}
                                    <FormField control={mfLumpsumForm.control} name={'folioNo'} render={({field}) => (
                                        <FormItem>
                                            <FormLabel htmlFor={field.name} className={''}>Folio no *</FormLabel>
                                            <FormControl>
                                                <Input {...field} id={field.name} value={field.value ?? ''} disabled placeholder={'79943003995'}
                                                       className={''} onChange={(e) => field.onChange(e)} onWheel={(e) => e.currentTarget.blur()}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>

                                    {/** category */}
                                    <FormField control={mfLumpsumForm.control} name={'category'} render={({field}) => (
                                        <FormItem>
                                            <FormLabel htmlFor={field.name} className={''}>Category *</FormLabel>
                                            <FormControl>
                                                <div className={'flex flex-wrap gap-4'}>
                                                    {['equity', 'debt', 'liquid'].map(category => (
                                                        <Button key={category} type={'button'} disabled onClick={() => field.onChange(category)}
                                                                className={cn('flex flex-1 justify-center items-center capitalize bg-transparent border border-input text-text-900', field.value === category && 'bg-primary border-none text-primary-foreground')}>
                                                            {category}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>
                                </div>
                            </div>
                        </div>

                        {/** Card 2: Amount, Dates & Notes */}
                        <div className={cardWrapperClassNames}>
                            <div className={cardHeaderClassNames}>
                                <div className={'flex items-center gap-2 text-primary-foreground'}>
                                    <DollarSign className={'size-4 sm:size-5'}/>
                                    <h3>Investment Details, Timeline and Notes</h3>
                                </div>
                            </div>

                            {/** form - Investment Details */}
                            <div className={cardBgClassNames}>
                                {/** amount */}
                                <FormField control={mfLumpsumForm.control} name={'amount'} render={({field}) => (
                                    <FormItem>
                                        <FormLabel htmlFor={field.name} className={''}>Monthly amount (₹) *</FormLabel>
                                        <FormControl>
                                            <div className={'relative'}>
                                                <div className={'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'}>
                                                    <BiRupee size={18} className={'text-text-700'}/>
                                                </div>
                                                <Input {...field} id={field.name} value={field.value ?? ''} type={'number'} placeholder={'3000'} className={'pl-8'}
                                                       onChange={(e) => {
                                                           const val = e.target.value;
                                                           field.onChange(val === '' ? '' : Number(val));
                                                       }} onWheel={(e) => e.currentTarget.blur()}/>
                                            </div>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}/>

                                {/** date */}
                                <FormField control={mfLumpsumForm.control} name={'date'} render={({field}) => (
                                    <FormItem>
                                        <FormLabel htmlFor={field.name} className={''}>Start date *</FormLabel>
                                        <FormControl>
                                            <div className={'relative'}>
                                                <Input{...field} id={field.name} type={'date'} className={''} value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                                                      onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}/>
                                            </div>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}/>

                                {/** notes */}
                                <FormField control={mfLumpsumForm.control} name={'notes'} render={({field}) => (
                                    <FormItem>
                                        <FormLabel htmlFor={field.name} className={''}>Notes (Optional)</FormLabel>
                                        <FormControl>
                                            <div className={'relative'}>
                                                <div className={'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'}>
                                                    <MdNotes size={18} className={'text-text-700'}/>
                                                </div>
                                                <Textarea {...field} id={field.name} value={field.value ?? ''}
                                                          placeholder={'E.g. Transaction done via Groww/MFCentral for long-term goals'}
                                                          className={'pl-10 max-h-40'} onChange={(e) => field.onChange(e)}/>
                                            </div>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}/>
                            </div>
                        </div>
                    </div>

                    <div className={'flex gap-4 items-center justify-end'}>
                        <Button variant={'destructive'} type={'reset'} className={'h-10'}>Cancel</Button>
                        <LoadingButton variant={'secondary'} loading={isSubmitting} className={'h-10'}>
                            {mfLumpsum ? <PencilIcon/> : <PlusIcon/>}
                            {mfLumpsum ? 'Update' : 'Create'}
                        </LoadingButton>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default MFLumpsumForm;
