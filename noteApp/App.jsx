import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
// import { nanoid } from "nanoid"
import { notesCollection, db } from "./firebase"
import { onSnapshot, addDoc, doc, deleteDoc, setDoc } from "firebase/firestore"

export default function App() {
    const [notes, setNotes] = React.useState([])
        // () => JSON.parse(localStorage.getItem("notes")) ||

    const [currentNoteId, setCurrentNoteId] = React.useState("")
        // (notes[0]?.id) || ""

    const [tempNoteText, setTempNoteText] = React.useState("")

    const currentNote =
        notes.find(note => note.id === currentNoteId)
        || notes[0]

    React.useEffect(()=> {
        // localStorage.setItem("notes", JSON.stringify(notes))
        const unsubscribe = onSnapshot(notesCollection, (snapshot) => {
            const notesArr = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            setNotes(notesArr.sort((a, b) => b.updatedAt - a.updatedAt))
            // setNotes(notesArr)
        })
        return unsubscribe
    }, [])
    
    React.useEffect(()=> {
        if(!currentNoteId){
            setCurrentNoteId(notes[0]?.id)
        }
    }, [notes])

    React.useEffect(()=> {
        if(currentNote){
            setTempNoteText(currentNote.body)
        }
    },[currentNote])

    React.useEffect(()=> {
        const TimeoutId = setTimeout(()=>{
            if(tempNoteText !== currentNote.body){
                updateNote(tempNoteText)
            }
        }, 500)
        return () => clearTimeout(TimeoutId)
    }, [tempNoteText])

    async function createNewNote() {
        const newNote = {
            body: "# Type your markdown note's title here",
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        // setNotes(prevNotes => [newNote, ...prevNotes])
        const newNoteRef = await addDoc(notesCollection, newNote)
        setCurrentNoteId(newNoteRef.id)
    }

    async function updateNote(text) {
        const docRef = doc(db, "notes", currentNoteId)
        await setDoc(docRef, { body: text, updatedAt: Date.now() }, { merge: true })
        // setNotes(oldNotes => {
        //     const newArray = []
        //     for (let i = 0; i < oldNotes.length; i++) {
        //         const oldNote = oldNotes[i]
        //         if (oldNote.id === currentNoteId) {
        //             // Put the most recently-modified note at the top
        //             newArray.unshift({ ...oldNote, body: text })
        //         } else {
        //             newArray.push(oldNote)
        //         }
        //     }
        //     return newArray;
        // })
    }

    async function deleteNote(noteId) {
        // event.stopPropagation()
        // setNotes(oldNotes => oldNotes.filter(note => note.id !== noteId))
        const docRef = doc(db, "notes", noteId)
        await deleteDoc(docRef)
    }

    return (
        <main>
            {
                notes.length > 0
                    ?
                    <Split
                        sizes={[30, 70]}
                        direction="horizontal"
                        className="split"
                    >
                        <Sidebar
                            notes={notes}
                            currentNote={currentNote}
                            setCurrentNoteId={setCurrentNoteId}
                            newNote={createNewNote}
                            deleteNote={deleteNote}
                        />
                        {
                            // currentNoteId &&
                            // notes.length > 0 &&
                            <Editor
                                tempNoteText={tempNoteText}
                                setTempNoteText={setTempNoteText}
                            />
                        }
                    </Split>
                    :
                    <div className="no-notes">
                        <h1>You have no notes</h1>
                        <button
                            className="first-note"
                            onClick={createNewNote}
                        >
                            Create one now
                        </button>
                    </div>

            }
        </main>
    )
}
