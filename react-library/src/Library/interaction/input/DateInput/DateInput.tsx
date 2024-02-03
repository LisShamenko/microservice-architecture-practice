import { useState } from "react";
//
import { Calendar } from "../../../widget/datetime/Calendar/Calendar";
import { ConfirmDropInput } from "../../../layout/wrapper/ConfirmDropInput/ConfirmDropInput";



// 
export interface IPropsDateInput {
    cs?: string,
    name: string,
    label?: string,
    dateValue: number,
    setDateValue: (value: number) => void,
    onSelectDate?: (date: number) => void,
}

export const DateInput = (
    {
        cs = '', name, label,
        dateValue, setDateValue, onSelectDate,
    }: IPropsDateInput
): JSX.Element => {

    //
    const [oldDate, setOldDate] = useState(dateValue);
    const getDate = () => {
        return new Date(dateValue).toString();
    }

    // 
    const onShowInput = () => {
        setOldDate(dateValue);
    }
    const onCloseInput = () => {
        setDateValue(oldDate);
    }
    const onApproveInput = () => {
        setOldDate(dateValue);
        if (onSelectDate) onSelectDate(dateValue);
    }
    const onOutsideClick = () => {
        setDateValue(oldDate);
    }

    return (
        <ConfirmDropInput base={{ cs: { root: cs }, name: name, label: label }}
            valueFormat={getDate}
            onShowInput={onShowInput}
            onCloseInput={onCloseInput}
            onApproveInput={onApproveInput}
            onOutsideClick={onOutsideClick}
        >
            <Calendar value={dateValue} onSetValue={setDateValue} />
        </ConfirmDropInput>
    );
}
