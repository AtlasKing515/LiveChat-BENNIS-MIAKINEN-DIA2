interface Props {
    name: string;
}

export default function Icon({ name }: Props) {
    return <i className={`material-symbols-rounded`}>{name}</i>;
}