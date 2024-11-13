import { Component } from "react";
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';
import { Navigate } from 'react-router-dom';
import Todos from "../Todos";
import './index.css'

class Home extends Component {

    state = {
        isAuthenticated: true,
        name: '',
        task: '',
        status: false,
        list: []
    };

    componentDidMount() {
        const jwtToken = Cookies.get('jwt_token');
        if (!jwtToken) {
            this.setState({ isAuthenticated: false });
        }
        const username = localStorage.getItem('username');
        if (username) {
            this.setState({ name: username }, () => {
                // Call `getData` after `name` has been set
                this.getData();
            });
        } else {
            console.log("Username not found in localStorage.");
        }




    }


    enterTaskFunction = event => {
        this.setState({ task: event.target.value })
    }







    logOutButton = () => {
        Cookies.remove("jwt_token")
        localStorage.removeItem("username")
        this.setState({ isAuthenticated: false });
    }

    addingTaskFunction = async () => {
        const { task, status, name } = this.state;

        if (task !== '') {
            const response = await fetch('https://to-do-full-stack-application-1.onrender.com/task', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: uuidv4(), task: task, status: status, username: name })
            });


            if (response.ok) {
                this.setState({ task: '', status: false });
                this.getData();

            } else {
                console.error('Failed to add task');
            }
        }
    }

    deleteTaskFunction = async (id) => {
        try {
            const response = await fetch(https://to-do-full-stack-application-1.onrender.com/task/${id}?name=${encodeURIComponent(this.state.name)}`, {
                method: 'DELETE',
            });
            console.log(response)

            if (response.ok) {
                await this.getData()
            } else {
                console.error('Failed to delete task');
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }

    updateToDostatus = async (id) => {
        const newStatus = true
        try {
            const response = await fetch(`https://to-do-full-stack-application-1.onrender.com/task/${id}?name=${encodeURIComponent(this.state.name)}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                await this.getData();
            } else {
                console.error('Failed to update task status');
            }
        } catch (error) {
            console.error('Error updating task status:', error);
        }

    }

    getData = async () => {
        try {
            const response = await fetch(`https://to-do-full-stack-application-1.onrender.com/userTasks?name=${encodeURIComponent(this.state.name)}`);
            const data = await response.json();
            if (response.ok) {
                this.setState({ list: data });
            }
        } catch (error) {
            console.error("Error fetching user tasks:", error);
        }
    }






    render() {
        const { isAuthenticated, task, list, name } = this.state;


        if (!isAuthenticated) {
            return <Navigate to="/login" replace />;
        }


        return (
            <div className="home-container">
                <h1>Hello {name}, Welcome to Task Manager</h1>
                <h3>Organize your day, one task at a time.</h3>
                <p>Click on "incomplete" to complete the task.</p>

                <div className="task-input-container">
                    <input
                        type="text"
                        placeholder="Enter your task"
                        onChange={this.enterTaskFunction}
                        value={task}
                    />
                    <button type="button" onClick={this.addingTaskFunction}>
                        Add
                    </button>
                </div>



                <ul>
                    {list.map((eachTask) => (
                        <Todos
                            key={eachTask.id}
                            todoItem={eachTask}
                            deleteToDo={this.deleteTaskFunction}
                            updateToDostatus={this.updateToDostatus}
                        />
                    ))}
                </ul>

                <div>
                    <button className="logout-button" onClick={this.logOutButton}>
                        Logout
                    </button>
                </div>
            </div>


        )
    }
}

export default Home
