import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL;

export const Actions = () => {
    let [tasks, setTasks] = useState([]);

    let [taskLength, setTaskLength] = useState(null);

    const [disabledDeleteAll, setDisabledDeleteAll] = useState(false);

    useEffect(() => {
        fetch(`${API_URL}/api/tasks`)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                if (data.tasks.length > 0) {
                    setTasks(data.tasks);
                    setTaskLength(true);
                } else {
                    setTaskLength(0);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const createTask = (newTask) => {
        fetch(`${API_URL}/api/tasks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newTask),
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                if (data.id) {
                    setTasks([
                        ...tasks,
                        {
                            id: data.id,
                            status: data.status,
                            created_at: data.created_at,
                            ...newTask,
                        },
                    ]);
                    setTaskLength(true);
                } else {
                    alert(data.msg);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const editMode = (id) => {
        tasks = tasks.map((task) => {
            if (task.id === id) {
                task.isEditing = true;
                return task;
            }
            task.isEditing = false;
            return task;
        });
        setTasks(tasks);
    };

    const cancelEdit = (id) => {
        tasks = tasks.map((task) => {
            if (task.id === id) {
                task.isEditing = false;
                return task;
            }
            return task;
        });
        setTasks(tasks);
    };

    const updateTask = (taskData) => {
        fetch(`${API_URL}/api/tasks/${taskData.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(taskData),
        })
            .then((res) => {
                return res;
            })
            .then(() => {
                tasks = tasks.map((task) => {
                    if (task.id === taskData.id) {
                        task.isEditing = false;
                        task.name = taskData.name || task.name;
                        task.status = taskData.status || task.status;
                        return task;
                    }
                    return task;
                });
                setTasks(tasks);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const deleteTask = (theID) => {
        let taskDeleted = tasks.filter((task) => {
            return task.id !== theID;
        });
        fetch(`${API_URL}/api/tasks/${theID}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then((res) => {
                return res
            })
            .then(() => {
                setTasks(taskDeleted);
                if (tasks.length === 1) {
                    setTaskLength(0);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const deleteTasks = () => {
        fetch(`${API_URL}/api/tasks/delete_all`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then((res) => {
                return res
            })
            .then(() => {
                tasks = tasks.map((task) => {
                    task.isDeleted = true;
                    return task;
                });
                setTasks(tasks);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return {
        tasks,
        editMode,
        cancelEdit,
        updateTask,
        createTask,
        deleteTask,
        deleteTasks,
        taskLength,
        disabledDeleteAll,
        setDisabledDeleteAll,
    };
};
