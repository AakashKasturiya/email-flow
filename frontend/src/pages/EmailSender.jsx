import React, {useState} from 'react';
import {EmailForm} from '../components/EmailForm';
import {SentList} from '../components/SentList';


export const EmailSender = () => {
    const [reload, setReload] = useState(false);

  return (
     <div>
      <h1>Email Sender System 📧</h1>

      <EmailForm onSent={() => setReload(!reload)} />

      <h2>Sent Emails</h2>
      <SentList reload={reload} />
     </div>
  )
}
