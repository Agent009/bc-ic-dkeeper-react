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
import React, {useEffect, useState} from "react";
import { dkeeper_backend } from '../../declarations/dkeeper_backend/index';

//var counter = new Counter(new Date().getHours());
//counter.startCounter().stopCounter(10000);
let defaultNotes = [{id: 20, title: "", content: ""}];
export default function App() {
    const [notes, setNotes] = useState([]);

    /**
     * Initialise on render, taking the notes from the BC network.
     * We specify an empty array as the second parameter to prevent endless loop of useEffect -> setNotes -> re-render -> useEffect
     * The empty array ensures that useEffect only executes once.
     */
    useEffect(() => {
        fetchData();
    }, []);

    /**
     * Fetch the notes from the BC network.
     */
    async function fetchData() {
        const notesArray = await dkeeper_backend.readNotes();
        setNotes(notesArray);
    }

    /**
     *
     * @param {object} note
     * @param {number} noteID
     * @param {function} callback
     */
    function addNote(note, noteID, callback) {
        // console.log(note);
        note.id = noteID;
        setNotes(prevState => {
            dkeeper_backend.createNote(note.title, note.content);
            return [note, ...prevState]
        });

        if (typeof callback === "function") {
            callback();
        }
    }

    /**
     * @param {number} noteID
     */
    function deleteNote(noteID) {
        dkeeper_backend.removeNote(noteID);
        setNotes(prevState => prevState.filter((noteItem) => {
            return noteItem.id !== noteID;
        }));
    }

    /**
     * @param {object} note
     * @param {number} index
     */
    function parseNote(note, index) {
        if (note === undefined) {
            return;
        }

        note.id = index;

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
