import React from 'react';
import { GlobalStyles } from '@mui/material';

export default function GlobalMuiStyles() {
    return (
        <GlobalStyles
            styles={(theme) => ({
                // Datepicker
                '.react-datepicker': {
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    fontFamily: theme.typography.fontFamily,
                    fontSize: '14px',
                    borderRadius: theme.shape.borderRadius,
                    boxShadow: theme.shadows[8],
                    color: theme.palette.text.primary,
                },
                '.react-datepicker-popper': {
                    zIndex: 1500,
                },
                '.react-datepicker-wrapper': {
                    width: '100%',
                },
                '.react-datepicker__header': {
                    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100],
                    borderBottom: `1px solid ${theme.palette.divider}`,
                },
                '.react-datepicker__current-month, .react-datepicker__day-name, .react-datepicker__day': {
                    color: theme.palette.text.primary,
                },
                '.react-datepicker__day:hover': {
                    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.primary.light,
                },
                '.react-datepicker__day--selected, .react-datepicker__day--in-selecting-range, .react-datepicker__day--in-range': {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                },
                '.react-datepicker__day--disabled': {
                    color: theme.palette.text.disabled,
                },
                '.react-datepicker__time-container': {
                    borderLeft: `1px solid ${theme.palette.divider}`,
                },
                '.react-datepicker__time-box': {
                    width: '100%',
                },
                '.react-datepicker__time-list': {
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                },
                '.react-datepicker-time__header, .react-datepicker__time-list-item': {
                    color: theme.palette.text.primary,
                },
                '.react-datepicker__time-list-item:hover': {
                    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.primary.light,
                },
                '.react-datepicker__time-list-item--selected': {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                },
                '.react-datepicker__time-list-item--disabled': {
                    color: theme.palette.text.disabled,
                },
                '.react-datepicker__navigation': {
                    '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[200],
                    },
                },
                '.react-datepicker__navigation--previous': {
                    '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[200],
                    },
                },
                '.react-datepicker__navigation--next': {
                    '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[200],
                    },
                },
            })}
        />
    );
}
