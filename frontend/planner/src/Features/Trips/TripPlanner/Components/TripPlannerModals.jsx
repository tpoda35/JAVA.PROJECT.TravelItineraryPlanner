import CustomModal from "../../../../Components/Modals/CustomModal.jsx";
import CustomInput from "../../../../Components/Input/CustomInput.jsx";
import {useTripPlannerContext} from "../Contexts/TripPlannerContext.js";
import CustomDateTimePicker from "../../../../Components/DatePicker/CustomDateTimePicker.jsx";

export default function TripPlannerModals() {
    const props = useTripPlannerContext();

    return (
        <>
            {/* Add activity CustomModal */}
            <CustomModal
                isOpen={props.showAddActivityModal}
                onClose={() => {
                    props.setShowActivityModal(false);
                    props.setError(null);
                }}
                // onConfirm={props.handleCreateFolder}
                title="Add activity"
                confirmText="Add"
                confirmButtonClass="btn-success"
            >
                <CustomInput
                    label="Activity title"
                    onChange={(e) => {
                        props.setActivityData(e.target.value);
                        props.setError(null);
                    }}
                    placeholder="Enter activity title"
                    error={props.error}
                    autoFocus
                />
                <CustomDateTimePicker
                    label="Start Time"
                    startDate={props.activityData.startDate}
                    // We need the two values, because we only want to change one time at a time,
                    // and we want to keep the other value as it is.
                    onChange={(time) => props.handleTimeChange([time, props.activityData.endDate])}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={5}
                />
                <CustomDateTimePicker
                    label="End Time"
                    startDate={props.activityData.endDate}
                    // We need the two values, because we only want to change one time at a time.
                    // and we want to keep the other value as it is.
                    onChange={(time) => props.handleTimeChange([props.activityData.startDate, time])}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={5}
                />

                {/*<CustomDatePicker*/}
                {/*    label="Activity date"*/}
                {/*    startDate={props.activityData.startDate }*/}
                {/*    endDate={props.activityData.endDate}*/}
                {/*    timeIntervals={5}*/}
                {/*    // onChange={creation.handleDateChange}*/}
                {/*    // error={creation.formErrors.dates} form error*/}
                {/*/>*/}
            </CustomModal>
        </>
    )
}