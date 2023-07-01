import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const firebaseConfig = {
                apiKey: "AIzaSyARCgVBudnWBd4OLN44KvbcGUWJDNe58Zk",
                authDomain: "firebondtournament.firebaseapp.com",
                projectId: "firebondtournament",
                storageBucket: "firebondtournament.appspot.com",
                messagingSenderId: "988969175725",
                appId: "1:988969175725:web:4d88eccf9d6d1eb2ff5424",
                measurementId: "G-C9ECPF5NZP"
              };

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const db = firebase.firestore();
