import Navabr from "./Navabr";
import Form from "./Form";
import { DataTable } from "./DataTable";
import EditExpenseModal from "./EditExpenseModal";

function App() {
  return (
    <div className="container mx-auto">
      <Navabr />
      <Form />
      <br />
      <hr />
      <DataTable />
      <EditExpenseModal />
    </div>
  );
}

export default App;
