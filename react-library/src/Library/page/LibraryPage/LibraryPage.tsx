import { useState } from "react";
//
import s from "./library-page.module.sass";
import getSizing from "../../utils/getSizing";
import useInputState from "../../hooks/useInputState";
import { CardLayout } from "../../layout/template/CardLayout/CardLayout";
import { FlexLayout } from "../../layout/template/FlexLayout/FlexLayout";
import { Separator } from "../../visualization/element/Separator/Separator";
import { CheckboxButton } from "../../interaction/button/CheckboxButton/CheckboxButton";
import { ToggleButton } from "../../interaction/button/ToggleButton/ToggleButton";
import { ButtonMenu } from "../../layout/wrapper/ButtonMenu/ButtonMenu";
import { CircularMenu } from "../../layout/wrapper/CircularMenu/CircularMenu";
import { ButtonMenuAlignment } from "../../layout/wrapper/DropdownLayout/DropdownLayout";
import { ButtonGroup, IGroupItem } from "../../layout/wrapper/ButtonGroup/ButtonGroup";
import { AccordionLayout, IAccordionItem } from "../../layout/wrapper/AccordionLayout/AccordionLayout";
import { TabLayout } from "../../layout/wrapper/TabLayout/TabLayout";
import { FormLayout } from "../../layout/template/FormLayout/FormLayout";
import { TextInput } from "../../interaction/input/TextInput/TextInput";
import { Search } from "../../widget/searcher/Search";
import { CheckboxGroup } from "../../interaction/input/Checkbox/CheckboxGroup";
import { SelectInput } from "../../interaction/input/SelectInput/SelectInput";
import { ComboInput } from "../../interaction/input/ComboInput/ComboInput";
import { DateInput } from "../../interaction/input/DateInput/DateInput";
import { TimeInput } from "../../interaction/input/TimeInput/TimeInput";
import { ConfirmDropInput } from "../../layout/wrapper/ConfirmDropInput/ConfirmDropInput";
import { FileInput } from "../../interaction/input/FileInput/FileInput";
import { TextareaInput } from "../../interaction/input/TextareaInput/TextareaInput";
import { DualList, IOptionItem } from "../../interaction/input/DualList/DualList";
import { ObjectLiteral } from "../../widget/table/Table.type";
import { SlidingSidesLayout } from "../../layout/template/SlidingSidesLayout/SlidingSidesLayout";
import { JustButton } from "../../interaction/button/JustButton/JustButton";
import { IButtonVariant, IButtonMode, IIconOffset } from "../../interaction/button/JustButton/types";
import { PathIndicator } from "../../interaction/button/PathIndicator/PathIndicator";
import { PathType } from "../../interaction/button/PathIndicator/types";
import { StepsIndicator } from "../../interaction/button/StepsIndicator/StepsIndicator";
import { StepType } from "../../interaction/button/StepsIndicator/types";
import { InputType } from "../../interaction/input/BaseInput/types";
import { Checkbox } from "../../interaction/input/Checkbox/Checkbox";
import { CheckModeEnum } from "../../interaction/input/Checkbox/types";
import { Slider } from "../../interaction/input/Slider/Slider";
import { ScaleFontSize } from "../../interaction/input/Slider/types";
import { GridLayout } from "../../layout/template/GridLayout/GridLayout";
import { GridAlign, CellAlign, GapSpace, ColumnRange, RowRange } from "../../layout/template/GridLayout/types";
import { Size } from "../../utils/types";
import { Spinner } from "../../visualization/element/Spinner/Spinner";
import { SpinnerSize } from "../../visualization/element/Spinner/types";
import { Tag } from "../../visualization/element/Tag/Tag";
import { TagVariant, TagMode } from "../../visualization/element/Tag/types";
import { IconPosition } from "../../visualization/image/ChildIcon/types";
import { FigureIcon } from "../../visualization/image/FigureIcon/FigureIcon";
import { IFigureColor, IFigureBorder } from "../../visualization/image/FigureIcon/types";
import { IconSize, IconsEnum } from "../../visualization/image/Icon/types";
import { DataTableColumn, DataTable } from "../../widget/table/DataTable/DataTable";
import { ColumnType } from "../../widget/table/DataTable/types";
// import { HeaderLayout, ICategoryItem, IListItem } from "./layout/template/HeaderLayout/HeaderLayout";



// // 
// const l1: IListItem = {
//     to: '',
//     href: 'https://api.slack.com',
//     target: '_self',
//     title: 'Slack',
// }
// const a1: ICategoryItem[] = [
//     {
//         title: 'category I', isSeparator: false,
//         list: [
//             { ...l1, title: 'Platform' },
//             { ...l1, title: 'Commerce Cloud', target: '_blank' },
//             { ...l1, title: 'Data Cloud' },
//             { ...l1, title: 'Experience Cloud' },
//             { ...l1, title: 'Marketing Cloud' },
//             { ...l1, title: 'Service Cloud', target: '_blank' },
//             { ...l1, title: 'Sales Cloud', target: '_blank' },
//             { ...l1, title: 'AppExchange' },
//             { ...l1, title: 'MuleSoft' },
//         ],
//     },
//     {
//         isSeparator: true,
//         list: [
//             { ...l1, title: 'Slack', target: '_blank' },
//             { ...l1, title: 'Tableau', target: '_blank' },
//             { ...l1, title: 'CRM Analytics' },
//             { ...l1, title: 'Quip', target: '_blank' },
//             { ...l1, title: 'View All' },
//         ],
//     },
//     {
//         title: 'category II', isSeparator: false,
//         list: [
//             { ...l1, title: 'Apex' },
//             { ...l1, title: 'Lightning Web Components' },
//             { ...l1, title: 'Salesforce Flow' },
//             { ...l1, title: 'Developer Experience' },
//             { ...l1, title: 'APIs and Integration' },
//             { ...l1, title: 'Heroku', target: '_blank' },
//             { ...l1, title: 'Mobile SDK' },
//             { ...l1, title: 'LWC for Mobile' },
//         ],
//     },
//     {
//         isSeparator: false,
//         list: [
//             { ...l1, title: 'Embedded Services SDK' },
//             { ...l1, title: 'DevOps' },
//             { ...l1, title: 'Security' },
//             { ...l1, title: 'Identity' },
//             { ...l1, title: 'Salesforce Functions' },
//             { ...l1, title: 'Einstein', target: '_blank' },
//             { ...l1, title: 'Lightning Design System', target: '_blank' },
//         ],
//     },
// ];
// const a2: ICategoryItem[] = [
//     {
//         title: 'category I', isSeparator: false,
//         list: [
//             { ...l1, title: 'Platform' },
//             { ...l1, title: 'Commerce Cloud', target: '_blank' },
//             { ...l1, title: 'Data Cloud' },
//             { ...l1, title: 'Experience Cloud' },
//             { ...l1, title: 'Marketing Cloud' },
//             { ...l1, title: 'Service Cloud', target: '_blank' },
//             { ...l1, title: 'Sales Cloud', target: '_blank' },
//             { ...l1, title: 'AppExchange' },
//             { ...l1, title: 'MuleSoft' },
//         ],
//     },
//     {
//         isSeparator: false,
//         list: [
//             { ...l1, title: 'Embedded Services SDK' },
//             { ...l1, title: 'DevOps' },
//             { ...l1, title: 'Security' },
//             { ...l1, title: 'Identity' },
//             { ...l1, title: 'Salesforce Functions' },
//             { ...l1, title: 'Einstein', target: '_blank' },
//             { ...l1, title: 'Lightning Design System', target: '_blank' },
//         ],
//     },
// ];
// const a3: ICategoryItem[] = [
//     {
//         title: 'category I', isSeparator: false,
//         list: [
//             { ...l1, title: 'Platform' },
//             { ...l1, title: 'Commerce Cloud', target: '_blank' },
//             { ...l1, title: 'Data Cloud' },
//             { ...l1, title: 'Experience Cloud' },
//             { ...l1, title: 'Marketing Cloud' },
//             { ...l1, title: 'Service Cloud', target: '_blank' },
//             { ...l1, title: 'Sales Cloud', target: '_blank' },
//             { ...l1, title: 'AppExchange' },
//             { ...l1, title: 'MuleSoft' },
//         ],
//     },
// ];

// 
const data: ObjectLiteral[] = [
    { _id: '0', first: false, second: 12, third: 'первый - один' },
    { _id: '1', first: false, second: 90, third: 'первый - два' },
    { _id: '2', first: true, second: 85, third: 'первый - три' },
    { _id: '3', first: false, second: 65, third: 'первый - четыре' },
    { _id: '4', first: false, second: 33, third: 'первый - пять' },
    { _id: '5', first: true, second: 73, third: 'первый - шесть' },
    { _id: '6', first: false, second: 42, third: 'первый - семь' },
    { _id: '7', first: true, second: 27, third: 'первый - восемь' },
    { _id: '8', first: false, second: 21, third: 'первый - девять' },
    { _id: '9', first: false, second: 55, third: 'первый - десять' },
    { _id: '10', first: true, second: 31, third: 'второй - один' },
    { _id: '11', first: true, second: 6, third: 'второй - два' },
    { _id: '12', first: false, second: 35, third: 'второй - три' },
    { _id: '13', first: false, second: 93, third: 'второй - четыре' },
    { _id: '14', first: false, second: 26, third: 'второй - пять' },
    { _id: '15', first: false, second: 17, third: 'второй - шесть' },
    { _id: '16', first: true, second: 27, third: 'второй - семь' },
    { _id: '17', first: false, second: 32, third: 'второй - восемь' },
    { _id: '18', first: true, second: 19, third: 'второй - девять' },
    { _id: '19', first: false, second: 45, third: 'второй - десять' },
    { _id: '20', first: false, second: 17, third: 'третий - один' },
    { _id: '21', first: false, second: 23, third: 'третий - два' },
    { _id: '22', first: true, second: 73, third: 'третий - три' },
    { _id: '23', first: false, second: 36, third: 'третий - четыре' },
    { _id: '24', first: true, second: 46, third: 'третий - пять' },
    { _id: '25', first: false, second: 20, third: 'третий - шесть' },
    { _id: '26', first: false, second: 5, third: 'третий - семь' },
    { _id: '27', first: true, second: 39, third: 'третий - восемь' },
    { _id: '28', first: false, second: 4, third: 'третий - девять' },
    { _id: '29', first: true, second: 15, third: 'третий - десять' },
];

const onClickAllItems = (itemIndex: number) => console.log('--- --- value = ', itemIndex);

const menuItems = [
    { title: 'item 0', value: 0, variant: IButtonVariant.outlineBlue },
    { title: 'item 1', value: 1, variant: IButtonVariant.outlineRed },
    { title: 'item 2', value: 2, variant: IButtonVariant.outlineGreen },
];

const testItems: IGroupItem[] = [
    {
        type: 'JustButton',
        props: { variant: IButtonVariant.blue },
        children: { icon: { size: IconSize.xxSmall, before: IconsEnum.utility_add, position: IconPosition.beforeToCenter } },
    },
    {
        type: 'JustButton',
        props: { variant: IButtonVariant.green },
        children: { icon: { size: IconSize.xxSmall, before: IconsEnum.utility_success, position: IconPosition.beforeToCenter } },
    },
    {
        type: 'JustButton',
        props: { variant: IButtonVariant.red },
        children: { icon: { size: IconSize.xxSmall, before: IconsEnum.utility_delete, position: IconPosition.beforeToCenter } },
    },
    {
        type: 'ButtonMenu',
        props: { variant: IButtonVariant.outlineBlue, isHideOnSelect: false },
        children: [
            { variant: IButtonVariant.base, value: 0, title: 'item: 0' },
            { variant: IButtonVariant.base, value: 1, title: 'item: 1' },
            { variant: IButtonVariant.base, value: 2, title: 'item: 3' },
        ],
    },
];

const columns: DataTableColumn[] = [
    { name: '', width: 25, columnType: ColumnType.externalMenu, menu: { items: menuItems, onClick: onClickAllItems } },
    { name: '', width: 25, columnType: ColumnType.numbering },
    { name: '_id', width: 0, columnType: ColumnType.id, label: 'ID' },
    { name: 'first', width: 150, columnType: ColumnType.field, label: '1 - boolean' },
    { name: 'second', width: 150, columnType: ColumnType.field, label: '2 - number' },
    { name: 'third', width: 150, columnType: ColumnType.field, label: '3 - string' },
    {
        name: '', width: 130, columnType: ColumnType.all,
        groupItems: testItems,
    },
    {
        name: '', width: 100, columnType: ColumnType.update, label: 'Обновить',
        buttons: [{ title: 'update', onClick: () => console.log('click UPDATE') }],
    },
    {
        name: '', width: 100, columnType: ColumnType.delete, label: 'Удалить',
        buttons: [{ title: 'delete', onClick: () => console.log('click DELETE') }],
    },
];

// 
export const LibraryPage = (): JSX.Element => {


    //
    const getTags = () => {

        const onClickTag = () => console.log('--- close tag --- ');

        return (<>
            <div className={s['box-part']}>
                <Tag variant={TagVariant.neutral} mode={TagMode.badge}>
                    {{ before: { icon: IconsEnum.utility_ban }, title: 'ban' }}
                </Tag>
                <Tag variant={TagVariant.neutral} mode={TagMode.badge}>
                    {{ after: { icon: IconsEnum.utility_clear }, title: 'clear' }}
                </Tag>
                <Tag variant={TagVariant.neutral} mode={TagMode.badge}>
                    {{ before: { icon: IconsEnum.utility_success }, title: 'success' }}
                </Tag>
            </div>
            <div className={s['box-part']}>
                <Tag variant={TagVariant.red} mode={TagMode.pill}>
                    {{ before: { icon: IconsEnum.utility_success }, title: 'is success', after: { onClick: onClickTag } }}
                </Tag>
                <Tag variant={TagVariant.green} mode={TagMode.pill}>
                    {{ before: { icon: IconsEnum.utility_clear }, title: 'is close', after: { onClick: onClickTag } }}
                </Tag>
                <Tag variant={TagVariant.blue} mode={TagMode.pill}>
                    {{ before: { icon: IconsEnum.utility_add }, title: 'is ok', after: { onClick: onClickTag } }}
                </Tag>
            </div>
            <div className={s['box-part']}>
                <Tag variant={TagVariant.red} cs={s['custom-1']}>
                    {{
                        before: { icon: IconsEnum.action_share_link, isButton: true },
                        title: 'custom I',
                        after: { icon: IconsEnum.utility_middle_align }
                    }}
                </Tag>
                <Tag variant={TagVariant.green} cs={s['custom-2']}>
                    {{
                        before: { icon: IconsEnum.utility_moneybag },
                        title: 'custom II',
                        after: { icon: IconsEnum.standard_einstein_replies, isButton: true }
                    }}
                </Tag>
                <Tag variant={TagVariant.blue}>
                    {{
                        before: {
                            cs: s['custom-3'],
                            icon: IconsEnum.standard_voice_call,
                            isButton: true,
                            size: IconSize.large,
                        },
                        title: 'custom III',
                        after: {
                            cs: s['custom-4'],
                            icon: IconsEnum.standard_shift_template,
                            isButton: true,
                            size: IconSize.medium,
                        }
                    }}
                </Tag>
            </div>
        </>);
    }

    // 
    const getFlexLayout = () => {

        const getFlexItemStyle = (size: Size) => {
            //      getPadding(Kit.around, Magnitude.large)
            //      getMargin(Kit.around, Magnitude.large)
            //      getOrder(Order.O1, Order.O1, Order.O1, Order.O1)
            //      getSizing(Size.full, Size.full, Size.full, Size.full)
            return s['custom-box'] + ' ' + getSizing(size, size, size, size);
        }

        return (
            <FlexLayout multipleRows={true} horizontalAlign="center" verticalAlign="stretch">
                {[
                    { cs: getFlexItemStyle(Size.max_12_size_4), content: '4-of-12' },
                    { cs: getFlexItemStyle(Size.max_12_size_4), content: '4-of-12' },
                    { cs: getFlexItemStyle(Size.max_12_size_4), content: '4-of-12' },
                    { cs: getFlexItemStyle(Size.max_12_size_2), content: '2-of-12' },
                    { cs: getFlexItemStyle(Size.max_12_size_8), content: '8-of-12' },
                    { cs: getFlexItemStyle(Size.max_12_size_2), content: '2-of-12' },
                    { cs: getFlexItemStyle(Size.max_12_size_12), content: '12-of-12' },
                    { cs: getFlexItemStyle(Size.max_12_size_2), content: '2-of-12' },
                    { cs: getFlexItemStyle(Size.max_12_size_2), content: '2-of-12' },
                    { cs: getFlexItemStyle(Size.max_12_size_2), content: '2-of-12' },
                    { cs: getFlexItemStyle(Size.max_12_size_2), content: '2-of-12' },
                ]}
            </FlexLayout>
        );
    }

    // 
    const length = 4;
    const [accItems, setAccItems] = useState<IAccordionItem[]>(
        Array.from({ length: length }, (v, i) => ({
            title: `title ${i + 1}`,
            content: <div>div №{i + 1}</div>,
            isHideItem: false,
        }))
    );
    const getAccordionLayout = () => {

        const toogleHiden = (index: number) => {
            setAccItems(accItems.map((v, i) => (index === i)
                ? { ...v, isHideItem: !v.isHideItem } : v
            ));
        }

        return (
            <AccordionLayout multipleOpening={false} >
                {[
                    {
                        title: 'with menu button',
                        content: (<div>контент</div>),
                        menuItems: [
                            { value: 10, title: 'скрыть/показать "div №1"' },
                            { value: 15, title: 'скрыть/показать "div №2"' },
                            { value: 20, title: 'скрыть/показать "div №3"' },
                        ],
                        isShowMenu: true,
                        onSelectMenu: (index, value) => {
                            switch (value) {
                                case 10: return toogleHiden(0);
                                case 15: return toogleHiden(1);
                                case 20: return toogleHiden(2);
                            }
                        },
                    },
                    ...accItems,
                ]}
            </AccordionLayout>
        );
    }

    // 
    const [field1, onChangeField1] = useInputState('mail@mail.com');
    const [field3, onChangeField3] = useInputState(10);
    const [field4, onChangeField4] = useInputState('pass_12345');
    const [field5, onChangeField5] = useInputState('+7 950 852-73-70');
    const [field6, onChangeField6] = useInputState('http://developer.com');
    const [field9, onChangeField9] = useInputState('field - validate');

    // 
    const [field10, onChangeField10] = useInputState('Search 10');
    const [field11, onChangeField11, setField11] = useInputState('Search 11');
    const [field12, onChangeField12] = useInputState('Search 12');

    // 
    const [checkField1, setCheckField1] = useState<null | boolean>(null);
    const [checkField2, setCheckField2] = useState(false);
    const [checkField3, setCheckField3] = useState(true);
    const onClickGroupCheckbox = (groupValue: string[], index: number, isClick: boolean, value: string | boolean) => {
        console.log('--- Group value: ', groupValue, ' --- Checkbox ', index, ' value: ', value);
    }

    // 
    const [value1, setValue1] = useState('');
    const [value2, setValue2] = useState('');
    const [dateValue, setDateValue] = useState(Date.now());
    const [combo1, setCombo1] = useState(-1);
    const onClickCombo = (v: number) => {
        console.log('COMBO --- value = ', v);
        setCombo1(v);
    }
    const onSelectCombo = (v: number, i: number) => {
        console.log('COMBO --- value = ', v, ' --- index = ', i);
        setCombo1(v);
    }

    // 
    const initLeftList: IOptionItem[] = [
        { isSelected: false, label: 'Option 1', value: 'value --- 1' },
        { isSelected: true, label: 'Option 2', value: 'value --- 2' },
        { isSelected: false, label: 'Option 3', value: 'value --- 3' },
    ];
    const initRightList: IOptionItem[] = [
        { isSelected: false, label: 'Option 4', value: 'value --- 4' },
        { isSelected: false, label: 'Option 5', value: 'value --- 5' },
        { isSelected: false, label: 'Option 6', value: 'value --- 6' },
    ];

    // 
    const [leftFlags, setLeftFlags] = useState([true, false]);
    const [rightFlags, setRightFlags] = useState([true, false]);
    const getSlidingSidesLayout = () => {

        const mapFlags = (flags: boolean[], index: number) => flags.map((v, i) => (i === index) ? true : false);
        const setLeft_0 = () => setLeftFlags(mapFlags(leftFlags, 0));
        const setLeft_1 = () => setLeftFlags(mapFlags(leftFlags, 1));
        const setRight_0 = () => setRightFlags(mapFlags(rightFlags, 0));
        const setRight_1 = () => setRightFlags(mapFlags(rightFlags, 1));

        return (
            <SlidingSidesLayout>
                {{
                    left: [
                        {
                            isShow: leftFlags[0],
                            content: (
                                <JustButton variant={IButtonVariant.blue} mode={IButtonMode.listItem}
                                    onClick={() => setLeft_1()} title="Первый ---> Второй"
                                />
                            ),
                        },
                        {
                            isShow: leftFlags[1],
                            content: (
                                <JustButton variant={IButtonVariant.blue} mode={IButtonMode.listItem}
                                    onClick={() => setLeft_0()} title={"Второй ---> Первый"}
                                />
                            ),
                        },
                    ],
                    right: [
                        {
                            isShow: rightFlags[0],
                            content: (
                                <JustButton variant={IButtonVariant.blue} mode={IButtonMode.listItem}
                                    onClick={() => setRight_1()} title="Первый ---> Второй"
                                />
                            ),
                        },
                        {
                            isShow: rightFlags[1],
                            content: (
                                <JustButton variant={IButtonVariant.blue} mode={IButtonMode.listItem}
                                    onClick={() => setRight_0()} title="Второй ---> Первый"
                                />
                            ),
                        },
                    ],
                }}
            </SlidingSidesLayout>
        );
    }

    return (<>
        {/* 
        <HeaderLayout>
            {[
                { title: 'First', categories: a1 },
                { title: 'Second', categories: a2 },
                { title: 'Third', categories: a3 },
                { title: 'Library Page', to: '/library' },
                { title: 'Login Page', to: '/login' },
                { title: 'ROOT' },
            ]}
        </HeaderLayout> 
        */}
        <div className={s['library-page']}>

            <div className={s['example-box']} title="SlidingSidesLayout">
                {getSlidingSidesLayout()}
            </div>

            <div className={s['example-box']} title="DataTable">
                <DataTable fixedHeight={200} columns={columns} initData={data} />
            </div>

            <div className={s['example-box']} title="DualList">
                <DualList name="dual-1" label="dual list"
                    initLeftList={initLeftList} initRightList={initRightList}
                    onChangeLists={(l, r) => console.log('--- left = ', l, ' --- right = ', r)}
                />
            </div>

            <div className={s['example-box']} title="Slider">
                <Slider name="t1" min={-10} max={50}
                    value={20} onChangeValue={(v, s, e) => console.log(`--- value: ${v} --- start: ${s} --- end: ${e}`)}
                    isTwoSide={true}
                />
                <Slider name="t2" isValueScale={true} min={-20} max={60}
                    scaleLength={8} scaleFontSize={ScaleFontSize.large}
                    value={30} onChangeValue={(v, s, e) => console.log(`--- value: ${v} --- start: ${s} --- end: ${e}`)}
                    isTwoSide={true}
                />
                <hr />
                <hr />
                <Slider name="t1" min={-10} max={50}
                    value={20} onChangeValue={(v, s, e) => console.log(`--- value: ${v} --- start: ${s} --- end: ${e}`)}
                />
                <Slider name="t2" isValueScale={true} min={-20} max={60}
                    scaleLength={8} scaleFontSize={ScaleFontSize.large}
                    value={30} onChangeValue={(v, s, e) => console.log(`--- value: ${v} --- start: ${s} --- end: ${e}`)}
                />
            </div>

            <div className={s['example-box']} title="SelectInput + ComboInput + DateInput + TimeInput + ConfirmDropInput + FileInput">
                <SelectInput base={{ name: "select_input", label: "select" }} value={combo1} onSelect={onSelectCombo}>
                    {[
                        { value: 1, title: 'select - 1', onSelectItem: onClickCombo },
                        { value: 2, title: 'select - 2', onSelectItem: onClickCombo },
                        { value: 3, title: 'select - 3', onSelectItem: onClickCombo },
                    ]}
                </SelectInput>
                <hr />
                <ComboInput base={{ name: "combo_input", label: "combo" }} value={combo1} onSelect={onSelectCombo}>
                    {[
                        { value: 1, title: 'combo - 1', onClick: onClickCombo },
                        { value: 2, title: 'combo - 2', onClick: onClickCombo },
                        { value: 3, title: 'combo - 3', onClick: onClickCombo },
                    ]}
                </ComboInput>
                <hr />
                <DateInput name="date-input-1" label="date input test base"
                    dateValue={dateValue} setDateValue={setDateValue}
                    onSelectDate={(date: number) => console.log('--- date = ', new Date(date).toString())}
                />
                <hr />
                <TimeInput name="time-input-1" label="time input test base"
                    onSelectTime={(hour, minute) => console.log('--- hour = ', hour, ' --- minute = ', minute)}
                />
                <hr />
                <ConfirmDropInput base={{ name: "confirm_drop_input_1", label: "base complex input" }}
                    valueFormat={() => value1}
                    onShowInput={() => setValue2(value1)}
                    onCloseInput={() => setValue1(value2)}
                    onApproveInput={() => setValue1(new Date().toISOString())}
                >
                    <div>Hello World!</div>
                </ConfirmDropInput>
                <hr />
                <FileInput name="file-1" label="file upload" />
            </div>

            <div className={s['example-box']} title="Checkbox + CheckboxGroup">
                <FormLayout name="form" action={''} onSubmit={() => false}>

                    <Checkbox name="check-field-1" value="check 1" label="required with click"
                        isChecked={checkField1} onChange={setCheckField1}
                        required={true} />

                    <Checkbox name="check-field-2" value="check 2" label="only disabled"
                        isChecked={checkField2} onChange={setCheckField2}
                        disabled={true} />

                    <Checkbox name="check-field-3" value="check 3" label="disabled + required"
                        isChecked={checkField3} onChange={setCheckField3}
                        disabled={true} required={true} />

                    <hr />
                    <CheckboxGroup name="group_check" mode={CheckModeEnum.check} label="--- Checkbox Group ---"
                        disabled={false} onGroupChange={onClickGroupCheckbox}>
                        {[
                            { name: "check-field-4", label: "check I", value: "v1" },
                            { name: "check-field-5", label: "check II", value: "v2", isChecked: true },
                            { name: "check-field-6", label: "check III", value: "v3" }
                        ]}
                    </CheckboxGroup>
                    <hr />
                    <CheckboxGroup name="group_radio" mode={CheckModeEnum.radio} label="--- Radio Group ---"
                        disabled={false} onGroupChange={onClickGroupCheckbox}>
                        {[
                            { name: "check-field-7", label: "check VI", value: "v6" },
                            { name: "check-field-8", label: "check VII", value: "v7" },
                            { name: "check-field-9", label: "check VIII", value: "v8", isChecked: true }
                        ]}
                    </CheckboxGroup>
                </FormLayout>
            </div>

            <div className={s['example-box']} title="FormLayout + Search">
                <FormLayout name="form" action={''}>
                    <Search name="field-10" label="search - icons and buttons"
                        value={field10} onChange={onChangeField10}
                        sides={{
                            before: {
                                icon: IconsEnum.action_following,
                            },
                            after: {
                                isButton: true,
                                icon: IconsEnum.action_add_relationship,
                                onClick: () => console.log('--- override'),
                            },
                            spinner: true,
                        }}
                        isSpinner={true}
                        onClickClear={() => console.log('--- real')}
                    />
                    <Search name="field-11" label="search - override"
                        value={field11} onChange={onChangeField11}
                        isSpinner={true} onClickClear={() => setField11('')}
                    />
                    <Search name="field-12" label="search"
                        value={field12} onChange={onChangeField12}
                    />
                </FormLayout>
            </div>

            <div className={s['example-box']} title="TextareaInput">
                <TextareaInput name="textarea" />
                <TextareaInput name="textarea" disabled={true} />
                <TextareaInput name="textarea" readonly={true} />
            </div>

            <div className={s['example-box']} title="FormLayout + TextInput">
                <FormLayout name="form" action={''}>
                    <TextInput inputType={InputType.email}>
                        {{
                            name: "field-1", label: 'email',
                            value: field1, onChange: onChangeField1,
                        }}
                    </TextInput>
                    <TextInput inputType={InputType.hidden}>
                        {{
                            name: "field-2", value: 'hidden-value',
                        }}
                    </TextInput>
                    <TextInput inputType={InputType.number}>
                        {{
                            name: "field-3", label: 'number',
                            value: field3, onChange: onChangeField3,
                        }}
                    </TextInput>
                    <TextInput inputType={InputType.password}>
                        {{
                            name: "field-4", label: 'password',
                            value: field4, onChange: onChangeField4,
                        }}
                    </TextInput>
                    <TextInput inputType={InputType.tel}>
                        {{
                            name: "field-5", label: 'telephone',
                            value: field5, onChange: onChangeField5,
                        }}
                    </TextInput>
                    <TextInput inputType={InputType.url}>
                        {{
                            name: "field-6", label: 'url',
                            value: field6, onChange: onChangeField6,
                        }}
                    </TextInput>
                    <TextInput inputType={InputType.text}>
                        {{
                            name: "field-7", label: 'text - disabled',
                            value: 'disabled', disabled: true,
                        }}
                    </TextInput>
                    <TextInput inputType={InputType.text}>
                        {{
                            name: "field-8", label: 'text - readonly',
                            value: 'readonly', readonly: true,
                        }}
                    </TextInput>
                    <TextInput inputType={InputType.text}>
                        {{
                            name: "field-9", label: 'text - placeholder, required, maxlength, onfocus, onblur',
                            placeholder: 'enter text', value: field9, onChange: onChangeField9,
                            required: true, maxlength: 10,
                            onFocus: e => console.log('--- onfocus: ', e),
                            onBlur: e => console.log('--- onblur: ', e),
                        }}
                    </TextInput>
                </FormLayout>
            </div>

            <div className={s['example-box']} title="TabLayout">
                <TabLayout>
                    {{
                        cs: {
                            container: '',
                            bar: '',
                            barItem: '',
                            menuItem: '',
                            barActiveItem: '',
                            contentItem: '',
                        },
                        tabs: [
                            { cs: '', title: '1' },
                            { cs: '', title: 'second item' },
                            { cs: '', title: '3 item' },
                            { cs: '', title: 'four item' },
                            { cs: '', title: 'V item' },
                            { cs: '', title: '--- --- SIX ITEM --- ---' },
                        ],
                        contents: [
                            { cs: '', content: (<div>1111111</div>) },
                            { cs: '', content: (<div>2222222</div>) },
                            { cs: '', content: (<div>3333333</div>) },
                            { cs: '', content: (<div>4444444</div>) },
                            { cs: '', content: (<div>5555555</div>) },
                            { cs: '', content: (<div>6666666</div>) },
                        ],
                    }}
                </TabLayout>
            </div>

            <div className={s['example-box']} title="AccordionLayout">
                {getAccordionLayout()}
            </div>

            <div className={s['example-box']} title="CircularMenu + ButtonMenu">
                <CircularMenu>
                    {[
                        { icon: IconsEnum.action_add_contact, onClick: () => console.log('--- circular value = ', 0) },
                        { icon: IconsEnum.action_add_file, onClick: () => console.log('--- circular value = ', 1) },
                        { icon: IconsEnum.action_add_photo_video, onClick: () => console.log('--- circular value = ', 2) },
                        { icon: IconsEnum.action_add_relationship, onClick: () => console.log('--- circular value = ', 3) },
                        { icon: IconsEnum.action_adjust_value, onClick: () => console.log('--- circular value = ', 4) },
                    ]}
                </CircularMenu>
                <hr />
                <ButtonMenu variant={IButtonVariant.outlineBlue}
                    iconNameOpen={IconsEnum.utility_chevronup} iconNameClose={IconsEnum.utility_chevrondown}
                    iconSize={IconSize.large} iconOffset={IIconOffset.large}
                    isHideOnSelect={false} onSelect={(v, i) => console.log(`--- value = ${v} --- index = ${i}`)}
                    alignment={ButtonMenuAlignment.topRight}>
                    {[
                        { variant: IButtonVariant.blue, value: 0, title: 'item: 0', onClick: (v) => console.log(v), disabled: true },
                        { variant: IButtonVariant.neutral, value: 1, title: 'item: 1', tabIndex: 1000 },
                        {
                            variant: IButtonVariant.red, value: 2, title: 'item: 2',
                            icon: { before: IconsEnum.utility_add, after: IconsEnum.utility_delete },
                            tabIndex: 1000,
                            onClick: (v) => console.log(v),
                        },
                        { variant: IButtonVariant.green, value: 2, title: 'item: 3', tabIndex: 1000, accessKey: '' },
                    ]}
                </ButtonMenu>
                <hr />
                <ButtonMenu variant={IButtonVariant.outlineBlue} isHideOnSelect={false}>
                    {[
                        { variant: IButtonVariant.outlineBlue, value: 0, title: 'item: 0' },
                        { variant: IButtonVariant.outlineBlue, value: 0, title: 'item: 0' },
                        { variant: IButtonVariant.outlineBlue, value: 0, title: 'item: 0' },
                    ]}
                </ButtonMenu>
            </div>

            <div className={s['example-box']} title="ButtonGroup">
                <ButtonGroup>
                    {[
                        {
                            type: 'JustButton',
                            props: { variant: IButtonVariant.green },
                            children: {
                                icon: { before: IconsEnum.utility_add, position: IconPosition.beforeToCenter },
                                title: 'New',
                            }
                        },
                        {
                            type: 'JustButton',
                            props: { variant: IButtonVariant.outlineBlue, disabled: true },
                            children: { title: 'Edit' },
                        },
                        {
                            type: 'JustButton',
                            props: { variant: IButtonVariant.blue },
                            children: { title: 'brand' },
                        },
                        {
                            type: 'JustButton',
                            props: { variant: IButtonVariant.red },
                            children: { title: 'destructive' },
                        },
                        {
                            type: 'JustButton',
                            props: { variant: IButtonVariant.neutral },
                            children: { title: 'neutral' },
                        },
                        {
                            type: 'JustButton',
                            props: { variant: IButtonVariant.outlineBlue },
                            children: { title: 'outline brand' },
                        },
                        {
                            type: 'JustButton',
                            props: { variant: IButtonVariant.outlineRed },
                            children: { title: 'outline destructive' },
                        },
                        {
                            type: 'JustButton',
                            props: { variant: IButtonVariant.green },
                            children: { title: 'success' },
                        },
                        {
                            type: 'JustButton',
                            props: { variant: IButtonVariant.red },
                            children: {
                                icon: { before: IconsEnum.utility_delete, position: IconPosition.beforeToCenter },
                                title: 'Delete',
                            },
                        },
                        {
                            type: 'ButtonMenu',
                            props: {
                                variant: IButtonVariant.outlineBlue,
                                iconNameOpen: IconsEnum.utility_chevronup,
                                iconNameClose: IconsEnum.utility_chevrondown,
                                isHideOnSelect: true,
                                alignment: ButtonMenuAlignment.bottomLeft,
                                onSelect: (v, i) => console.log(`--- value = ${v} --- index = ${i}`),
                            },
                            children: [
                                { variant: IButtonVariant.blue, value: 0, title: 'item: 0', onClick: (v) => console.log(v), disabled: true },
                                { variant: IButtonVariant.neutral, value: 1, title: 'item: 1', tabIndex: 1000 },
                                {
                                    variant: IButtonVariant.red, value: 2, title: 'item: 2',
                                    icon: { before: IconsEnum.utility_add, after: IconsEnum.utility_delete },
                                    tabIndex: 1000,
                                    onClick: (v) => console.log(v),
                                },
                                { variant: IButtonVariant.green, value: 2, title: 'item: 3', tabIndex: 1000, accessKey: '' },
                            ],
                        },
                    ]}
                </ButtonGroup>
            </div>

            <div className={s['example-box']} title="PathIndicator + StepsIndicator">
                <PathIndicator onSelect={(index: number) => console.log(`--- PathIndicator --- index = `, index)}>
                    {[
                        { title: 'active 1', pathType: PathType.complete, onClick: () => console.log('--- PathIndicator --- button 1') },
                        { title: 'active 2', pathType: PathType.complete, onClick: () => console.log('--- PathIndicator --- button 2') },
                        { title: 'complete', pathType: PathType.current, onClick: () => console.log('--- PathIndicator --- button 3') },
                        { title: 'current', pathType: PathType.current, onClick: () => console.log('--- PathIndicator --- button 4') },
                        { title: 'incomplete 1', pathType: PathType.incomplete, onClick: () => console.log('--- PathIndicator --- button 5') },
                        { title: 'incomplete 2', pathType: PathType.incomplete, onClick: () => console.log('--- PathIndicator --- button 6') },
                    ]}
                </PathIndicator>
                <hr />
                <StepsIndicator>
                    {[
                        { buttonType: StepType.success, onClick: () => console.log('1') },
                        { buttonType: StepType.success, onClick: () => console.log('2') },
                        { buttonType: StepType.success, onClick: () => console.log('3') },
                        { buttonType: StepType.choice, onClick: () => console.log('4') },
                        { buttonType: StepType.error, onClick: () => console.log('5') },
                        { buttonType: StepType.error, onClick: () => console.log('6') },
                        { buttonType: StepType.choice, onClick: () => console.log('7') },
                    ]}
                </StepsIndicator>
            </div>

            <div className={s['example-box']} title="CheckboxButton + ToggleButton">
                <CheckboxButton isOn={true} />
                <CheckboxButton disabled={true} />
                <hr />
                <ToggleButton name="test12" label="toggle button with click" isOn={true}
                    onClick={(isClick) => console.log('--- ToggleButton click --- ', isClick)}
                />
                <ToggleButton name="test13" label="disabled toggle button" disabled={true} />
            </div>

            <div className={s['example-box']} title="Separator">
                <div style={{ position: "relative" }}>
                    <Separator progress={98} />
                </div>
            </div>

            <div className={s['example-box']} title="Spinner">
                <Spinner size={SpinnerSize.large} />
            </div>

            <div className={s['example-box']} title="Tag">
                {getTags()}
            </div>

            <div className={s['example-box']} title="GridLayout">
                <GridLayout cs={s['add-to-grid']}
                    gridHorAlign={GridAlign.stretch} cellsHorAlign={CellAlign.stretch}
                    freeSpace={GapSpace.large}
                >
                    {[
                        {
                            cs: s['test-box'],
                            preset: { type: "l3s4", section: "l3s4__left-side" },
                            content: 'Left Side',
                        },
                        {
                            cs: s['test-box'],
                            preset: { type: "l3s4", section: "l3s4__footer" },
                            content: 'footer',
                        },
                        {
                            cs: s['test-box'],
                            preset: { type: "l3s4", section: "l3s4__content" },
                            content: 'content',
                        },
                        {
                            cs: s['test-box'],
                            preset: { type: "header", section: "row-1-span-8" },
                            content: 'header',
                        },
                    ]}
                </GridLayout>
                <hr />
                <GridLayout cs={s['add-to-grid']}>
                    {[
                        {
                            cs: s['test-box'], preset: { type: "l3s4", section: "l3s4__left-side" },
                            cellHorAlign: CellAlign.center, cellVerAlign: CellAlign.center,
                            content: 'Left Side',
                        },
                        {
                            cs: s['test-box'], preset: { type: "l3s4", section: "l3s4__footer" },
                            cellHorAlign: CellAlign.center, cellVerAlign: CellAlign.center,
                            content: 'footer',
                        },
                        {
                            cs: s['test-box'], preset: { type: "l3s4", section: "l3s4__header" },
                            cellHorAlign: CellAlign.center, cellVerAlign: CellAlign.center,
                            content: 'header',
                        },
                        {
                            cs: s['test-box'], preset: { type: "l3s4", section: "l3s4__content" },
                            column: ColumnRange.range_10_13, row: RowRange.range_5_6,
                            content: 'content',
                        },
                        {
                            cs: s['test-box'], preset: { type: "l3s4", section: "l3s4__content" },
                            column: ColumnRange.range_4_7, row: RowRange.range_2_5,
                            content: 'content',
                        },
                        {
                            cs: s['test-box'], preset: { type: "l3s4", section: "l3s4__content" },
                            column: ColumnRange.range_10_13, row: RowRange.range_2_4,
                            content: 'content',
                        },
                    ]}
                </GridLayout>
            </div>

            <div className={s['example-box']} title="FlexLayout">
                {getFlexLayout()}
            </div>

            <div className={s['example-box']} title="CardLayout">
                <CardLayout>
                    {{
                        header: 'Hello',
                        body: 'Card Body (custom component)',
                        footer: 'Card Footer',
                        actions: (<>
                            <ButtonGroup>
                                {[
                                    {
                                        type: 'JustButton',
                                        props: { variant: IButtonVariant.green, onClick: () => console.log('--- add') },
                                        children: { title: 'Add' },
                                    },
                                    {
                                        type: 'JustButton',
                                        props: { variant: IButtonVariant.blue, onClick: () => console.log('--- edit') },
                                        children: { title: 'Edit' },
                                    },
                                    {
                                        type: 'JustButton',
                                        props: { variant: IButtonVariant.red, onClick: () => console.log('--- delete') },
                                        children: { title: 'Delete' },
                                    },
                                ]}
                            </ButtonGroup>
                        </>),
                    }}
                </CardLayout>
            </div>

            <div className={s['example-box']} title="FigureIcon">
                <FigureIcon cs={s['img-svg']} caption="with background">
                    {{
                        icon: { name: IconsEnum.action_close, size: IconSize.medium },
                        background: { color: IFigureColor.green, border: IFigureBorder.circle, size: IconSize.large },
                    }}
                </FigureIcon>
                <hr />
                <FigureIcon cs={s['img-svg']} caption="without background">
                    {{
                        icon: { name: IconsEnum.utility_chat, size: IconSize.medium },
                    }}
                </FigureIcon>
            </div>

            <div className={s['example-box']} title="JustButton">
                <JustButton variant={IButtonVariant.blue} onClick={() => true}
                    icon={{ after: IconsEnum.utility_up, before: IconsEnum.utility_down }}
                    title="Hello button 1!"
                />
                <hr />
                <JustButton variant={IButtonVariant.outlineRed}
                    title="outline destructive"
                />
                <hr />
                <JustButton variant={IButtonVariant.blue} mode={IButtonMode.listItem}
                    title="Hello button 2!"
                />
                <hr />
                <JustButton variant={IButtonVariant.blue} onClick={() => true}
                    icon={{
                        after: IconsEnum.utility_up,
                        before: IconsEnum.utility_down,
                        position: IconPosition.afterToCenter,
                    }}
                />
            </div>

        </div >
    </>);
}
