'use client';

import React, {useEffect, useMemo} from "react";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {MFSIPFormValues, mfSipSchema} from "@/lib/formValidationSchemas";
import {CalendarIcon, CheckCircle, Clock, DollarSign, FileText, PencilIcon, PlusIcon, X} from "lucide-react";
import {capitalizeFirst, cn} from "@/lib/utils";
import {BiRupee} from "react-icons/bi";
import {MdNotes} from "react-icons/md";
import {MFSIPFormProps} from "@/types";
import apis from "@/lib/apis";
import axios from "axios";
import {ApiResponse} from "@/types/ApiResponse";
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";
import {LoadingButton} from "../loading-button";
import routes from "@/lib/routes";
import {Textarea} from "@/components/ui/textarea";

function MFSIPForm({userId, mfSip}: MFSIPFormProps) {
    const defaultValues = useMemo(() => mfSip
                ? mfSipSchema.parse({
                    ...mfSip,
                    startDate: new Date(mfSip.startDate),
                endDate: mfSip.endDate ? new Date(mfSip.endDate) : null,
                })
            : {userId, active: true},
        [mfSip, userId],
    );

    const mfSipForm = useForm<MFSIPFormValues>({
        resolver: zodResolver(mfSipSchema),
        defaultValues,
    });
    const {register: register, handleSubmit, formState: {errors, isValid, isSubmitting}, reset} = mfSipForm;
    const router = useRouter();

    const cardWrapperClassNames = 'h-fit rounded-xl overflow-hidden shadow-lg border-3 border-primary-600';
    const cardHeaderClassNames = 'bg-card-header p-4 text-primary-foreground';
    const cardBgClassNames = 'bg-card p-6 space-y-5';

    const createNewMfSip = async () => {
        console.log('createNewMfSip:', mfSipForm.getValues());
        const formData = mfSipForm.getValues();

        // Format fields
        formData.fundName = formData.fundName?.toUpperCase() || '';
        formData.fundCode = formData.fundCode?.toUpperCase() || '';
        formData.schemeName = capitalizeFirst(formData.schemeName);
        console.log('formData:', formData);

        try {
            const addMfSipApiResponse = (await axios.post<ApiResponse>(apis.addMFSIPApi(), formData)).data;

            if (addMfSipApiResponse.success) {
                toast(addMfSipApiResponse.message, {type: 'success'});
                reset();
                router.refresh();
                router.push(routes.homePath());
            } else {
                toast(addMfSipApiResponse.message, {type: 'error'});
            }
        } catch (error) {
            toast('Something went wrong', {type: 'error'});
        }
    }

    const updateExistingMfSip = async () => {
        console.log('updateExistingMfSip:', mfSipForm.getValues());
        const formData = mfSipForm.getValues();

        // Format fields
        formData.fundName = formData.fundName?.toUpperCase() || '';
        formData.fundCode = formData.fundCode?.toUpperCase() || '';
        formData.schemeName = capitalizeFirst(formData.schemeName);
        console.log('formData:', formData);

        try {
            const updateMfSipApiResponse = await axios.put<ApiResponse>(apis.updateMFSIPApi(), formData);

            if (updateMfSipApiResponse.data.success) {
                toast(updateMfSipApiResponse.data.message, {type: 'success'});
                reset();
                router.refresh();
                router.push(routes.homePath());
            } else {
                toast(updateMfSipApiResponse.data.message, {type: 'error'});
            }
        } catch (error: any) {
            toast('Something went wrong', {type: 'error'});
        }
    }

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

    return (
        <div className={'bg-background mx-auto p-6'}>
            <div className={'mb-8 text-center'}>
                <h2 className={'mb-2 text-2xl font-bold text-text-900 tracking-wide'}>{mfSip ? 'Update SIP' : 'Create New SIP'}</h2>
                <p className={'text-text-800'}>
                    {mfSip ? 'Update your systematic investment plan details below' : 'Set up a systematic investment plan to grow your wealth consistently'}
                </p>
            </div>

            <Form {...mfSipForm}>
                <form onSubmit={handleSubmit(mfSip ? updateExistingMfSip : createNewMfSip)} className={'relative space-y-5 overflow-auto'}>
                    {/** cards */}
                    <div className={'flex flex-col md:flex-row gap-5'}>
                        {/** Card 1: Fund Details */}
                        <div className={cn(cardWrapperClassNames, 'flex-1')}>
                            <div className={cardHeaderClassNames}>
                                <div className={'flex items-center gap-2 text-primary-foreground'}>
                                    <FileText className={'size-5'}/>
                                    <h3>Fund Information</h3>
                                </div>
                            </div>

                            {/** form - Fund Information */}
                            <div className={cardBgClassNames}>
                                {/** userId */}
                                <FormField control={mfSipForm.control} name={'userId'} render={({field}) => (
                                    <FormItem className={''}>
                                        <FormLabel htmlFor={field.name} className={''}>UserId *</FormLabel>
                                        <FormControl>
                                            <Input {...field} id={field.name} value={field.value ?? ''} type={'text'} disabled placeholder={'UserId...'}
                                                   className={''} onChange={(e) => field.onChange(e)}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}/>

                                {/** sipId */}
                                <FormField control={mfSipForm.control} name={'mfSipId'} render={({field}) => (
                                    <FormItem className={cn('', mfSip ? 'block' : 'hidden')}>
                                        <FormLabel htmlFor={field.name} className={''}>MfSipId *</FormLabel>
                                        <FormControl>
                                            <Input {...field} id={field.name} value={field.value ?? ''} type={'text'} disabled placeholder={'MfSipId...'}
                                                   className={''} onChange={(e) => field.onChange(e)}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}/>

                                {/** fund name */}
                                <FormField control={mfSipForm.control} name={'fundName'} render={({field}) => (
                                    <FormItem>
                                        <FormLabel htmlFor={field.name} className={''}>Fund name *</FormLabel>
                                        <FormControl>
                                            <Input {...field} id={field.name} value={field.value ?? ''} type={'text'} autoFocus placeholder={'Mirae Asset Mutual Fund'} className={'uppercase'}
                                                   onChange={(e) => field.onChange(e)}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}/>

                                {/** fund code */}
                                <FormField control={mfSipForm.control} name={'fundCode'} render={({field}) => (
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
                                <FormField control={mfSipForm.control} name={'schemeName'} render={({field}) => (
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
                                <FormField control={mfSipForm.control} name={'folioNo'} render={({field}) => (
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
                                <FormField control={mfSipForm.control} name={'category'} render={({field}) => (
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
                            </div>
                        </div>

                        {/** Card 2: Amount & Schedule & Card 3: Dates & Notes */}
                        <div className={'flex flex-col flex-1 gap-4'}>
                            {/** Card 2: Amount & Schedule */}
                            <div className={cardWrapperClassNames}>
                                <div className={cardHeaderClassNames}>
                                    <div className={'flex items-center gap-2 text-primary-foreground'}>
                                        <DollarSign className={'size-5'}/>
                                        <h3>Investment Details</h3>
                                    </div>
                                </div>

                                {/** form - Investment Details */}
                                <div className={cardBgClassNames}>
                                    {/** amount */}
                                    <FormField control={mfSipForm.control} name={'amount'} render={({field}) => (
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

                                    {/** day */}
                                    <FormField control={mfSipForm.control} name={'dayOfMonth'} render={({field}) => (
                                        <FormItem>
                                            <FormLabel htmlFor={field.name} className={''}>Day of month *</FormLabel>
                                            <FormDescription className={'text-xs text-text-600'}>Between 1 & 31</FormDescription>
                                            <FormControl>
                                                <div className={'relative'}>
                                                    <div className={'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'}>
                                                        <CalendarIcon size={18} className={'text-text-700'}/>
                                                    </div>
                                                    <Input {...field} id={field.name} value={field.value ?? ''} type={'number'} placeholder={'12'} className={'pl-10'} onChange={(e) => {
                                                        const val = parseInt(e.target.value, 10);
                                                        if (val >= 1 && val <= 31) {
                                                            field.onChange(val);
                                                        } else if (e.target.value === '') {
                                                            field.onChange('');
                                                        }
                                                    }} onWheel={(e) => e.currentTarget.blur()}/>
                                                </div>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>

                                    {/** active */}
                                    <FormField control={mfSipForm.control} name={'active'} render={({field}) => (
                                        <FormItem>
                                            <FormLabel htmlFor={field.name} className={''}>SIP Status</FormLabel>
                                            <FormControl>
                                                <div className={'flex items-center'}>
                                                    <Button type={'button'} onClick={() => field.onChange(true)}
                                                            className={cn('rounded-r-none hover:bg-success border-none bg-primary text-primary-foreground', field.value === true && 'bg-success')}>
                                                        <CheckCircle className={'size-4 inline mr-1'}/>
                                                        Active
                                                    </Button>
                                                    <Button type={'button'} onClick={() => field.onChange(false)}
                                                            className={cn('rounded-l-none hover:bg-destructive border-none bg-primary text-primary-foreground', field.value === false && 'bg-destructive')}>
                                                        <X className={'size-4 inline mr-1'}/>
                                                        Inactive
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>
                                </div>
                            </div>

                            {/** Card 3: Dates & Notes */}
                            <div className={cardWrapperClassNames}>
                                <div className={cardHeaderClassNames}>
                                    <div className={'flex items-center gap-2 text-primary-foreground'}>
                                        <Clock className={'size-5'}/>
                                        <h3>Timeline & Notes</h3>
                                    </div>
                                </div>

                                {/** form - Timeline & Notes */}
                                <div className={cardBgClassNames}>
                                    {/** start date */}
                                    <FormField control={mfSipForm.control} name={'startDate'} render={({field}) => (
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

                                    {/** end date */}
                                    <FormField control={mfSipForm.control} name={'endDate'} render={({field}) => (
                                        <FormItem>
                                            <FormLabel htmlFor={field.name} className={''}>End date (Optional)</FormLabel>
                                            <FormControl>
                                                <div className={'relative'}>
                                                    <Input{...field} id={field.name} type={'date'} className={''} value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                                                          onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}/>
                                                    <p className={'mt-0.5 text-xs text-text-600'}>Leave blank for an ongoing SIP with no end date</p>
                                                </div>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>

                                    {/** notes */}
                                    <FormField control={mfSipForm.control} name={'notes'} render={({field}) => (
                                        <FormItem>
                                            <FormLabel htmlFor={field.name} className={''}>Notes (Optional)</FormLabel>
                                            <FormControl>
                                                <div className={'relative'}>
                                                    <div className={'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'}>
                                                        <MdNotes size={18} className={'text-text-700'}/>
                                                    </div>
                                                    <Textarea {...field} id={field.name} value={field.value ?? ''}
                                                              placeholder={'E.g. SIP started via app in Jan 2023 for long-term goals.\nLinked bank account changed in March 2024.'}
                                                              className={'pl-10 max-h-40'} onChange={(e) => field.onChange(e)}/>
                                                </div>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className={'flex gap-4 items-center justify-end'}>
                        <Button variant={'destructive'} type={'reset'} className={'h-10'}>Cancel</Button>
                        <LoadingButton variant={'secondary'} loading={isSubmitting} className={'h-10'}>
                            {mfSip ? <PencilIcon/> : <PlusIcon/>}
                            {mfSip ? 'Update' : 'Create'}
                        </LoadingButton>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default MFSIPForm;
