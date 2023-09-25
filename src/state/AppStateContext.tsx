import { LatLngLiteral } from 'leaflet';
import React, {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useReducer,
} from 'react';
import { useCurrentLocation } from '../hooks';
import { AreaAttribute, EPCItem, UserProvidedAttributes } from '../types';

interface AppState {
  location: LatLngLiteral | null;
  selectedItem: (EPCItem & AreaAttribute) | null;
  providedAttributes: Partial<UserProvidedAttributes> | null;
}

type AppAction =
  | { type: 'UPDATE_LOCATION'; payload: LatLngLiteral | null }
  | { type: 'UPDATE_SELECTED_ITEM'; payload: (EPCItem & AreaAttribute) | null }
  | { type: 'UPDATE_USER_INPUTS'; payload: UserProvidedAttributes | null }
  | { type: 'UPDATE_BUILDING_AGE'; payload: number }
  | { type: 'UPDATE_PROPERTY_TYPE'; payload: string }
  | { type: 'UPDATE_PROPERTY_DURATION'; payload: string }
  | { type: 'UPDATE_FLOOR_LEVEL'; payload: string }
  | { type: 'UPDATE_NUM_BED'; payload: number }
  | { type: 'UPDATE_NUM_BATH'; payload: number }
  | { type: 'UPDATE_NUM_RECEPTION'; payload: number }
  | { type: 'UPDATE_AUCTION'; payload: boolean }
  | { type: 'UPDATE_GARAGE'; payload: boolean }
  | { type: 'UPDATE_SHARED_OWNERSHIP'; payload: boolean }
  | { type: 'RESET' };

const StateContext = createContext<AppState | undefined>(undefined);
const DispatchContext = createContext<Dispatch<AppAction> | undefined>(
  undefined,
);

const initialState: AppState = {
  location: null,
  selectedItem: null,
  providedAttributes: null,
};

const reducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'UPDATE_LOCATION':
      return { ...state, location: action.payload };
    case 'UPDATE_SELECTED_ITEM':
      return { ...state, selectedItem: action.payload };
    case 'UPDATE_USER_INPUTS':
      return { ...state, providedAttributes: action.payload };
    case 'UPDATE_BUILDING_AGE':
      return {
        ...state,
        providedAttributes: {
          ...state.providedAttributes,
          EPC_CONSTRUCTION_AGE: action.payload,
        },
      };
    case 'UPDATE_PROPERTY_TYPE':
      return {
        ...state,
        providedAttributes: {
          ...state.providedAttributes,
          PPD_PropertyType: action.payload,
        },
      };
    case 'UPDATE_PROPERTY_DURATION':
      return {
        ...state,
        providedAttributes: {
          ...state.providedAttributes,
          PPD_Duration: action.payload,
        },
      };
    case 'UPDATE_FLOOR_LEVEL':
      return {
        ...state,
        providedAttributes: {
          ...state.providedAttributes,
          EPC_FLOOR_LEVEL: action.payload,
        },
      };
    case 'UPDATE_NUM_BED':
      return {
        ...state,
        providedAttributes: {
          ...state.providedAttributes,
          zoo_num_bed_min: action.payload,
        },
      };
    case 'UPDATE_NUM_BATH':
      return {
        ...state,
        providedAttributes: {
          ...state.providedAttributes,
          zoo_num_bath_min: action.payload,
        },
      };
    case 'UPDATE_NUM_RECEPTION':
      return {
        ...state,
        providedAttributes: {
          ...state.providedAttributes,
          zoo_num_reception_min: action.payload,
        },
      };
    case 'UPDATE_GARAGE':
      return {
        ...state,
        providedAttributes: {
          ...state.providedAttributes,
          zoo_garage: action.payload,
        },
      };
    case 'UPDATE_AUCTION':
      return {
        ...state,
        providedAttributes: {
          ...state.providedAttributes,
          zoo_auction: action.payload,
        },
      };
    case 'UPDATE_SHARED_OWNERSHIP':
      return {
        ...state,
        providedAttributes: {
          ...state.providedAttributes,
          zoo_shared_ownership: action.payload,
        },
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

interface StateProviderProps {
  children: ReactNode;
}

export const AppStateProvider: React.FC<StateProviderProps> = ({
  children,
}) => {
  const currentPosition = useCurrentLocation();
  const [state, dispatch] = useReducer(reducer, initialState, (initial) => ({
    ...initial,
    location: currentPosition,
  }));

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

export const useAppState = () => {
  const state = useContext(StateContext);

  if (state === undefined) {
    throw new Error('useAppState must be used within a AppStateProvider');
  }

  return state;
};

export const useAppDispatch = () => {
  const dispatch = useContext(DispatchContext);

  if (dispatch === undefined) {
    throw new Error('useAppDispatch must be used within a AppStateProvider');
  }

  return dispatch;
};
