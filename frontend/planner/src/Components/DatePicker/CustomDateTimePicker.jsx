import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
                                             }) {
    return (
        <div>
            <label className="custom-input-label">{label}</label>
            <DatePicker
                selected={!selectsRange ? startDate : undefined}
                startDate={startDate}
                endDate={endDate}
                onChange={onChange}
                selectsRange={selectsRange}
                isClearable
                placeholderText={
                    showTimeSelectOnly
                        ? 'Select start and end time'
                        : selectsRange
                            ? 'Select start and end date'
                            : 'Select date'
                }
                className={`custom-input ${error ? 'error' : ''}`}
                minDate={minDate}
                showTimeSelect={showTimeSelect}
                showTimeSelectOnly={showTimeSelectOnly}
                timeIntervals={timeIntervals}
                timeCaption="Time"
                dateFormat={
                    dateFormat ||
                    (showTimeSelectOnly
                        ? 'HH:mm'
                        : showTimeSelect
                            ? 'MMMM d, yyyy h:mm aa'
                            : 'MMMM d, yyyy')
                }
                timeFormat="HH:mm"
            />
            <div className="custom-input-error-message-container">
                <p
                    className="custom-input-error"
                    style={{ visibility: error ? 'visible' : 'hidden' }}
                >
                    {error || ' '}
                </p>
            </div>
        </div>
    );
}
