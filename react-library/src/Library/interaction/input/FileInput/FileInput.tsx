import { useState } from "react";
//
import s from './file-input.module.sass';
import { ChildIcon, IconPosition } from "../../../visualization/image/ChildIcon/ChildIcon";
import { IconsEnum, IconSize } from "../../../visualization/image/Icon/types";



// 
export interface IPropsFileInput {
    cs?: string,
    name: string,
    label?: string,
    disabled?: boolean,
    required?: boolean,
    onHandleFiles?: (files: FileList) => void,
}

export const FileInput = (
    {
        cs = '', name, label = '',
        disabled = false, required = false,
        onHandleFiles,
    }: IPropsFileInput
): JSX.Element => {

    const [isDrag, setDrag] = useState(false);

    const onDragTrue = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setDrag(true);
    }

    const onDragFalse = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setDrag(false);
    }

    const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
        onDragFalse(event);
        if (onHandleFiles) onHandleFiles(event.dataTransfer.files);
    }

    // 
    const getStyle = () => {
        const customClass: string[] = [cs];
        customClass.push(s['file-input']);
        return customClass.join(' ');
    }
    const getContainerStyle = () => {
        const customClass: string[] = [];
        customClass.push(s['input-container']);
        if (disabled) customClass.push(s['container-disabled']);
        if (isDrag) customClass.push(s['drag-hover']);
        return customClass.join(' ');
    }

    return (
        <div className={getStyle()}>
            <div className={s['files-list']}>
                <div className={s['file-dropzone']}
                    onDragEnter={onDragTrue} onDragOver={onDragTrue}
                    onDragLeave={onDragFalse} onDrop={onDrop}>

                    <label className={getContainerStyle()} htmlFor={`id_${name}`}>
                        <input className={s['input-item']} type="file"
                            id={`id_${name}`} name={name} />

                        <div className={s['icon-border']}>
                            <ChildIcon cs={s['icon-item']}
                                after={IconsEnum.action_upload}
                                position={IconPosition.afterToCenter}
                                size={IconSize.xSmall} />
                        </div>

                        <span className={s['label-item']}>
                            {label}
                        </span>
                    </label>
                </div>
            </div>
        </div>
    );
}
