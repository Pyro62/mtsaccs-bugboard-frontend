import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Board from "../components/Board";
import { getTickets, setResolved, deleteTicket } from "../api";

const Home = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    async function fetchTickets() {
      try {
        setTickets(await getTickets());
      } catch (err) {
        toast.error(err.message || "Failed to load tickets!");
      }
    }

    fetchTickets();
  }, []);

  async function handleToggleTicket(id, isResolved) {
    try {
      // The API returns the updated ticket, so the UI shows what the server saved.
      const updated = await setResolved(id, !isResolved);
      setTickets((prev) => prev.map((t) => (t.id === id ? updated : t)));
      toast.success(isResolved ? "Ticket unresolved!" : "Ticket resolved!");
    } catch (err) {
      toast.error(err.message || "Failed to update ticket!");
    }
  }

  async function handleDeleteTicket(id) {
    try {
      await deleteTicket(id);
      setTickets((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      toast.error(err.message || "Failed to delete ticket!");
    }
  }

  return (
    <Board
      tickets={tickets}
      onToggleTicket={handleToggleTicket}
      onDeleteTicket={handleDeleteTicket}
    />
  );
};

export default Home;