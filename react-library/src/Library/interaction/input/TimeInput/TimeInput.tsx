import { useState } from "react";
//
import { ConfirmDropInput } from "../../../layout/wrapper/ConfirmDropInput/ConfirmDropInput";
import { ClockFace } from "../../../widget/datetime/ClockFace/ClockFace";



// 
interface IPropsTimeInput {
    cs?: string,
    name: string,
    label?: string,
    onSelectTime?: (hours: number, minutes: number) => void,
}

export const TimeInput = (
    {
        cs = '', name, label, onSelectTime,
    }: IPropsTimeInput
): JSX.Element => {

    // 
    const [hours, setHours] = useState<number>(0);
    const [minutes, setMinutes] = useState<number>(0);
    const [oldHours, setOldHours] = useState<number>(0);
    const [oldMinutes, setOldMinutes] = useState<number>(0);

    const getPart = (part: number) => {
        if (part < 0) return '00';
        if (part < 10) return `0${part}`;
        return part;
    }
    const getClockFace = () => {
        return `${getPart(hours)}:${getPart(minutes)}`;
    }

    // 
    const onShowInput = () => {
        setOldHours(hours);
        setOldMinutes(minutes);
    }
    const onCloseInput = () => {
        setHours(oldHours);
        setMinutes(oldMinutes);
    }
    const onApproveInput = () => {
        if (onSelectTime) onSelectTime(hours, minutes);
    }

    return (
        <ConfirmDropInput base={{ cs: { root: cs }, name: name, label: label }}
            valueFormat={getClockFace}
            onShowInput={onShowInput}
            onCloseInput={onCloseInput}
            onApproveInput={onApproveInput}
        >
            <ClockFace mode="hours" value={hours} onSetValue={setHours} />
            <ClockFace mode="minutes" value={minutes} onSetValue={setMinutes} />
        </ConfirmDropInput>
    );
}
