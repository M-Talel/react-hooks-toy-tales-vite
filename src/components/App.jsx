import React, { useEffect, useState } from "react";

import Header from "./Header";
import ToyForm from "./ToyForm";
import ToyContainer from "./ToyContainer";

const API_BASE = "http://localhost:3001";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [toys, setToys] = useState([]);

  function handleClick() {
    setShowForm((showForm) => !showForm);
  }

  useEffect(() => {
    let cancelled = false;

    fetch(`${API_BASE}/toys`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setToys(data);
      })
      .catch((err) => {
        // In this lab, errors aren't asserted; keep console for visibility.
        console.error(err);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function handleCreateToy({ name, image }) {
    return fetch(`${API_BASE}/toys`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, image, likes: 0 }),
    })
      .then((res) => res.json())
      .then((createdToy) => {
        setToys((prev) => [...prev, createdToy]);
      });
  }

  function handleDeleteToy(id) {
    return fetch(`${API_BASE}/toys/${id}`, {
      method: "DELETE",
    }).then(() => {
      setToys((prev) => prev.filter((toy) => toy.id !== id));
    });
  }

  function handleLikeToy(id) {
    const toy = toys.find((t) => t.id === id);
    const newLikes = (toy?.likes ?? 0) + 1;

    return fetch(`${API_BASE}/toys/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ likes: newLikes }),
    })
      .then((res) => res.json())
      .then((updatedToy) => {
        setToys((prev) =>
          prev.map((t) => (t.id === id ? updatedToy : t))
        );
      });
  }

  return (
    <>
      <Header />
      {showForm ? <ToyForm onCreateToy={handleCreateToy} /> : null}
      <div className="buttonContainer">
        <button onClick={handleClick}>Add a Toy</button>
      </div>
      <ToyContainer toys={toys} onLike={handleLikeToy} onDonate={handleDeleteToy} />
    </>
  );
}

export default App;

