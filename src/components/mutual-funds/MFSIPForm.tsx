'use client';

import React from "react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {MFSIPFormValues, mfSipSchema} from "@/lib/formValidationSchemas";
import {CalendarIcon, CheckCircle, Clock, DollarSign, FileText, PlusIcon, X} from "lucide-react";
import {cn} from "@/lib/utils";
import {BiRupee} from "react-icons/bi";
import {MdNotes} from "react-icons/md";
import {LoadingButton} from "@/components/loading-button";
import {MFSIPProps} from "@/types";

function MFSIPForm({userId}: MFSIPProps) {
    const mfSipForm = useForm<MFSIPFormValues>({
        resolver: zodResolver(mfSipSchema),
        defaultValues: {
            userId,
            active: true,
            // ...other defaults
        },
    });
    const {register: register, handleSubmit, formState: {errors, isValid}} = mfSipForm;
    
    const cardHeaderClassNames = 'bg-primary-600 dark:bg-primary-900 p-4 text-primary-foreground';
    const cardBgClassNames = 'bg-card dark:bg-primary-800 p-6 space-y-5';

    const createNewMfSip = () => {
        console.log('createNewMfSip:', mfSipForm.getValues());
    }

    return (
        <div className={'max-w-4xl bg-background mx-auto p-6'}>
            <div className={'mb-8 text-center'}>
                <h2 className={'mb-2 text-2xl font-bold text-text-900 tracking-wide'}>Create New SIP/Update SIP</h2>
                <p className={'text-text-800'}>
                    Set up a systematic investment plan to grow your wealth consistently
                    <br/>
                    Update your systematic investment plan details below
                </p>
            </div>

            <Form {...mfSipForm}>
                <form onSubmit={handleSubmit(createNewMfSip)} className={'space-y-5'}>
                    {/** cards */}
                    <div className={'rounded-xl shadow-lg overflow-hidden space-y-5'}>
                        {/** Card 1: Fund Details */}
                        <div className={'rounded-xl overflow-hidden'}>
                            <div className={cardHeaderClassNames}>
                                <div className={'flex items-center gap-2'}>
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

                                {/** fund name */}
                                <FormField control={mfSipForm.control} name={'fundName'} render={({field}) => (
                                    <FormItem>
                                        <FormLabel htmlFor={field.name} className={''}>Fund name *</FormLabel>
                                        <FormControl>
                                            <Input {...field} id={field.name} value={field.value ?? ''} type={'text'} autoFocus placeholder={'Mirae Asset Mutual Fund'}
                                                   className={'uppercase'} onChange={(e) => field.onChange(e)}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}/>

                                {/** fund code */}
                                <FormField control={mfSipForm.control} name={'fundCode'} render={({field}) => (
                                    <FormItem>
                                        <FormLabel htmlFor={field.name} className={''}>Fund code (Optional)</FormLabel>
                                        <FormControl>
                                            <Input {...field} id={field.name} value={field.value ?? ''} type={'text'} placeholder={'INF769K01GU0'}
                                                   className={'uppercase'} onChange={(e) => field.onChange(e)}/>
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
                                            <Input {...field} id={field.name} value={field.value ?? ''} type={'number'} placeholder={'79943003995'}
                                                   className={''} onChange={(e) => field.onChange(e)}/>
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
                                                    <Button key={category} variant={'outline'} type={'button'} onClick={() => field.onChange(category)}
                                                            // className={cn('flex flex-1 justify-center items-center border dark:border-none border-input capitalize', field.value === category && 'bg-primary dark:bg-primary text-text-100')}>
                                                            className={cn('flex flex-1 justify-center items-center capitalize', field.value === category && 'bg-primary dark:bg-primary text-text-100 dark:text-text-900')}>
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

                        {/** Card 2: Amount & Schedule */}
                        <div className={'rounded-xl overflow-hidden'}>
                            <div className={cardHeaderClassNames}>
                                <div className={'flex items-center gap-2'}>
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
                                        <p className={'text-xs text-text-600'}>Between 1 & 31</p>
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
                                                }}/>
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
                                                <Button variant={'outline'} type={'button'} onClick={() => field.onChange(true)}
                                                        className={cn('rounded-r-none hover:bg-success border-none', field.value === true ? 'bg-success dark:bg-success' : 'bg-muted-foreground/10 text-text')}>
                                                    <CheckCircle className={'size-4 inline mr-1'}/>
                                                    Active
                                                </Button>
                                                <Button variant={'outline'} type={'button'} onClick={() => field.onChange(false)}
                                                        className={cn('rounded-l-none hover:bg-destructive border-none', field.value === false ? 'bg-destructive dark:bg-destructive ' : 'bg-muted-foreground/10 text-text')}>
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
                        <div className={'rounded-xl overflow-hidden'}>
                            <div className={cardHeaderClassNames}>
                                <div className={'flex items-center gap-2'}>
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

                    <div className={'flex gap-4 items-center justify-end'}>
                        <Button variant={'destructive'} type={'reset'} className={'h-10'}>Cancel</Button>
                        <Button variant={'default'} type={'reset'} className={'h-10'}>Create/Update</Button>
                        <LoadingButton variant={'default'} className={'flex gap-2 h-10'}>
                            <PlusIcon/>
                            Create/Update
                        </LoadingButton>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default MFSIPForm;
