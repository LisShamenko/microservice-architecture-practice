//
import s from './button-group.module.sass';
import { ButtonMenu, IPropsButtonMenu } from "../ButtonMenu/ButtonMenu";
import { IPropsMenuItem } from "../ButtonMenu/MenuItem";
import { IPropsJustButton, IChildrenJustButton, JustButton } from '../../../interaction/button/JustButton/JustButton';
import { IButtonVariant } from '../../../interaction/button/JustButton/types';



// 
export interface IJustButtonParams {
    type: 'JustButton',
    props: IPropsJustButton,
    children: IChildrenJustButton,
}

export interface IButtonMenuParams {
    type: 'ButtonMenu',
    props: IPropsButtonMenu,
    children: IPropsMenuItem[],
}

export type IGroupItem = IJustButtonParams | IButtonMenuParams;



// 
export interface IButtonGroupProps {
    children: IGroupItem[],
    cs?: {
        root?: string,
        menu?: string,
    },
}

export const ButtonGroup = (
    {
        children, cs = {},
    }: IButtonGroupProps
): JSX.Element => {

    //
    const buttons = children;

    // 
    const getStyle = () => {
        const customClass: string[] = [s['button-group']];
        if (cs.root) customClass.push(cs.root);
        return customClass.join(' ');
    }

    const getItemStyle = (index: number): string => {
        if (index === 0) return s['group-item-first'];
        else if (index < (buttons.length - 1)) return s['group-item-between'];
        else return s['group-item-last'];
    }

    return (
        <div className={getStyle()}>
            {buttons && buttons.map((item, index) => {

                let ncs = getItemStyle(index);

                if (item.type === 'JustButton') {

                    let correctVariant = item.props.variant;
                    if (item.props.variant === IButtonVariant.blue ||
                        item.props.variant === IButtonVariant.outlineBlue) {
                        correctVariant = IButtonVariant.neutral;
                    }
                    if (item.props.variant === IButtonVariant.red) {
                        correctVariant = IButtonVariant.outlineRed;
                    }
                    if (item.props.variant === IButtonVariant.green) {
                        correctVariant = IButtonVariant.outlineGreen;
                    }

                    return (
                        <JustButton key={index}
                            {...item.props} variant={correctVariant}
                            cs={`${item.props.cs} ${ncs}`} {...item.children}
                        />
                    );
                }

                if (item.type === 'ButtonMenu') {
                    const newStyle = {
                        ...item.props.cs,
                        button: `${item.props.cs?.button} ${ncs} ${cs.menu}`,
                    };
                    return (
                        <ButtonMenu key={index} {...item.props}
                            cs={newStyle}>
                            {item.children}
                        </ButtonMenu>
                    );
                }
                return (<></>);
            })}
        </div >
    );
}
