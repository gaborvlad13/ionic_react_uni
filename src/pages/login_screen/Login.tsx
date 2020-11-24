import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonInput,
  IonLoading,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { AuthContext } from '../../providers/AuthProvider';
import { getLogger } from '../../database';
import './Login.css';

const log = getLogger('Login');

interface LoginState {
  username?: string;
  password?: string;
}

export const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const {
    isAuthenticated,
    isAuthenticating,
    login,
    authenticationError,
  } = useContext(AuthContext);
  const [state, setState] = useState<LoginState>({});
  const { username, password } = state;
  const handleLogin = () => {
    log('handleLogin...');
    login?.(username, password);
  };
  log('render');
  if (isAuthenticated) {
    return <Redirect to={{ pathname: '/' }} />;
  }
  return (
    <IonPage>
      <IonContent className='loginPage'>
        <IonGrid className='ionGridLogin'>
          <IonRow className='ion-justify-content-center ionRow'>
            <IonCol className='ion-text-center'>
              <IonInput
                className='ionInput'
                placeholder='Enter your username'
                value={username}
                onIonChange={(e) =>
                  setState({
                    ...state,
                    username: e.detail.value || '',
                  })
                }
              />
            </IonCol>
          </IonRow>
          <IonRow className='ion-justify-content-center'>
            <IonCol className='ion-text-center'>
              <IonInput
                className='ionInput'
                placeholder='Enter your password'
                value={password}
                onIonChange={(e) =>
                  setState({
                    ...state,
                    password: e.detail.value || '',
                  })
                }
              />
            </IonCol>
          </IonRow>
          <IonRow className='ion-justify-content-center'>
            <IonCol className='ion-text-center'>
              <IonLoading isOpen={isAuthenticating} />
              {authenticationError && (
                <div color='red'>
                  {authenticationError.message || 'Failed to authenticate'}
                </div>
              )}
              <IonButton onClick={handleLogin} className='loginButton'>
                Login
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};
