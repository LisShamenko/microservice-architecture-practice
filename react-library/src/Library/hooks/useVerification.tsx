import s from './verification.module.sass';



// 
export interface IVerifyValue {
    value: string | number,
    isRequired?: boolean,
    maxlength?: number,
    regExp?: RegExp,
    regExpTextError?: string,
}



/** Возвращает набор функций валидации. */
const useVerification = () => {

    /** Проверка на null. Не допускается: `null`, `undefined`, `пустая строка`. */
    const isRequiredError = (v: IVerifyValue): boolean => {
        if (typeof v.value === 'string') {
            return v.isRequired ? (!v.value || v.value.length <= 0) : false;
        }
        return isNaN(v.value);
    }

    /** Проверка длины строки. */
    const isLengthError = (v: IVerifyValue): boolean => {
        if (typeof v.value === 'string') {
            return (v.maxlength && v.maxlength > 0)
                ? (!v.value || v.value.length > v.maxlength)
                : false;
        }
        return isNaN(v.value);
    }

    /** Проверка на соответствие регулярному выражению. */
    const isRegExpError = (v: IVerifyValue): boolean => {
        if (v.regExp && (typeof v.value === 'string')) {
            return v.regExp && !v.regExp.test(v.value);
        }
        return false;
    }

    /** Выполняет все проверки. */
    const isAllErrors = (v: IVerifyValue): boolean => {
        return isRequiredError(v) || isLengthError(v) || isRegExpError(v);
    }

    /** Выполняет все проверки и возвращает строку ошибки. */
    const getErrorText = (v: IVerifyValue): string | null => {
        if (isRequiredError(v)) return 'required';
        if (isLengthError(v)) return 'max length';
        if (isRegExpError(v)) return v.regExpTextError ? v.regExpTextError : 'template error';
        return null;
    }

    /** Выполняет все проверки и возвращает JSX с ошибкой. */
    const getErrorNode = (v: IVerifyValue) => {
        const error = getErrorText(v);
        const errorText = error ? `(${error})` : '';
        const reqText = (v.isRequired ? '*' : '');
        return (
            <abbr className={s['abbr-required']}>{errorText + reqText}</abbr>
        );
    }

    return {
        getErrorNode,
        isRequiredError, isLengthError, isRegExpError, isAllErrors,
        getErrorText,
    };
}
export default useVerification;
