import React, { FC, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Box, Button, DrawerContent, DrawerFooter, Icon } from '@adminjs/design-system';
import { Section } from '@adminjs/design-system';
import { ActionProps, ActionHeader, LayoutElementRenderer } from 'adminjs';
import { RecordJSON, BasePropertyComponent, BasePropertyProps } from 'adminjs';
import { useRecord, useTranslation, withNotice } from 'adminjs';
// 
import { appendForceRefresh, getActionElementCss } from '../../helps/BulkComponentsHelper';
import { withRouter } from '../../hooks/withRouter';
import UploadFile from '../common/UploadFile';

// 
export type FileInfo = {
    url: string,
    name: string,
};

const TestModelEdit: FC<ActionProps & BasePropertyProps> = (props) => {
    const { record: initialRecord, resource, action } = props;

    const navigate = useNavigate();
    const { translateButton } = useTranslation();
    const { record, handleChange, submit, loading, setRecord } =
        useRecord(initialRecord, resource.id);

    useEffect(() => {
        if (initialRecord) setRecord(initialRecord);
    }, [initialRecord])

    // 
    const onSubmitClick = (event: React.FormEvent<HTMLFormElement>): boolean => {
        event.preventDefault();
        submit().then((response) => {
            if (response.data.redirectUrl) {
                navigate(appendForceRefresh(response.data.redirectUrl));
            }
        })
        return false;
    }

    // 
    const photoProperty = resource.editProperties.find(
        (property) => (property.propertyPath === 'photo_url')
    );
    const contentTag = getActionElementCss(resource.id, action.name, 'drawer-content');
    const formTag = getActionElementCss(resource.id, action.name, 'form');
    const footerTag = getActionElementCss(resource.id, action.name, 'drawer-footer');
    const buttonTag = getActionElementCss(resource.id, action.name, 'drawer-submit');

    return (<>
        <UploadFile resource={resource} action={action} record={record}
            property={photoProperty} translateButton={translateButton}
        />
        <Section>
            <Box as="form" flex flexDirection="column" data-css={formTag} onSubmit={onSubmitClick}>
                <DrawerContent data-css={contentTag}>
                    {action?.showInDrawer ? <ActionHeader {...props} /> : null}
                    {action.layout ? action.layout.map((layoutElement, i) => (
                        <LayoutElementRenderer
                            key={i}
                            layoutElement={layoutElement}
                            {...props}
                            where="edit"
                            onChange={handleChange}
                            record={record as RecordJSON}
                        />
                    )) : resource.editProperties.map((property) => (
                        <BasePropertyComponent
                            key={property.propertyPath}
                            where="edit"
                            onChange={handleChange}
                            property={property}
                            resource={resource}
                            record={record as RecordJSON}
                        />
                    ))}
                </DrawerContent>
                <DrawerFooter data-css={footerTag}>
                    <Button variant="primary" size="lg" data-css={buttonTag}
                        type="submit" data-testid="button-save" disabled={loading}
                    >
                        {loading ? (<Icon icon="Fade" spin />) : null}
                        {translateButton('save', resource.id)}
                    </Button>
                </DrawerFooter>
            </Box>
        </Section>
    </>)
}

const formattedBulk = withNotice(
    withRouter(TestModelEdit),
);
export default formattedBulk;
