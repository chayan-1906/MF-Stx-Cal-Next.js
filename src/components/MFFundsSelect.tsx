import {useEffect, useState} from "react";
import AsyncSelect from "react-select/async";
import {components, ControlProps, GroupBase, OptionsOrGroups} from "react-select";
import useMfFunds from "../lib/hooks/useMfFunds";
import {reactSelectStyles} from "@/app/styles/react-select-styles";
import {useTheme} from "next-themes";
import {MFFundsSelectProps, ReactSelectOptionType} from "@/types";
import {MFFund} from "@/models/MFFund";

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
        setLoading(true);
        try {
            const rawFunds = await fetchAllMfFunds('');

            const formatted = (rawFunds ?? []).map((mfFund) => ({
                value: mfFund,
                label: `${mfFund.schemeName} (${mfFund.folioNo})`,
            }));
            setMfFunds(formatted);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    }

    const searchMfFunds = async (inputValue: string): Promise<OptionsOrGroups<ReactSelectOptionType, GroupBase<ReactSelectOptionType>>> => {
        setLoading(true);
        try {
            const rawFunds = await fetchAllMfFunds(inputValue);

            const formatted = (rawFunds ?? []).map((mfFund) => ({
                value: mfFund,
                label: `${mfFund.schemeName} (${mfFund.folioNo})`,
            }));

            setMfFunds(formatted);
            return formatted;
        } catch (err) {
            console.error('Fetch error:', err);
            return [];
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setHydrated(true);
    }, []);

    const selectedOption = mfFunds.find((opt) => opt.value.mfFundId === value) || null;

    if (!hydrated) {
        return null;
    }

    return (
        <div>
            <AsyncSelect
                value={selectedOption}
                onFocus={getAllMfFunds}
                loadOptions={searchMfFunds}
                defaultOptions={mfFunds}
                cacheOptions
                isClearable
                backspaceRemovesValue
                components={{Control}}
                placeholder={'Search for funds...'}
                isLoading={loading}
                loadingMessage={() => 'Fetching funds...'}
                noOptionsMessage={() => (loading ? 'Fetching funds...' : 'No funds found')}
                onChange={(opt) => onChange(opt?.value ?? null)}
                styles={reactSelectStyles({isDark: resolvedTheme === 'dark'})}
            />
        </div>
    );
}

export default MFFundsSelect;
