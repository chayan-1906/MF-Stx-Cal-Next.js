import {useEffect, useState} from "react";
import AsyncSelect from "react-select/async";
import {components, ControlProps, GroupBase} from "react-select";
import useMfFunds from "../lib/hooks/useMfFunds";
import {reactSelectStyles} from "@/app/styles/react-select-styles";
import {useTheme} from "next-themes";
import {MFFundsSelectProps, ReactSelectOptionType} from "@/types";

const Control = ({children, ...props}: ControlProps<ReactSelectOptionType, false, GroupBase<ReactSelectOptionType>>) => {
    return (
        <components.Control {...props}>
            {children}
        </components.Control>
    );
};

function MFFundsSelect({value, onChange}: MFFundsSelectProps) {
    const {fetchAllMfFunds} = useMfFunds();
    const {resolvedTheme} = useTheme();
    const [mfFunds, setMfFunds] = useState<ReactSelectOptionType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [hydrated, setHydrated] = useState<boolean>(false);

    const getAllMfFunds = async () => {
        try {
            setLoading(true);
            const mfFunds = await fetchAllMfFunds('');
            if (!mfFunds) return;
            const formattedMfFunds = mfFunds.map((mfFund) => ({
                value: mfFund.mfFundId || '',
                label: `${mfFund.schemeName} (${mfFund.folioNo})`,
            }));
            setMfFunds(formattedMfFunds);
        } catch (e) {
            console.error('inside catch of getAllMfFunds:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setHydrated(true);
    }, []);

    if (!hydrated) {
        return null;
    }

    return (
        <div>
            <AsyncSelect
                value={value}
                onFocus={getAllMfFunds}
                defaultOptions={mfFunds}
                cacheOptions
                isClearable
                backspaceRemovesValue
                components={{Control}}
                placeholder="Search for funds..."
                isLoading={loading}
                loadingMessage={() => 'Fetching funds...'}
                noOptionsMessage={() => (loading ? 'Fetching funds...' : 'No funds found')}
                onChange={onChange}
                styles={reactSelectStyles({isDark: resolvedTheme === 'dark'})}
            />
        </div>
    );
}

export default MFFundsSelect;
