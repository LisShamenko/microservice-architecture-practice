import { useLayoutEffect } from "react";



/** Вызывает отложенную функцию после изменения размера окна. */
const useResizeTimeout = (ms: number, onUpdate: Function) => {
    let isRedraw = false;
    useLayoutEffect(() => {
        function onResize() {
            if (!isRedraw) {
                isRedraw = true;
                setTimeout(() => {
                    isRedraw = false;
                    onUpdate();
                }, ms);
            }
        }
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);
}
export default useResizeTimeout;
