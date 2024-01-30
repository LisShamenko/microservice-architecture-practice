import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';



// 
interface IProps {
    children: ReactNode,
    store: Store,
}

export default function ReduxProvider({ children, store }: IProps): JSX.Element {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
}
