/**
 * //Map - create a new array by doing something with each item in the array
 * //Filter - create a new array by keeping items that return true
 * //Reduce - Accumulate a value by doing something to each item in the array
 * //Find - find the first item that matches from an array
 * //FindIndex - find the index of the first item that matches
 */

// import lodash from 'lodash'
import {Header, Footer} from './layout/layout'
import KeeperNote, {CreateNote} from './keeper/keeper'
// import Counter from "./util/counter";
import ErrorBoundary from "./util/errorBoundary";
import './App.css';
import React, {useState} from "react";

//var counter = new Counter(new Date().getHours());
//counter.startCounter().stopCounter(10000);
let defaultNotes = [{id: 20, title: "", content: ""}];
export default function App() {
    const [notes, setNotes] = useState([]);

    /**
     *
     * @param {object} note
     * @param {number} noteID
     * @param {function} callback
     */
    function addNote(note, noteID, callback) {
        // console.log(note);
        note.id = noteID;
        setNotes(prevState => [...prevState, note]);

        if (typeof callback === "function") {
            callback();
        }
    }

    /**
     * @param {number} noteID
     */
    function deleteNote(noteID) {
        setNotes(prevState => prevState.filter((noteItem) => {
            return noteItem.id !== noteID;
        }));
    }

    /**
     * @param {object} note
     */
    function parseNote(note) {
        if (note === undefined) {
            return;
        }

        return (
            <KeeperNote key={note.id} id={note.id} title={note.title} content={note.content} onDelete={deleteNote} />
        );
    }

    return (
        <div className="App">
            <Header/>
            <ErrorBoundary>
                <CreateNote onAdd={addNote} />
            </ErrorBoundary>
            <ErrorBoundary>
                {notes.map(parseNote)}
            </ErrorBoundary>
            <Footer/>
        </div>
    );
}
