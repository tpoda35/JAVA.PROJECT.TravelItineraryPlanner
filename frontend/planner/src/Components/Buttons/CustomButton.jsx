
export default function CustomButton({text, className = "", type = "submit", disabled = false}) {
    return (
        <button className={className} type={type} disabled={disabled}>
            {text}
        </button>
    );
}