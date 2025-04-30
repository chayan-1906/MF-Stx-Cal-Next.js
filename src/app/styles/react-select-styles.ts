import {GroupBase, StylesConfig} from 'react-select';
import {ReactSelectOptionType} from "@/types";

interface ThemeStyles {
    isDark: boolean;
}

export const reactSelectStyles = ({isDark}: ThemeStyles): StylesConfig<ReactSelectOptionType, false, GroupBase<ReactSelectOptionType>> => ({
    control: (provided, state) => ({
        ...provided,
        // color: isDark ? 'green' : 'red',
        backgroundColor: 'transparent',
        border: `1.5px solid ${isDark ? '#8D93F8' : '#6366F1'}`,
        cursor: state.isDisabled ? 'not-allowed' : 'pointer',
        opacity: state.isDisabled ? 0.5 : 1,
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: isDark ? '#343962' : '#C7D2FE',
        border: `1px solid ${isDark ? '#A5AAF9' : '#818CF8'}`,
        zIndex: 1,
    }),
    singleValue: (provided) => ({
        ...provided,
        color: isDark ? '#E4E9F1' : '#0A1015',
    }),
    input: (provided) => ({
        ...provided,
        color: isDark ? '#E4E9F1' : '#0A1015',
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected
            ? isDark ? '#1B1F31' : '#6366F1'
            : state.isFocused
                ? isDark ? '#6D74C6' : '#818CF8'
                : isDark ? '#343962' : '#C7D2FE',
        color: isDark ? '#E4E9F1' : state.isFocused || state.isSelected ? '#E4E9F1' : '#0A1015',
        cursor: 'pointer',
    }),
    placeholder: (provided) => ({
        ...provided,
        color: '#4A5B73',
    }),
    multiValue: (styles) => ({
        ...styles,
        backgroundColor: isDark ? '#444' : '#e0e0e0',
    }),
    multiValueLabel: (styles) => ({
        ...styles,
        color: isDark ? 'white' : 'black',
    }),
});
