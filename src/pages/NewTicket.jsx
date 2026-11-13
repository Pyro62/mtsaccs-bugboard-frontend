import Form from "../components/Form";
import { createTicket } from "../api";

const NewTicket = () => {
  async function handleCreateTicket(ticket) {
    // Throws an Error with the API's message on failure (e.g. a 422 for a bad field),
    // so Form can catch it and show a toast, same as before.
    await createTicket(ticket);
  }

  return <Form onCreateTicket={handleCreateTicket} />;
};

export default NewTicket;