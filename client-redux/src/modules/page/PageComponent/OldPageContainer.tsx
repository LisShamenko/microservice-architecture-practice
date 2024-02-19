import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
//
import withRouter from '../../../hocs/withRouter';
import { PageComponent } from './PageComponent';
import { dtoSection } from '../../../redux/reducers/types/dtoSection';
import { getSectionAsync, selectSection } from '../../../redux/reducers/old-page.reducer';



// 
interface IProps {
    section: dtoSection,
    getSection: Function,
    router: any,
}

const OldPageAPIContainer = ({
    section, getSection, router,
}: IProps) => {

    router = { params: { section: 1 } };
    useEffect(() => {
        getSection(router.params.section);
    }, []);

    return (<PageComponent section={section} />);
}



// 
const OldPageContainer = compose(
    connect(
        (state) => ({
            section: selectSection(state),
        }),
        {
            getSection: getSectionAsync,
        }
    ),
    withRouter
)(OldPageAPIContainer);



/**
 * @example
 * // renderApp.tsx
 * import store from './redux/oldStore';
 * // AppRouterProvider.tsx
 * import OldPageContainer from '../modules/page/PageComponent/OldPageContainer';
 * <Route path="/old" element={<OldPageContainer />} />
 */
const TSIgnore = (): JSX.Element => {
    // @ts-ignore
    return (<OldPageContainer />);
}
export default TSIgnore;
