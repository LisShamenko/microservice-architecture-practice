import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
//
import withRouter from '../../../hocs/withRouter';
import { PageComponent } from './PageComponent';
import { dtoSection } from '../../../redux/reducers/dto/dtoSection';
import { getSectionAsync, selectSection } from '../../../redux/reducers/new-page.reducer';



// 
interface IProps {
    section: dtoSection,
    getSection: Function,
    router: any,
}

const NewPageAPIContainer = ({
    section, getSection, router,
}: IProps) => {

    router = { params: { section: 1 } };
    useEffect(() => {
        getSection(router.params.section);
    }, []);

    return (<PageComponent section={section} />);
}



// 
const NewPageContainer = compose(
    connect(
        (state) => ({
            section: selectSection(state),
        }),
        {
            getSection: getSectionAsync,
        }
    ),
    withRouter
)(NewPageAPIContainer);



/**
 * @example
 * // renderApp.tsx
 * import store from './redux/store';
 * // AppRouterProvider.tsx
 * import NewPageContainer from '../modules/page/PageComponent/NewPageContainer';
 * <Route path="/new" element={<NewPageContainer />} />
 */
const TSIgnore = (): JSX.Element => {
    // @ts-ignore
    return (<NewPageContainer />);
}
export default TSIgnore;
