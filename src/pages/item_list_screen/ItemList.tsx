import React, { useContext, useState } from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import {
  IonButton,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
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
import { wait } from '@testing-library/react';
import { ItemProps } from '../../models/ItemProps';
const log = getLogger('ItemList');

const ItemList: React.FC<RouteComponentProps> = ({ history }) => {
  const { items, fetching, fetchingError } = useContext(ItemContext);
  const { logout } = useContext(AuthContext);
  const [pos, setPos] = useState(9);
  const [itemsShow, setItemsShow] = useState<ItemProps[]>([]);
  const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(
    false
  );
  log('render');
  console.log(items);

  const handleLogout = () => {
    logout?.();
    return <Redirect to={{ pathname: '/login' }} />;
  };

  function wait() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }

  async function searchNext($event: CustomEvent<void>) {
    if (items && pos < items.length) {
      console.log(pos, items.length);
      await wait();
      setItemsShow([...itemsShow, ...items.slice(pos, 9 + pos)]);
      setPos(pos + 3);
    } else {
      setDisableInfiniteScroll(true);
    }

    await ($event.target as HTMLIonInfiniteScrollElement).complete();
  }

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
        <IonInfiniteScroll
          threshold='100px'
          disabled={disableInfiniteScroll}
          onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}
        >
          <IonInfiniteScrollContent
            loadingSpinner='bubbles'
            loadingText='Loading more books...'
          />
        </IonInfiniteScroll>
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
