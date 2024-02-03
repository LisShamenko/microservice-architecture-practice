import { ChangeEvent, useState } from 'react';
//
import s from './slider.module.sass';
import { Label } from '../Label/Label';
import { ScaleFontSize, HandPosition } from './types';



// 
interface IPropsSlider {
    cs?: string,
    // 
    min?: number,
    max?: number,
    scaleLength?: number,
    scaleFontSize?: ScaleFontSize,
    //
    name: string,
    label?: string,
    value?: number,
    onChangeValue?: (value: number, start?: number, end?: number) => void,
    //
    isValueScale?: boolean,
    isTwoSide?: boolean,
    handPosition?: HandPosition,
    //
    readonly?: boolean,
    disabled?: boolean,
}

export const Slider = (
    {
        cs = '',
        min = 0, max = 100,
        scaleLength = 10, scaleFontSize = ScaleFontSize.medium,
        name, label = '', value = 0, onChangeValue,
        isValueScale = false, isTwoSide = false, handPosition = HandPosition.top,
        readonly, disabled,
    }: IPropsSlider
): JSX.Element => {

    const [sliderValue, setSliderValue] = useState<number>(value);
    const [startValue, setStartValue] = useState<number>(isTwoSide ? value : min);
    const [endValue, setEndValue] = useState<number>(isTwoSide ? max : value);
    const [moveSide, setMoveSide] = useState(-1);

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = Number.parseInt(e.target.value);

        let newStart = startValue, newEnd = endValue;
        if (isTwoSide) {
            const dif = Math.abs(endValue - startValue);
            const half = dif / 2;

            if (dif <= 1 || moveSide === 0) {
                if (newValue === startValue || newValue === endValue) {
                    newStart = newValue;
                    newEnd = newValue;
                    setMoveSide(0);
                }
                else if (newValue > endValue) {
                    newEnd = newValue;
                    setMoveSide(1);
                }
                else if (newValue < startValue) {
                    newStart = newValue;
                    setMoveSide(-1);
                }
            }
            else if (moveSide < 0) {
                if (newValue > startValue + half) {
                    newEnd = newValue;
                    setMoveSide(1);
                }
                else {
                    newStart = newValue;
                }
            }
            else {
                if (newValue < endValue - half) {
                    newStart = newValue;
                    setMoveSide(-1);
                }
                else {
                    newEnd = newValue;
                }
            }
        }
        else {
            newEnd = newValue;
        }

        //
        setSliderValue(newValue);
        setStartValue(newStart);
        setEndValue(newEnd);
        if (onChangeValue) onChangeValue(newValue, newStart, newEnd);
    }

    // 
    const getValueScale = () => {
        const sum = (max - min) / (scaleLength);
        return Array.from({ length: scaleLength + 1 }, (v, i) => (
            <span key={i} className={s['range-tick']}>
                <span className={s[`tick-text-${scaleFontSize}`]}>
                    {min + Math.floor(i * sum)}
                </span>
            </span>
        ));
    }

    // 
    const getStyle = () => {
        return cs + ' ' + s['slider'];
    }
    const getContainerStyle = () => {
        const customClass: string[] = [s['slider-container']];
        if (isValueScale) customClass.push(s['is-value-scale']);
        return customClass.join(' ');
    }
    const getFillStyle = () => {
        const sum = max - min;
        const oneProc = sum / 100;
        const leftProcent = (startValue - min) / oneProc;
        const widthProcent = (endValue - min) / oneProc;

        const widthHandler = isValueScale ? 2.5 : 1;
        const firstOffset = 0 - (widthHandler * (startValue - min) / sum);
        const secondOffset = 1 - (widthHandler * (endValue - min) / sum);

        const inputMargin = isValueScale ? 0.75 : 0;
        const leftOffset = firstOffset + inputMargin;
        const widthOffset = secondOffset - firstOffset;

        return {
            left: `calc(${leftProcent}% + ${leftOffset}rem)`,
            width: `calc(${widthProcent - leftProcent}% + ${widthOffset}rem)`,
        };
    }

    return (
        <div className={getStyle()}>
            {label && (
                <Label name={name} label={label} />
            )}

            <div className={getContainerStyle()}>
                {!isValueScale && (
                    <span className={s['value'] + ' ' + s['left-value']}>{min}</span>
                )}
                <span className={s['range']}>
                    <input className={s['range-input']}
                        id={`id_${name}`} name={name} type="range"
                        min={min} max={max} value={sliderValue} onChange={onChange}
                    />

                    {isValueScale && (
                        <div className={s['range-background']}>
                            <div className={s['range-ticks']}>
                                {getValueScale()}
                            </div>
                        </div>
                    )}

                    <span className={s['range-fill']} style={getFillStyle()}>
                        {isTwoSide && (
                            <output className={s['range-hand'] + ' ' + s['hand-start']}>
                                <span className={isValueScale ? '' : (s['tooltip-hand'] + ' ' + s['hand-left'] + ' ' + s[handPosition])}>{startValue}</span>
                            </output>
                        )}
                        <output className={s['range-hand'] + ' ' + s['hand-end']}>
                            <span className={isValueScale ? '' : s['tooltip-hand'] + ' ' + (isTwoSide ? s['hand-right'] : s['hand-center']) + ' ' + s[handPosition]}>{endValue}</span>
                        </output>
                    </span>
                </span>

                {!isValueScale && (
                    <span className={s['value'] + ' ' + s['right-value']}>{max}</span>
                )}
            </div>
        </div>
    );
}
