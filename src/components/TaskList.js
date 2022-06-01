import { useContext, useState } from "react";
import { AppContext } from "../Context";

const TaskList = () => {
    const {
        tasks,
        taskLength,
        editMode,
        cancelEdit,
        updateTask,
        deleteTask,
    } = useContext(AppContext);

    const [newData, setNewData] = useState({});

    const saveBtn = () => {
        updateTask(newData);
    };

    const updateNewData = (e, field) => {
        setNewData({
            ...newData,
            [field]: e.target.value,
        });
    };

    const updateStatus = (e, id) => {
        let new_status = (e.target.checked ? "active" : "inactive");

        updateTask({
            id,
            "status": new_status,
        });
    };

    const enableEdit = (id, name) => {
        setNewData({ id, name });
        editMode(id);
    };

    const deleteConfirm = (id) => {
        if (window.confirm("Are you sure?")) {
            deleteTask(id);
        }
    };

    const formatDate = (datetime) => {
        return new Date(datetime).toLocaleString();
    }

    return !taskLength ? (
        <p>{taskLength === null ? "Loading..." : "Please insert some tasks."}</p>
    ) : (
        <table>
            <thead>
            <tr>
                <th>Status</th>
                <th>Id</th>
                <th>Name</th>
                <th>Created At</th>
                <th>Action</th>
            </tr>
            </thead>
            <tbody>
            {tasks.map(({ id, name, status, created_at, isEditing, isDeleted }) => {
                return isEditing === true ? (
                    <tr key={id}>
                        <td>
                            <input
                                type="checkbox"
                                defaultChecked={status === "active"}
                                onChange={(e) => updateStatus(e, id)}
                            />
                        </td>
                        <td>{id}</td>
                        <td>
                            <input
                                type="name"
                                defaultValue={name}
                                onChange={(e) => updateNewData(e, "name")}
                            />
                        </td>
                        <td>{formatDate(created_at)}</td>
                        <td>
                            <button className="btn green-btn" onClick={() => saveBtn()}>
                                Save
                            </button>
                            <button
                                className="btn default-btn"
                                onClick={() => cancelEdit(id)}
                            >
                                Cancel
                            </button>
                        </td>
                    </tr>
                ) : (
                    <tr key={id}>
                        <td>
                            <input
                                type="checkbox"
                                defaultChecked={status === "active"}
                                onChange={(e) => updateStatus(e, id)}
                                disabled={isDeleted}
                            />
                        </td>
                        <td>{id}</td>
                        <td>{name}</td>
                        <td>{formatDate(created_at)}</td>
                        <td>
                            <button
                                className="btn default-btn"
                                onClick={() => enableEdit(id, name)}
                                disabled={isDeleted}
                            >
                                Edit
                            </button>
                            <button
                                className="btn red-btn"
                                onClick={() => deleteConfirm(id)}
                                disabled={isDeleted}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                );
            })}
            </tbody>
        </table>
    );
};

export default TaskList;
