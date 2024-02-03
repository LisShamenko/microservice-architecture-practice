//
import s from './dual-list.module.sass';



// 
interface IPropsOptionItem {
    cs?: string,
    index: number,
    label: string,
    isSelected: boolean,
    onSelectOption?: (index: number) => void,
}

export const OptionItem = (
    {
        cs = '', index, label,
        isSelected, onSelectOption,
    }: IPropsOptionItem
): JSX.Element => {

    // 
    const onClick = () => {
        if (onSelectOption) onSelectOption(index);
    }

    // 
    const getStyle = () => {
        const customClass: string[] = [cs, s['item']];
        if (isSelected) customClass.push(s['is-selected']);
        return customClass.join(' ');
    }

    return (
        <li>
            <div className={getStyle()} tabIndex={0} onClick={onClick}>
                <span className={s['item-text']}>
                    <span>{label}</span>
                </span>
            </div>
        </li>
    );
}
