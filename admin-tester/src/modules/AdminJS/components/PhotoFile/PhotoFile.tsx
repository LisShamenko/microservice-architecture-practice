import { BasePropertyProps, PropertyJSON, PropertyPlace, RecordJSON } from 'adminjs';
import { Icon } from '@adminjs/design-system';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import httpService from '../../helps/httpService';


// 
const Container = styled('div') <{ where: PropertyPlace }>`
    display: flex;
    flex-direction: column;
    align-items: ${({ where }) => (where === 'list' ? 'center' : 'normal')};
`;

// 
export declare type PhotoFileProps = {
    where: PropertyPlace,
    isDownload?: boolean,
    css?: {
        width?: number,
    },
    url: string,
}

const PhotoFile = ({
    where, isDownload = true, css = {}, url,
}: PhotoFileProps) => {

    //      let url: string = record.params[path];
    //      if (!url) {
    //          url = record.params['url'];
    //      }
    //      const url = record.populated['file_id'].params.url;

    const filename = url.split('/').pop();
    const srcUrl = httpService.getUrl(url);
    const width = (css.width) ? (css.width)
        : { show: 800, list: 360, item: 128 }[where];

    const [type, setType] = useState<string>(null);
    const [status, setStatus] = useState<number>(null);
    const [copied, setCopied] = useState<boolean>(false);

    // 
    useEffect(() => {
        (async () => {
            if (where !== 'list' && where !== 'show') return;
            const head = await httpService.http.head(url);
            setType(head.headers['content-type'] as string);
            setStatus(head.status);
        })();
    }, [url]);

    // 
    const onClick = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(filename);
        setCopied(true);
    }

    return (
        <Container where={where}>
            <a download href={srcUrl}>
                {type?.includes('video') && (
                    <video width={width} controls>
                        <source src={srcUrl} type={type} />
                        Your browser does not support the video tag.
                    </video>
                )}
                {type?.includes('image') && <img width={width} src={srcUrl}></img>}
            </a>
            {status === 404
                ? (
                    <span onClick={onClick}>
                        <Icon icon={copied ? 'Checkmark' : 'Copy'} /> {filename}
                    </span>
                )
                : isDownload && (
                    <a download href={srcUrl}>download</a>
                )
            }
        </Container>
    );
};
export default PhotoFile;
