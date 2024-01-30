import { OldAppDispatch } from '../oldStore';
import { dtoSection } from './dto/dtoSection';



// constants

const SET_OLD_SECTION = 'SET_OLD_SECTION';

// store._state.oldPage

export interface dtoOldPage {
    section: dtoSection | null;
}

export const oldPageInitial: dtoOldPage = {
    section: null,
}

// reducer

export const oldPageReducer = (state: dtoOldPage = oldPageInitial, action: any) => {
    switch (action.type) {
        case SET_OLD_SECTION:
            return { ...state, section: action.section };
    }
    return state;
}

// actions

export interface IOldSection {
    id: string;
    title: string;
}

export const setSection = (section: IOldSection) => {
    return { type: SET_OLD_SECTION, section: section };
};

// creators

export const getSectionAsync = (id: string) => (dispatch: OldAppDispatch) => {
    new Promise<IOldSection>((resolve) => {
        setTimeout(() => resolve({ id: 'id', title: 'title' }), 100);
    }).then((data) => {
        dispatch(setSection(data));
    });
    //      const config: AxiosRequestConfig = {
    //          baseURL: 'http://localhost:3001/api/',
    //          withCredentials: false,
    //          headers: {
    //              "API-KEY": "0"
    //          }
    //      };
    //      const api = axios.create(config);
    //      api.get(`old/${id}`)
    //          .then(res => res.data)
    //          .then((data: IOldSection) => {
    //              dispatch(setSection(data));
    //          });
}

// selectors

export const selectSection = (state: any) => state.oldPage.section;
