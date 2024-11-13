import React from 'react';
import './index.css';

const Todos = (props) => {
    const { todoItem, deleteToDo, updateToDostatus } = props;
    const { id, status, task } = todoItem;

    // Determine the button text and class based on task status
    const value = status ? "Completed" : "Incomplete";
    const classNameOfTaskBtn = status ? "complete" : "incomplete";

    // Function to handle task deletion
    const deleteToDoFunction = () => {
        deleteToDo(id); // Call parent function to delete task
    };

    // Function to update task status
    const updateToDoStatusFunction = () => {
        updateToDostatus(id); // Call parent function to update status
    };

    return (
        <li className="todo-item">
            <h4 className='text'>{task}</h4>

            <button
                type="button"
                onClick={updateToDoStatusFunction}
                className={classNameOfTaskBtn}
            >
                {value}
            </button>
            <button
                type="button"
                onClick={deleteToDoFunction}
                className="delete-btn"
            >
                Delete
            </button>

        </li>
    );
};

export default Todos;
