import { ReactNode } from "react";
//
import s from './card-layout.module.sass';



// 
interface IStylesCardLayout {
    root?: string,
    header?: string,
    body?: string,
    footer?: string,
}

// 
interface IPropsCardLayout {
    cs?: IStylesCardLayout,
    children: {
        actions?: ReactNode,
        header: ReactNode,
        body: ReactNode,
        footer?: ReactNode,
    },
}

export const CardLayout = (
    {
        children, cs = {},
    }: IPropsCardLayout
): JSX.Element => {

    const { actions, header, body, footer } = children;

    //
    const getStyle = (cs: string | undefined, style: string) => {
        const customClass: string[] = [];
        if (cs) customClass.push(cs);
        customClass.push(s[style]);
        return customClass.join(' ');
    }

    return (
        <div className={getStyle(cs.root, 'card-layout')}>
            <div className={s['card-box']}>

                <div className={s['card-header']}>
                    <header className={s['header-box']}>
                        <div className={s['card-header-title']}>
                            <h2 className={s['text-header-truncate']}>
                                <span>{header}</span>
                            </h2>
                        </div>
                        <div className={s['card-header-actions']}>
                            {actions}
                        </div>
                    </header>
                </div>

                <div className={getStyle(cs.body, 'card-body')}>
                    {body}
                </div>

                {footer && (
                    <div className={getStyle(cs.footer, 'card-footer')}>
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
