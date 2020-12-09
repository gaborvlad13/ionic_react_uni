import React, { useContext } from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import {
  IonButton,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonList,
  IonLoading,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { add } from 'ionicons/icons';
import Item from '../../components/Item';
import { getLogger } from '../../database';
import { ItemContext } from '../../providers/ItemProvider';
import './ItemList.css';
import { AuthContext } from '../../providers/AuthProvider';
const log = getLogger('ItemList');

const ItemList: React.FC<RouteComponentProps> = ({ history }) => {
  const { items, fetching, fetchingError } = useContext(ItemContext);
  const { logout } = useContext(AuthContext);
  log('render');
  console.log(items);

  const handleLogout = () => {
    logout?.();
    return <Redirect to={{ pathname: '/login' }} />;
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonRow>
            <IonTitle>Books list</IonTitle>
            <IonButton onClick={handleLogout}>Logout</IonButton>
          </IonRow>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading isOpen={fetching} message='Fetching items' />
        {items && (
          <IonList>
            {items.map(({ _id, text }) => (
              <Item
                key={_id}
                _id={_id}
                text={text}
                onEdit={(id) => history.push(`/item/${id}`)}
              />
            ))}
          </IonList>
        )}
        {fetchingError && (
          <div>{fetchingError.message || 'Failed to fetch items'}</div>
        )}
        <IonFab vertical='bottom' horizontal='end' slot='fixed'>
          <IonFabButton onClick={() => history.push('/item')}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default ItemList;
