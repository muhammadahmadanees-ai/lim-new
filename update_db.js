import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDZrO41T6gz9qnsLqN9EqxiFFKFbZzjIPU",
  authDomain: "limstorepk.firebaseapp.com",
  projectId: "limstorepk",
  storageBucket: "limstorepk.firebasestorage.app",
  messagingSenderId: "215094075559",
  appId: "1:215094075559:web:8751d25ef90b7160d0bb82"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function updateTilesCover() {
  try {
    const q = query(collection(db, "collections"));
    const querySnapshot = await getDocs(q);
    
    for (const d of querySnapshot.docs) {
      const data = d.data();
      if (data.name === 'Tiles' || data.title === 'Tiles') {
        console.log(`Updating document: ${d.id}`);
        await updateDoc(doc(db, "collections", d.id), {
          img: "/tiles_cover.png",
          imageurl: "/tiles_cover.png"
        });
        console.log("Update successful!");
      }
    }
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

updateTilesCover();
