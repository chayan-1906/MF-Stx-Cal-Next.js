import {GroupBase, StylesConfig} from 'react-select';

type OptionType = {
    label: string;
    value: string;
};

interface ThemeStyles {
    isDark: boolean;
}

export const reactSelectStyles = ({isDark}: ThemeStyles): StylesConfig<OptionType, boolean, GroupBase<OptionType>> => ({
    control: (provided, state) => ({
        ...provided,
        color: isDark ? 'white' : 'black',
        backgroundColor: isDark ? 'transparent' : '#fff',
        border: `1px solid ${isDark ? 'white' : '#ccc'}`,
        cursor: state.isDisabled ? 'not-allowed' : 'pointer',
        opacity: state.isDisabled ? 0.5 : 1,
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: isDark ? '#6366F1' : '#8D93F8',
        border: `1px solid ${isDark ? 'white' : '#ccc'}`,
        zIndex: 1,
    }),
    singleValue: (provided) => ({
        ...provided,
        color: isDark ? 'white' : 'black',
    }),
    input: (provided) => ({
        ...provided,
        color: isDark ? 'white' : 'black',
    }),
    option: (provided, state) => ({
        ...provided,
        color: isDark ? 'white' : 'black',
        backgroundColor: state.isSelected
            ? isDark ? '#6366F1' : '#8D93F8'
            : state.isFocused
                ? isDark ? '#F9A8D4' : '#FAD1E8'
                : isDark ? '#6366F1' : '#8D93F8',
        cursor: 'pointer',
    }),
    placeholder: (provided) => ({
        ...provided,
        color: isDark ? '#999' : '#666',
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
