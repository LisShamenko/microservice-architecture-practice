import { Box, Button, DrawerContent, DrawerFooter, Icon } from '@adminjs/design-system';
import { Input, Label, Loader, Section, FormGroup } from '@adminjs/design-system';
import { Table, TableCaption, TableHead, TableBody, TableRow, TableCell } from '@adminjs/design-system';
import { Text, CheckBox, Link } from '@adminjs/design-system';
import React, { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
//
import { ActionJSON, ActionProps, BasePropertyJSON, BasePropertyProps, ErrorBoundary, PropertyJSON, RecordJSON, ResourceJSON, TranslateFunction } from 'adminjs';
import { useRecord, useTranslation } from 'adminjs';
import { appendForceRefresh, getActionElementCss } from '../../helps/BulkComponentsHelper';
import PhotoFile from '../PhotoFile/PhotoFile';
import httpService from '../../helps/httpService';
import Bar from './Bar';
import PropertyLabel from '../PropertyLabel';

// 
export type FileInfo = {
    id: number,
    url: string,
    title: string,
};

export type UploadFileProps = {
    resource: ResourceJSON,
    action: ActionJSON,
    record: RecordJSON,
    property: BasePropertyJSON,
    translateButton: TranslateFunction,
}

const UploadFile: FC<UploadFileProps> = (props) => {

    const { resource, action, record, property, translateButton } = props;
    const userId = props.record.params['user_id'];

    // 
    const [title, setTitle] = useState('');
    const [selectedFiles, setSelectedFiles] = useState(undefined);
    const [currentFile, setCurrentFile] = useState(undefined);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("");
    const [fileInfos, setFileInfos] = useState<FileInfo[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        httpService
            .getFiles(userId)
            .then((response) => setFileInfos(response.data));
    }, []);

    // 
    const onChangeTitle = (event: any) => {
        setTitle(event.target.value);
    }

    const onSelectFile = (event: any) => {
        setSelectedFiles(event.target.files);
    }

    const onUploadClick = (event: React.FormEvent<HTMLFormElement>): boolean => {
        event.preventDefault();
        upload();
        return false;
    }

    const upload = async () => {

        const currentFile = selectedFiles[0];
        setSelectedFiles(undefined);
        setCurrentFile(currentFile);
        setProgress(0);

        const options = {
            file: currentFile,
            title: title,
            user_id: userId,
        };

        await httpService
            .upload(options, (event) => {
                setProgress(Math.round((100 * event.loaded) / event.total));
            })
            .then(async (response) => {
                setMessage(`File (id = ${response.data.id}) is uploaded!`);
                setCurrentFile(undefined);
                return httpService.getFiles(userId);
            })
            .then((response) => {
                setFileInfos(response.data);
            })
            .catch(() => {
                setProgress(0);
                setMessage('Could not upload the file!');
                setCurrentFile(undefined);
            });

        navigate(0);
    }

    // 
    const contentTag = getActionElementCss(resource.id, action.name, 'drawer-content');
    const formTag = getActionElementCss(resource.id, action.name, 'form');
    const footerTag = getActionElementCss(resource.id, action.name, 'drawer-footer');
    const buttonTag = getActionElementCss(resource.id, action.name, 'drawer-submit');

    return (<>
        <Section>
            <Box as="form" flex flexDirection="column" data-css={formTag} onSubmit={onUploadClick}>
                <DrawerContent data-css={contentTag}>
                    <FormGroup>
                        <Label htmlFor="file_input">File Input</Label>
                        <Input name="file_input" type="file" onChange={onSelectFile} />
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="title">Title</Label>
                        <Input name="title" value={title} onChange={onChangeTitle} />
                    </FormGroup>

                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>id</TableCell>
                                <TableCell>title</TableCell>
                                <TableCell>url</TableCell>
                                <TableCell>view</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {fileInfos && fileInfos.map((info, index) => (
                                <TableRow key={index}>
                                    <TableCell>{info.id}</TableCell>
                                    <TableCell>{info.title}</TableCell>
                                    <TableCell>{info.url}</TableCell>
                                    <TableCell>
                                        <PhotoFile
                                            isDownload={false}
                                            //record={record}
                                            //property={property as PropertyJSON}
                                            where={'show'}
                                            //path={property.propertyPath}
                                            css={{ width: 126 }}
                                            url={info.url}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </DrawerContent>
                <DrawerFooter data-css={footerTag}>

                    {currentFile && (<>
                        <Loader />
                        <Bar style={{ width: progress + "%" }} />
                    </>)}


                    <div className="alert alert-light">
                        {message}
                    </div>

                    <Button variant="primary" size="lg" data-css={buttonTag}
                        type="submit" data-testid="button-save" disabled={!selectedFiles}
                    >
                        {translateButton('upload-image-file', resource.id)}
                    </Button>
                </DrawerFooter>
            </Box>
        </Section>
    </>);
}

export default UploadFile;
