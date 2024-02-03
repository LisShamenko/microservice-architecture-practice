// 
import s from './data-element.module.sass';
import { Slider } from '../../../interaction/input/Slider/Slider';
import { MetaData, OffsetPadding, IMetaLabel, IMetaSlider, DataType } from './types';
import { HandPosition } from '../../../interaction/input/Slider/types';



// 
interface IPropsDataElement {
    value?: string | number | boolean,
    meta: MetaData,
    rowPos: number,
    cellPos: number,
    offsetPadding: OffsetPadding,
}

export const DataElement = (
    {
        value, meta, rowPos, cellPos, offsetPadding,
    }: IPropsDataElement
): JSX.Element => {

    // 
    const getLabel = (meta: IMetaLabel) => {
        let labelValue = value;
        if (labelValue === undefined) {
            if (meta.defValue === undefined) labelValue = '';
            else labelValue = meta.defValue;
        }
        return (
            <span className={s[offsetPadding]}>
                {`${labelValue}`}
            </span>
        );
    }

    const getSlider = (meta: IMetaSlider) => {
        const sliderValue = (typeof value === 'number')
            ? value : Math.floor((meta.max - meta.min) / 2);

        return (
            <Slider cs={s[OffsetPadding.squareButton]}
                handPosition={rowPos === 0 ? HandPosition.bottom : HandPosition.top}
                name="t1" min={meta.min} max={meta.max} value={sliderValue}
                onChangeValue={(v, s, e) => console.log(`v:${v}, s:${s}, e:${e}`)}
            />
        );
    }

    // 
    const getElement = () => {
        switch (meta.type) {
            case DataType.label: return getLabel(meta);
            case DataType.slider: return getSlider(meta);
        }
    }

    return (<>
        {getElement()}
    </>);
}
