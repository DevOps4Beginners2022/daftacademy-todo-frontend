import { useState, useContext } from "react";
import { AppContext } from "../Context";

const CreateTaskForm = () => {
    const {
        createTask,
        setDisabledDeleteAll,
    } = useContext(AppContext);

    const [newTask, setNewTask] = useState({});

    const addNewTask = (e, field) => {
        setNewTask({
            ...newTask,
            [field]: e.target.value,
        });
    };

    const submitTask = (e) => {
        e.preventDefault();
        createTask(newTask);
        setDisabledDeleteAll(false)
        e.target.reset();
    };

    return (
        <form className="insert-form" onSubmit={submitTask}>
            <label>Create new task</label>
            <input
                type="text"
                id="_name"
                onChange={(e) => addNewTask(e, "name")}
                placeholder="Task name"
                autoComplete="off"
                required
            />
            <input type="submit" value="Create" />
        </form>
    );
};

export default CreateTaskForm;
