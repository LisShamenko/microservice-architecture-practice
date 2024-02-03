//
import s from "./text-input.module.sass";
import { BaseInput, IPropsBaseInput } from "../BaseInput/BaseInput";
import { InputType } from "../BaseInput/types";



// 
interface IPropsTextInput {
    inputType: InputType,
    children: IPropsBaseInput,
}

export const TextInput = (
    {
        inputType, children,
    }: IPropsTextInput
): JSX.Element => {

    const base = children;

    // 
    if (inputType === InputType.hidden) {
        return (
            <BaseInput cs={{ root: s['hidden-display-none'] }} type={InputType.hidden}
                name={base.name} value={base.value}
            />
        );
    }

    // 
    const getRegex = () => {
        switch (inputType) {
            case InputType.custom: return {
                regExp: base.regExp,
                regExpTextError: base.regExpTextError,
            }
            case InputType.email: return {
                regExp: new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}'),
                regExpTextError: "wrong email",
            }
            //      case InputType.number:
            //      case InputType.password:
            case InputType.tel: return {
                regExp: /^[\+]?[(]?[0-9]{1}[)]?[\s]?[0-9]{3}[-\s]?[0-9]{3}[-]?[0-9]{2}[-]?[0-9]{2}$/,
                regExpTextError: "wrong telephone",
            }
            //      case InputType.text:
            case InputType.url: return {
                regExp: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,
                regExpTextError: "wrong URL",
            }
        }
        return { regExp: undefined, regExpTextError: undefined };
    }

    return (
        <BaseInput type={inputType} {...base} {...getRegex()} />
    );
}
