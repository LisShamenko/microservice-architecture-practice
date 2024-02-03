import { ChangeEvent, ChangeEventHandler, SetStateAction, useState } from "react";



// 
export type ChangeFunc = ChangeEventHandler<HTMLInputElement>;

const useInputState = <T,>(
    initValue: T,
): [T, ChangeFunc, (value: SetStateAction<T>) => void] => {

    const [value, setValue] = useState<T>(initValue);
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value as T);
    }

    return [value, onChange, setValue];
}
export default useInputState;
