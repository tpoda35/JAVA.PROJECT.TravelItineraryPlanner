import CustomModal from "../../../../Components/Modals/CustomModal.jsx";
import CustomInput from "../../../../Components/Input/CustomInput.jsx";
import {useTripPlannerContext} from "../Contexts/TripPlannerContext.js";
import CustomDateTimePicker from "../../../../Components/DatePicker/CustomDateTimePicker.jsx";

export default function TripPlannerModals() {
    const props = useTripPlannerContext();

    return (
        <CustomModal
            isOpen={props.showAddActivityModal}
            onClose={() => {
                props.setShowActivityModal(false);
                props.setError(null);
                props.resetActivityData();
            }}
            onConfirm={props.handleSubmit}
            title="Add activity"
            confirmText="Add"
            confirmButtonClass="btn-success"
        >
            <CustomInput
                label="Activity title"
                name="title"
                placeholder="Enter activity title"
                onChange={props.handleInputChange}
                error={props.formErrors.title}
                autoFocus
            />
            <CustomDateTimePicker
                label="Start Time"
                startDate={props.formData.startDate}
                onChange={(time) => props.handleTimeChange([time, props.formData.endDate])}
                error={props.formErrors.startTime}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={5}
            />
            <CustomDateTimePicker
                label="End Time"
                startDate={props.formData.endDate}
                onChange={(time) => props.handleTimeChange([props.formData.startDate, time])}
                error={props.formErrors.endTime}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={5}
            />
        </CustomModal>
    );
}
