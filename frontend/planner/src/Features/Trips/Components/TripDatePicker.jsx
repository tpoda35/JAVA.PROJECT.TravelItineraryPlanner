import DatePicker from "react-datepicker";

export default function TripDatePicker({ label, startDate, endDate, onChange, error }) {
    return (
        <div>
            <label className="custom-input-label">
                {label}
            </label>
            <DatePicker
                selectsRange
                startDate={startDate}
                endDate={endDate}
                onChange={onChange}
                isClearable
                placeholderText="Select start and end date"
                className="custom-input"
                minDate={new Date()}
                dateFormat="MMMM d, yyyy"
            />
            <div className="-custom-input-error-message-container">
                <p className="custom-input-error" style={{ visibility: error ? 'visible' : 'hidden' }}>
                    {error || ' '}
                </p>
            </div>
        </div>
    );
}