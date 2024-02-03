import { useEffect, useState } from 'react';
//
import s from './calendar.module.sass';
import { RowSelector } from '../RowSelector/RowSelector';



// 
const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

interface IDays {
    before: number,
    count: number,
    after: number,
}



// 
interface IPropsCalendar {
    cs?: string,
    value: number,
    onSetValue: (value: number) => void,
}

export const Calendar = (
    {
        cs = '', value, onSetValue,
    }: IPropsCalendar
): JSX.Element => {

    const curDate = new Date(value);
    const [year, setYear] = useState(curDate.getFullYear());
    const [month, setMonth] = useState(curDate.getMonth());
    const [day, setDay] = useState(curDate.getDate());

    // 
    const getDaysByMonths = () => {
        return Array
            .from<number, number>({ length: 12 }, (v, i) => i)
            .reduce<IDays[]>((p, m) => {
                const count: number = new Date(year, m + 1, 0).getDate();
                const offset = (m === 0) ? 0 : (p[m - 1].after % 7);
                const sum = count + offset;
                const after = 42 - sum;
                // const rows = Math.floor(sum / 7);
                // const cell = sum % 7;
                return [...p, { before: offset, count: offset + count, after: after }];
            }, [])
    }

    const [daysByMonths, setDaysByMonths] = useState<IDays[]>(
        Array.from<number, IDays>({ length: 12 }, (v, i) => ({ before: 0, count: 0, after: 0 }))
    );
    useEffect(() => setDaysByMonths(getDaysByMonths()), [year]);

    // 
    const onPrevYear = () => {
        setCellIndex(-1);
        setYear(year - 1);
        setMonth(0);
    }
    const onNextYear = () => {
        setCellIndex(-1);
        setYear(year + 1);
        setMonth(0);
    }

    // 
    const onPrevMonth = () => {
        setCellIndex(-1);
        const m = month - 1;
        if (m >= 0) return setMonth(m);
        setYear(year - 1);
        setMonth(11);
    }
    const onNextMonth = () => {
        setCellIndex(-1);
        const m = month + 1;
        if (m < 12) return setMonth(m);
        setYear(year + 1);
        setMonth(0);
    }

    // 
    const [cellIndex, setCellIndex] = useState(-1);
    useEffect(() => {
        //      setYear(curDate.getFullYear());
        //      setMonth(curDate.getMonth());
        //      setDay(curDate.getDate());
        const result = getDaysByMonths();
        setDaysByMonths(result);
        setCellIndex(result[month].before + day - 1);
    }, []);
    const cells = Array.from({ length: 42 }, (v, i) => i);
    const onClickCell = (index: number) => {
        if (index >= daysByMonths[month].before && index < (daysByMonths[month].count)) {
            setCellIndex(index);
            const newDay = (index - daysByMonths[month].before) + 1;
            setDay(newDay);
            onSetValue(new Date(year, month, newDay).valueOf());
        }
    }

    const getDayByIndex = (index: number) => {
        if (index < daysByMonths[month].before) {
            const prevCount = daysByMonths[month - 1].count - daysByMonths[month - 1].before;
            return { pos: -1, day: (prevCount - daysByMonths[month].before + 1) + index }
        }
        if (index < daysByMonths[month].count) {
            return { pos: 0, day: (index - daysByMonths[month].before) + 1 }
        }
        return { pos: 1, day: (index - daysByMonths[month].count) + 1 }
    }

    // 
    const getStyle = () => {
        return cs + ' ' + s['calendar'];
    }
    const getHeaderStyle = (index: number) => {
        const customClass: string[] = [s['grid-cell']];
        if (index < 5) customClass.push(s['is-header-weekday']);
        else customClass.push(s['is-header-weekend']);
        return customClass.join(' ');

    }
    const getCellStyle = (index: number, pos: number) => {
        const customClass: string[] = [s['grid-cell']];
        if (index === cellIndex) customClass.push(s['is-select']);
        else if (pos === 0) customClass.push(s['is-primary']);
        else customClass.push(s['is-secondary']);
        return customClass.join(' ');
    }

    return (
        <div className={getStyle()}>
            <div className={s['date-container']}>
                <RowSelector cs={s['month-title']}
                    onClickPrev={onPrevMonth} onClickNext={onNextMonth}>
                    {months[month]}
                </RowSelector>
                <div className={s['day-title']}>
                    {day}
                </div>
                <RowSelector cs={s['year-title']}
                    onClickPrev={onPrevYear} onClickNext={onNextYear}>
                    {year}
                </RowSelector>
            </div>

            <div className={s['divider']}></div>

            <div className={s['date-grid'] + ' ' + s['is-header']}>
                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((v, i) => (
                    <div key={i} className={getHeaderStyle(i)}>
                        {v}
                    </div>
                ))}
            </div>

            <div className={s['date-grid']}>
                {cells && cells.map(i => {
                    const day = getDayByIndex(i);
                    return (
                        <div key={i} className={getCellStyle(i, day.pos)} onClick={() => onClickCell(i)}>
                            {day.day}
                            {/* {Math.floor(i / 7)}-{i % 7} */}
                            {/* {days[curDate.getDay()] + ' ' + curDate.getDate()} */}
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
