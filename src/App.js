import { Provider } from "./Context";
import CreateTaskForm from "./components/CreateTaskForm";
import UserList from "./components/TaskList";
import DeleteAllTasks from "./components/DeleteAllTasks";
import { Actions } from "./Actions";

function App() {
  const data = Actions();
  return (
    <Provider value={data}>
      <div className="App">
        <h1>TODOS v1.2</h1>
        <div className="wrapper">
          <section className="create-section">
            <CreateTaskForm />
          </section>
          <section className="list-section">
            <UserList />
          </section>
          <section className="delete-section">
            <DeleteAllTasks />
          </section>
        </div>
      </div>
    </Provider>
  );
}

export default App;
