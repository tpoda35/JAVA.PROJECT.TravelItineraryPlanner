
export default function CustomButton({
                                         text = "",
                                         className = "",
                                         type = "submit",
                                         disabled = false,
                                         onClick = null,
                                         title = ""
}) {
    return (
        <button className={className} type={type} disabled={disabled} onClick={onClick} title={title}>
            {text}
        </button>
    );
}