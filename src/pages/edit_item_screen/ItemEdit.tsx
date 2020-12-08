import React, { useContext, useEffect, useState } from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { getLogger } from '../../database';
import { ItemContext } from '../../providers/ItemProvider';
import { RouteComponentProps } from 'react-router';
import { ItemProps } from '../../models/ItemProps';

const log = getLogger('ItemEdit');

interface ItemEditProps
  extends RouteComponentProps<{
    id?: string;
  }> {}

const ItemEdit: React.FC<ItemEditProps> = ({ history, match }) => {
  const {
    items,
    saving,
    savingError,
    deleting,
    deletingError,
    saveItem,
    removeItem,
  } = useContext(ItemContext);
  const [text, setText] = useState('');
  const [item, setItem] = useState<ItemProps>();
  useEffect(() => {
    log('useEffect');
    const routeId = match.params.id || '';
    const item = items?.find((it) => it._id === routeId);
    setItem(item);
    if (item) {
      setText(item.text);
    }
  }, [match.params.id, items]);
  const handleSave = () => {
    const editedItem = item ? { ...item, text } : { text };
    saveItem && saveItem(editedItem).then(() => history.goBack());
  };

  const handleDelete = () => {
    console.log('cevaaa');

    console.log(item);

    const deletedItem = item ? { ...item, text } : { text };
    removeItem && removeItem(deletedItem).then(() => history.goBack());
  };
  log('render');
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Edit</IonTitle>
          <IonButtons slot='end'>
            <IonButton onClick={handleSave}>Save</IonButton>
            <IonButton onClick={handleDelete}>Delete</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonInput
          value={text}
          onIonChange={(e) => setText(e.detail.value || '')}
        />
        <IonLoading isOpen={saving} />
        {savingError && (
          <div>{savingError.message || 'Failed to save item'}</div>
        )}
        {deletingError && (
          <div>{deletingError.message || 'Failed to delete item'}</div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ItemEdit;
