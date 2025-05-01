import React from "react";
import {SIPListViewProps} from "@/types";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import CategoryBadge from "@/components/CategoryBadge";
import Link from "next/link";
import routes from "@/lib/routes";
import {PencilIcon} from "lucide-react";
import {useTheme} from "next-themes";
import {cn} from "@/lib/utils";

function SIPListView({investments}: SIPListViewProps) {
    const {resolvedTheme} = useTheme();
    const isDark = resolvedTheme === 'dark';

    return (
        <div className={'flex flex-col p-6 shadow-lg rounded-lg bg-text-100 gap-4'}>
            <Table className={''}>
                <TableHeader className={''}>
                    <TableRow className={'uppercase'}>
                        <TableHead className={'bg-accent-600'}>Scheme Name</TableHead>
                        <TableHead className={cn('bg-teal-400', 'hidden sm:flex items-center')}>Category</TableHead>
                        <TableHead className={'bg-purple-800'}>Amount</TableHead>
                        <TableHead className={' bg-rose-700'}>Day</TableHead>
                        <TableHead className={cn(' bg-slate-600', 'hidden sm:flex items-center')}>Status</TableHead>
                        <TableHead className={' bg-emerald-500 text-center'}>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {investments.map(({mfFundId, mfSipId, externalId, fundName, schemeName, folioNo, amount, dayOfMonth, active, category}, index) => (
                        <TableRow key={index} className={'text-text-900 hover:bg-primary hover:text-primary-foreground'}>
                            <TableCell className={'font-medium'}>{schemeName}</TableCell>
                            <TableCell className={'hidden sm:table-cell'}>
                                <div className={cn('items-center flex')}>
                                    <CategoryBadge category={category}/>
                                </div>
                            </TableCell>
                            <TableCell>₹{amount}</TableCell>
                            <TableCell className={''}>{dayOfMonth}</TableCell>
                            <TableCell className={'hidden sm:table-cell'}>{active ? 'Active' : 'Inactive'}</TableCell>
                            <TableCell>
                                <div className={'flex justify-center gap-2'}>
                                    <Link href={routes.updateMfSipPath(externalId)}>
                                        <PencilIcon className={'size-4 cursor-pointer'}/>
                                    </Link>
                                    {/*<Button variant={'destructive'} onClick={() => deleteMfSip(mfSipId)}>Delete</Button>*/}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default SIPListView;
