import "./TextField.css";

interface Props {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    placeholder?: string;
    minLength?: number;
    maxLength?: number;
    autofocus?: boolean;
}

export default function TextField({ value, onChange, onKeyDown, placeholder, minLength, maxLength, autofocus }: Props) {
    return (
        <div className="prompt-textfield">
            <input className="prompt-input-content" type="text" value={value} onKeyDown={onKeyDown} onChange={onChange} placeholder={placeholder} minLength={minLength} maxLength={maxLength} autoFocus={autofocus} />
        </div>
    )
}