import List "mo:base/List";
import Debug "mo:base/Debug";

actor DKeeper {
    // Create our note object
    public type Note = {
        title: Text;
        content: Text;
    };

    // Create our list of notes and make it persistent so it retains data across deployments.
    stable var notes: List.List<Note> = List.nil<Note>();

    // Add a new note.
    public func createNote(titleText: Text, contentText: Text) {
        let newNote: Note = {
            title = titleText;
            content = contentText;
        };

        // Pre-pends the new item to the beginning of the array.
        notes := List.push(newNote, notes);
        Debug.print(debug_show(notes));
    };

    // Return the notes stored in our list.
    public query func readNotes(): async [Note] {
        return List.toArray(notes);
    };

    
    public func removeNote(id: Nat) {
        // Get the elements from the first element up until the element to be dropped.
        let listFront = List.take(notes, id);
        // Get the elements after the element to be dropped.
        let listBack = List.drop(notes, id + 1);
        notes := List.append(listFront, listBack);
    };

    // To remove elements from the list, we need to use a group of functions.
    // First, we need to "take" the elements from the left side of the list (the new elements), up to the element that needs to be removed.
    // Then, we need to "drop" the element that needs to be removed. This will remove the elements up to the element to be removed, and return the elements after that.
    // Finally, we need to "append" the two lists together to return the final result.
    // https://internetcomputer.org/docs/current/references/motoko-ref/List 
    private func removeListElement(list: List.List<Note>, id: Nat) : List.List<Note> {
        // Get the elements from the first element up until the element to be dropped.
        let listFront = List.take(list, id);
        // Get the elements after the element to be dropped.
        let listBack = List.drop(list, id + 1);
        return List.append(listFront, listBack);
    };
}