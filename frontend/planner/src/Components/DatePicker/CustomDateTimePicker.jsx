import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {alpha, useTheme} from '@mui/material';
import {CalendarToday} from '@mui/icons-material';
import {styled} from '@mui/material/styles';

const StyledDatePickerWrapper = styled('div', {
    shouldForwardProp: (prop) => prop !== 'error' && prop !== 'bgColor',
})(({ theme, error, bgColor }) => ({
    position: 'relative',
    '& .react-datepicker-wrapper': {
        width: '100%',
    },
    '& .react-datepicker__input-container': {
        width: '100%',
    },
    '& .custom-datepicker-input': {
        width: '100%',
        padding: '17.54px 14px',
        fontSize: '1rem',
        fontFamily: theme.typography.fontFamily,
        // The hardcoded color: MUI default color to match the colors.
        border: `1px solid ${error ? theme.palette.error.main : alpha('#ffffff', 0.23)}`,
        borderRadius: theme.shape.borderRadius,
        backgroundColor: bgColor ?? theme.palette.background.input,
        color: theme.palette.text.primary,
        outline: 'none',
        transition: 'border-color 0.1s ease-in-out, box-shadow 0.1s ease-in-out',
        boxShadow: '0 0 0 1px transparent',
        '&:hover': {
            borderColor: error ? theme.palette.error.main : theme.palette.text.primary,
        },
        '&:focus': {
            border: `1px solid ${error ? theme.palette.error.main : theme.palette.primary.main}`,
            boxShadow: `0 0 0 1px ${error ? theme.palette.error.main : theme.palette.primary.main}`,
        },
        '&::placeholder': {
            color: theme.palette.text.secondary,
            opacity: 1,
        },
    },
    '& .datepicker-label': {
        position: 'absolute',
        left: '14px',
        top: '50%',
        transform: 'translateY(-50%)',
        transition: 'all 0.2s ease',
        fontSize: '1rem',
        color: error ? theme.palette.error.main : theme.palette.text.secondary,
        pointerEvents: 'none',
        backgroundColor: bgColor ?? theme.palette.background.input,
        padding: '0 4px',
        zIndex: 1,
    },
    '& .helper-text': {
        color: error ? theme.palette.error.main : theme.palette.text.secondary,
        fontSize: '0.75rem',
        marginTop: '3px',
        marginRight: '14px',
        marginLeft: '14px',
        fontWeight: 400,
        lineHeight: 1.66,
        letterSpacing: '0.03333em',
        minHeight: '1.7em',
    },
    '& .label-float': {
        top: '-9px',
        left: '10px',
        transform: 'none',
        fontSize: '0.75rem',
        color: error ? theme.palette.error.main : theme.palette.text.secondary,
    },
}));


const CustomInput = React.forwardRef(({ value, onClick, error, label, placeholder }, ref) => {
    const [focused, setFocused] = React.useState(false);
    const theme = useTheme();
    const isActive = Boolean(value || focused);

    return (
        <div style={{ position: 'relative' }}>
            {label && (
                <div
                    className={`datepicker-label ${isActive ? 'label-float' : ''}`}
                    style={{
                        color: error
                            ? theme.palette.error.main
                            : focused
                                ? theme.palette.primary.main
                                : theme.palette.text.secondary,
                    }}
                >
                    {label}
                </div>
            )}
            <input
                ref={ref}
                value={value}
                onClick={onClick}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder={label && focused ? placeholder : ''}
                className="custom-datepicker-input"
                readOnly
            />
            <CalendarToday
                sx={{
                    position: 'absolute',
                    right: '30px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'text.secondary',
                    fontSize: '1.25rem',
                    pointerEvents: 'none',
                }}
            />
        </div>
    );
});

export default function CustomDateTimePicker({
                                                 label,
                                                 startDate,
                                                 endDate,
                                                 onChange,
                                                 error,
                                                 showTimeSelect = false,
                                                 showTimeSelectOnly = false,
                                                 timeIntervals,
                                                 selectsRange = false,
                                                 dateFormat,
                                                 minDate,
                                                 helperText,
                                                 bgColor,
                                                 ...props
                                             }) {
    const getPlaceholder = () => {
        if (showTimeSelectOnly) return 'Select start and end time';
        if (selectsRange) return 'Select start and end date';
        return 'Select date';
    };

    const getDateFormat = () => {
        if (dateFormat) return dateFormat;
        if (showTimeSelectOnly) return 'HH:mm';
        if (showTimeSelect) return 'MMMM d, yyyy h:mm aa';
        return 'MMMM d, yyyy';
    };

    return (
        <StyledDatePickerWrapper error={!!error} bgColor={bgColor}>

            <DatePicker
                selected={!selectsRange ? startDate : undefined}
                startDate={startDate}
                endDate={endDate}
                onChange={onChange}
                selectsRange={selectsRange}
                isClearable
                placeholderText={getPlaceholder()}
                minDate={minDate}
                showTimeSelect={showTimeSelect}
                showTimeSelectOnly={showTimeSelectOnly}
                timeIntervals={timeIntervals}
                timeCaption="Time"
                dateFormat={getDateFormat()}
                timeFormat="HH:mm"
                customInput={
                    <CustomInput
                        error={!!error}
                        label={label}
                        placeholder={getPlaceholder()}
                    />
                }
                popperPlacement="bottom-middle"
                portalId="datepicker-portal"
                {...props}
            />

            <div className="helper-text">
                {error || helperText || ' '}
            </div>
        </StyledDatePickerWrapper>
    );
}
