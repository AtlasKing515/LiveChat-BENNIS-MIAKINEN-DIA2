import "./Button.css";

interface Props {
    children: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    fill?: boolean;
}

export default function Button({ children, onClick, disabled, fill = false }: Props) {
    return (
        <button className={`button ${fill ? 'fill' : ''}`} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    )
}