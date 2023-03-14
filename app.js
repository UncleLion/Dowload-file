import firebase from 'firebase/compat/app'
import 'firebase/compat/storage'                //Fixed with Compat
import {upload} from './upload.js'

const firebaseConfig = {
    apiKey: "AIzaSyCDR7OoKw1znKr6opF5msfHiYOPOCk-cvM",
    authDomain: "download-beta.firebaseapp.com",
    projectId: "download-beta",
    storageBucket: "download-beta.appspot.com",
    messagingSenderId: "953544815357",
    appId: "1:953544815357:web:6003caeb9a12086338c494"
};
  
firebase.initializeApp(firebaseConfig)

const storage = firebase.storage()

upload('#file', {
    multi: true,
    accept: ['.png','.jpg','.jpeg', '.gif'],
    onUpload(files, blocks) {
        files.forEach((file, index) => {
            const ref = storage.ref(`images/${file.name}`)
            const task = ref.put(file)
    
            task.on('state_changed', snapshot => {
                const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%'
                const block = blocks[index].querySelector('.preview-info-progress')
                block.textContent = percentage
                block.style.width = percentage 
            }, error => {                                                   //fixed CORRECT LINE 
              console.log(error)
            }, () => {
                task.snapshot.ref.getDownloadURL().then(url => {
                    console.log('Download URL', url)
                })
            })
        })
    }
})