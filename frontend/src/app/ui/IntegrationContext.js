import {createContext, useContext, useEffect, useRef, useState} from 'react';

export const IntegrationContext = createContext({
  onComplete: () => {},
  setClientSchedule: () => {},
  setAuthMetaData: () => {},
  auth: '',
  state: ''
});

export const IntegrationProvider = ({onComplete, auth, state, children}) => {
    const sharedState = useRef(state);

    const setClientSchedule = (schedule) => {
      const stateObject = JSON.parse(atob(sharedState.current));
      if (!stateObject.client_metadata) {
        stateObject.client_metadata = {}
      }
      stateObject.client_metadata.schedule = schedule;
      sharedState.current = btoa(JSON.stringify(stateObject));
    }

    const setAuthMetaData = (data) => {
      const stateObject = JSON.parse(atob(sharedState.current));
      stateObject.auth_metadata = data;
      sharedState.current = btoa(JSON.stringify(stateObject));
    }

    return (
      <IntegrationContext.Provider
        value={{
          onComplete: () => onComplete({state: sharedState.current, auth}),
          setAuthMetaData,
          setClientSchedule,
          auth,
          state
      }}>
        {children}
      </IntegrationContext.Provider>
    );
}

export const useIntegration = () => useContext(IntegrationContext);
