require ("./warning.css");

export const Warning = ({text}) => {
    return (
        <div className="warningRed">
            {text}
        </div>
    )
}