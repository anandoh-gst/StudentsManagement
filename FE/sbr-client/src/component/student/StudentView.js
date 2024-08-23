import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaEye, FaTrashAlt } from "react-icons/fa";
import { FaArrowsRotate } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Search from "../common/Search";

const StudentsView = () => {
  const [students, setStudents] = useState([]);
  const [loadingDelete, setloadingDelete] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    const result = await axios.get("http://localhost:9192/students", {
      validateStatus: () => {
        return true;
      },
    });
    if (result.status === 302) {
      setStudents(result.data);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (confirmDelete) {
      try {
        // Imposta il caricamento su `true` per il pulsante di questo specifico studente
        setloadingDelete((prevState) => ({
          ...prevState,
          [id]: true,
        }));

        // Esegui la richiesta di cancellazione
        await axios.delete(`http://localhost:9192/students/delete/${id}`);

        // Notifica di successo
        alert("Student deleted successfully!");

        // Ricarica la lista degli studenti (o aggiorna lo stato)
        loadStudents();
      } catch (error) {
        console.error("There was an error deleting the student!", error);
        alert("Failed to delete the student. Please try again.");
      } finally {
        // Imposta il caricamento su `false` dopo la richiesta
        setloadingDelete((prevState) => ({
          ...prevState,
          [id]: false,
        }));
      }
    }
  };

  return (
    <section>
      {<Search search={search} setSearch={setSearch} />}
      <table className="table table-bordered table-hover shadow">
        <thead>
          <tr>
            <th
              colSpan="8"
              className="text-center"
              style={{ cursor: "pointer" }}
              onClick={() => loadStudents()}
            >
              <FaArrowsRotate />
            </th>
          </tr>
          <tr className="text-center">
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Depatment</th>
            <th colSpan="3">Actions</th>
          </tr>
        </thead>

        <tbody className="text-center">
          {students
            .filter((st) => st.firstname.toLowerCase().includes(search))
            .map((student, index) => (
              <tr key={student.id}>
                <th scope="row" key={index}>
                  {index + 1}
                </th>
                <td>{student.firstname}</td>
                <td>{student.lastname}</td>
                <td>{student.email}</td>
                <td>{student.department}</td>
                <td className="mx-2">
                  <Link
                    to={`/student-profile/${student.id}`}
                    className="btn btn-info"
                  >
                    {<FaEye />}
                  </Link>
                </td>
                <td className="mx-2">
                  <Link
                    to={`/edit-student/${student.id}`}
                    className="btn btn-warning"
                  >
                    {<FaEdit />}
                  </Link>
                </td>
                <td className="mx-2">
                  <button
                    id="btnDelete"
                    className="btn btn-danger"
                    disabled={loadingDelete[student.id] || false} // Disabilita il pulsante durante il caricamento
                    onClick={() => handleDelete(student.id)}
                  >
                    {loadingDelete[student.id] ? "Deleting..." : <FaTrashAlt />}{" "}
                    {/* Mostra un'icona o un testo di caricamento */}
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </section>
  );
};

export default StudentsView;
