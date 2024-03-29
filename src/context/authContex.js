import { useContext, createContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import React from 'react';
import {onSnapshot, collection} from 'firebase/firestore';
import db from '../firebase'
import { GoogleAuthProvider, signOut, signInWithCredential,onAuthStateChanged  } from 'firebase/auth'
import { gapi } from 'gapi-script'
import { SCOPE, CLIENT_ID, API_KEY, DISCOVERY_DOCS } from '../gapiVar';




const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [clients, setClients] = useState({});
  const [GoogleAuth, setGoogleAuth] = useState({});
  const [dropDownClients, setDropDownClients] = useState([]);
  const [dropDownContacts, setDropDownContacts] = useState([]);
  const [dropDownWarehouses, setDropDownWarehouses] = useState([]);
  const [dropDownRecipients, setDropDownRecipients] = useState([]);
  const [dropDownInventory, setDropDownInventory] = useState([]);
  const [dropDownRiders, setDropDownRiders] = useState([])
  const [dropDownCity, setDropDownCity] = useState([])
  const [dropDownPostalCode, setDropDownPostalCode] = useState([])
  const [dropDownCountry, setDropDownCountry] = useState([])
  const [warehouses, setWarehouses] = useState({});
  const [inventory, setinventory] = useState({});

  useEffect(() => {
    onLoad()
  }, []); 

  function onLoad(){
    function handleClientLoad() {
      // Load the API's client and auth2 modules.
      // Call the initClient function after the modules load.
      gapi.load('client:auth2', initClient);
    }
  
  function initClient() {
    // In practice, your app can retrieve one or more discovery documents.
  
    // Initialize the gapi.client object, which app uses to make API requests.
    // Get API key and client ID from API Console.
    // 'scope' field specifies space-delimited list of access scopes.
      gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          scope: SCOPE,
        'discoveryDocs': DISCOVERY_DOCS,
      }).then(async function () {
        setGoogleAuth(gapi.auth2.getAuthInstance())
      });
    }
    handleClientLoad()
  }
  
  const googleSignIn = async () => {
      Promise.resolve(GoogleAuth.signIn()).then(async function(value) {
          const token = value.getAuthResponse().id_token
          const credential = GoogleAuthProvider.credential(token)
          const response = await signInWithCredential(auth, credential)
      }).catch(function(error) {
      console.log("signIn(): " + error)
    });
  }

  const logOut = async () => {
    try {
      await GoogleAuth.signOut()
      console.log('User is signed out from gapi.')
  
      await signOut(auth)
      console.log('User is signed out from firebase.')
  
      setUser(null)
      // clean user from store
    } catch (error) {
      console.error('signOutUser (firebase/auth.js): ', error)
    }
  }

  useEffect(() => {

    console.log("state = unknown (until the callback is invoked)")
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log("state = definitely signed in")
        setUser(currentUser);
        console.log(currentUser)
      }
      else {
        console.log("state = definitely signed out")
      }
    })
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(  () => {
    const colRefClients = collection(db, "clients" )
    const colRefRiders = collection(db, "riders" )
    const colRefRecipients = collection(db, "recipients" )
    const colRefContacts = collection(db, "contacts" )
    const colRefWarehouses = collection(db, "warehouses" )
    const colRefInventory = collection(db, "inventory" )
    onSnapshot(colRefInventory, (snapshot) => {
      setDropDownInventory([])
        let dropDownInventory = [];
        snapshot.docs.forEach((doc) => {
          dropDownInventory.push({value:doc.data().sku,label:`${doc.data().sku} (${doc.data().title})`,client:doc.data().client,title:doc.data().title, dimensions:doc.data().dimensions, weight:doc.data().weight,price:doc.data().price, inventoryID: doc.data().inventoryID})
        })
        setDropDownInventory(dropDownInventory)
    })
    onSnapshot(colRefClients, (snapshot) => {
      setClients([])
      setDropDownClients([])
        let clients = {};
        let dropDownClients = [];
        snapshot.docs.forEach((doc) => {
          clients[doc.id] = doc.data()
          setClients(clients)
        })
        snapshot.docs.forEach((doc) => {
          dropDownClients.push({value:doc.data().name,label:doc.data().name,clientID:doc.data().clientID})
        })
        setDropDownClients(dropDownClients)
    })
    onSnapshot(colRefInventory, (snapshot) => {
      setinventory([])
        snapshot.docs.forEach((doc) => {
          setinventory((prev) => [...prev, doc.data()])
        })  
    })
    onSnapshot(colRefRecipients, (snapshot) => {
      setDropDownRecipients([])
        let dropDownRecipients = [];
        snapshot.docs.forEach((doc) => {
          dropDownRecipients.push({value:doc.data().name,label:doc.data().name,client:doc.data().client, availableWarehouses:doc.data().availableWarehouses,contacts:doc.data().contacts,shippingAddress:doc.data().shippingAddress, recipientID: doc.data().recipientID})
        })
        setDropDownRecipients(dropDownRecipients)
    })
    onSnapshot(colRefRiders, (snapshot) => {
      setDropDownRiders([])
        let dropDownRiders = [];
        snapshot.docs.forEach((doc) => {
          dropDownRiders.push({value:doc.data().name, label:`${doc.data().name} ${doc.data().lastName}`, number:doc.data().number, lastName: doc.data().lastName, riderID: doc.data().riderID})
        })
        setDropDownRiders(dropDownRiders)
    })
    onSnapshot(colRefContacts, (snapshot) => {
      setDropDownContacts([])
        let dropDownContacts = [];
        snapshot.docs.forEach((doc) => {
          dropDownContacts.push({value:doc.data().name,label:doc.data().name,clientID:doc.data().client.clientID,email:doc.data().email,number:doc.data().number,contactID:doc.data().contactID,available:doc.data().available,id:doc.data().id,recipients: doc.data().recipients})
        })
        setDropDownContacts(dropDownContacts)
    })
    onSnapshot(colRefWarehouses, (snapshot) => {
      setWarehouses([])
      setDropDownWarehouses([])
        let warehouses = {}
        let dropDownWarehouses = [];
        let dropDownCity = [];
        let dropDownPostalCode = [];
        let dropDownCountry = [];
        snapshot.docs.forEach((doc) => {
          warehouses[doc.id] = doc.data()
        })
        snapshot.docs.forEach((doc) => {
          dropDownWarehouses.push({value:doc.id,label:doc.id,city:doc.data().city,country:doc.data().country})
          dropDownCity.push({value:doc.data().city,label:doc.data().city,country:doc.data().country})
          for(var i = 0; i < doc.data().deliversTo.length; ++i){
            dropDownPostalCode.push({value:doc.data().deliversTo[i],label:`${doc.data().deliversTo[i]} (${doc.data().city})`,city:doc.data().city, warehouse: doc.id})
          }
        })
        dropDownCountry.push({value:'Germany',label:'Germany'})
        setWarehouses(warehouses)
        setDropDownWarehouses(dropDownWarehouses)
        setDropDownCity(dropDownCity)
        setDropDownCountry(dropDownCountry)
        setDropDownPostalCode(dropDownPostalCode)
    })

    
  }, [])

  return (
    <AuthContext.Provider value={{GoogleAuth,googleSignIn, logOut, user, clients, warehouses, dropDownClients, dropDownWarehouses, dropDownContacts,dropDownRecipients,dropDownInventory,dropDownRiders,dropDownCity,dropDownCountry,dropDownPostalCode,inventory}}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
