import { Dispatch, SetStateAction, useState } from 'react';
import { Text, DrawerContent, DrawerFooter } from '@adminjs/design-system';
import { Button, Icon, Input, Label } from '@adminjs/design-system';
import { ActionHeader, ActionProps, AddNoticeProps } from 'adminjs';
import { ApiClient, TranslateFunction, addNotice, useTranslation } from "adminjs";
// 
import { WithRouterProps } from '../hooks/withRouter';

/**
 * @see node_modules\adminjs\src\frontend\utils\data-css-name.ts
 */
export const getActionElementCss = (resourceId: string, actionName: string, suffix: string) => `${resourceId}-${actionName}-${suffix}`

/**
 * @see node_modules\adminjs\src\frontend\components\actions\utils\append-force-refresh.ts
 * ____
 * Adds refresh=true to the url, which in turn should cause list to reload.
 *
 * @param {string} url      url to which function should add `refresh`
 * @param {string} [search] optional search query which should be updated,
 *                          if not given function will use window.location.search
 * @private
 */
export const appendForceRefresh = (url: string, search?: string): string => {

    const searchParamsIdx = url.lastIndexOf('?');

    const urlSearchParams = (searchParamsIdx !== -1)
        ? url.substring(searchParamsIdx + 1)
        : null;

    const oldParams = new URLSearchParams(
        search ?? urlSearchParams ?? window.location.search ?? '',
    );

    const urlSearch = new URLSearchParams(urlSearchParams || '');
    const newParams = (urlSearch.get('ignore_params') === 'true')
        ? new URLSearchParams('')
        : new URLSearchParams(oldParams.toString());

    newParams.set('refresh', 'true');

    const newUrl = (searchParamsIdx !== -1)
        ? url.substring(0, searchParamsIdx)
        : url;

    return `${newUrl}?${newParams.toString()}`;
};

// 
export const redirectUrl = (navigate: any, response: any) => {
    if (response.data.redirectUrl) {
        const search = new URLSearchParams(window.location.search);
        // bulk function have recordIds in the URL 
        // so it has to be stripped before redirect
        search.delete('recordIds');
        navigate(appendForceRefresh(
            response.data.redirectUrl, search.toString()
        ));
    }
}

// 
export const checkRecords = (props: BulkProps, bulk: BulkState) => {
    if (!props.records) {
        return (
            <Text>
                {bulk.translateMessage('pickSomeFirstToRemove', props.resource.id)}
            </Text>
        );
    }
}

export const checkAvailableValues = (availableValues, bulk: BulkState) => {
    if (!availableValues) {
        return (
            <Text>{bulk.translateMessage('error')}</Text>
        );
    }
}

// 
export type BulkState = {
    current: any,
    setCurrent: Dispatch<any>,
    loading: boolean,
    setLoading: Dispatch<SetStateAction<boolean>>,
    translateMessage: TranslateFunction,
    translateButton: TranslateFunction,
};

export type BulkProps = ActionProps & AddNoticeProps & WithRouterProps;

export type SelectItem = {
    label: string;
    value: string | number;
};

// 
export const useBulk = (defultValue: any): BulkState => {

    const [current, setCurrent] = useState(defultValue);
    const [loading, setLoading] = useState(false);
    const { translateMessage, translateButton } = useTranslation();

    return {
        current, setCurrent,
        loading, setLoading,
        translateMessage, translateButton,
    }
}

export const useHandleClick = (
    props: BulkProps, bulk: BulkState, getData: Function,
) => {

    const { resource, records, action, addNotice, router } = props;

    return (): void => {
        const recordIds = records.map((r) => r.id);
        const api = new ApiClient();

        bulk.setLoading(true);
        api
            .bulkAction({
                data: getData(), // { description },
                resourceId: resource.id,
                actionName: action.name,
                recordIds,
                method: 'post',
            })
            .then((response) => {
                bulk.setLoading(false);
                if (response.data.notice) {
                    addNotice(response.data.notice);
                }
                redirectUrl(router.navigate, response);
            })
            .catch((error) => {
                bulk.setLoading(false);
                addNotice({
                    message: bulk.translateMessage('bulkDeleteError', resource.id),
                    type: 'error',
                });
                throw error;
            });
    };
}

export const getAvailableValues = (props: BulkProps) => {
    const availableValues = props.resource.properties.status.availableValues;
    const acceptedValue = availableValues.find((v) => v.value === 'ACCEPTED');
    const defaultValue = availableValues ? acceptedValue.value : null;
    return { availableValues, defaultValue };
}

// 
export const getButton = (bulk: BulkState, handleClick: any) => {
    return (
        <Button
            variant="primary"
            size="lg"
            onClick={handleClick}
            disabled={bulk.loading}
        >
            {bulk.loading ? <Icon icon="Fade" spin /> : null}
            {bulk.translateButton('confirm')}
        </Button>
    );
}

export const getTextInput = (
    props: BulkProps, bulk: BulkState, field: string,
) => {
    return (<>
        {props.action?.showInDrawer
            ? <ActionHeader omitActions {...props} />
            : null
        }
        <Label>{bulk.translateMessage(field, props.resource.id)}</Label>
        <Input as="textarea" value={bulk.current}
            onChange={(e) => bulk.setCurrent(e.target.value)}
        />
    </>);
}

export const getSelect = (
    props: BulkProps, bulk: BulkState,
    field: string, values: SelectItem[],
) => {
    return (<>
        {props.action?.showInDrawer
            ? <ActionHeader omitActions {...props} />
            : null
        }
        <Label>{bulk.translateMessage(field, props.resource.id)}</Label>
        <select value={bulk.current} onChange={(e) => bulk.setCurrent(e.target.value)}>
            {values.map((v) => (
                <option key={v.value} value={v.value}>
                    {v.label}
                </option>
            ))}
        </select>
    </>);
}
