import { useContext } from "react";
import { AppContext } from "../Context";

const DeleteAllTasks = () => {
    const {
        taskLength,
        deleteTasks,
        disabledDeleteAll,
        setDisabledDeleteAll,
    } = useContext(AppContext);

    const deleteAllTasks = (e) => {
        e.preventDefault();
        setDisabledDeleteAll(true);
        deleteTasks();
        e.target.reset();
    };

    return taskLength ? (
        <form className="delete-all-form" onSubmit={deleteAllTasks}>
            <input
                type="submit"
                value="Delete All"
                disabled={disabledDeleteAll}
            />
        </form>
    ) : (null);
};

export default DeleteAllTasks;
