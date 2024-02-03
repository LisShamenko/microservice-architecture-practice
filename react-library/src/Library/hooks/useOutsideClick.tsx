import { RefObject, SetStateAction, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";



/**
 * Управляет выпадающим меню. Возвращает ссылку `useRef<HTMLDivElement>`, \
 * которая позволяет скрывать меню при нажатии на пустую область.
 * ___
 * @returns {Array}
 * - `ref` - Ссылка на элемент `HTMLDivElement`.
 * - `isDropdown` - Флаг для отображения выпадающей области.
 * - `setDropdown` - Устанавливает состояние флага.
 */
const useOutsideClick = (
    initDropdown: boolean,
    // onOutsideClick?: () => void,
): [RefObject<HTMLDivElement>, boolean, (value: SetStateAction<boolean>) => void] => {

    const [isDropdown, setDropdown] = useState(initDropdown);
    const ref = useRef<HTMLDivElement>(null);

    const handleClick = useCallback((ev: MouseEvent) => {
        const element = ref.current;
        if (element && !element.contains(ev.target as Node)) {
            setDropdown(false);
            // if (onOutsideClick) onOutsideClick();
        }
    }, [setDropdown])

    useEffect(() => {
        if (isDropdown) {
            window.addEventListener("mouseup", handleClick);
        }
        else {
            window.removeEventListener("mouseup", handleClick);
        }
        return () => {
            window.removeEventListener("mouseup", handleClick);
        }
    }, [isDropdown, handleClick])

    return [ref, isDropdown, setDropdown];
}
export default useOutsideClick;
