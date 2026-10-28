import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../Redux/Actions/UsersActions";

const BiologisteDashboard = () => {
  const dispatch = useDispatch();
  const allUsers = useSelector((state) => state.UsersReducer?.allUsers || []);
  const patients = allUsers.filter((u) => u.role === "Patient");
  const userState = useSelector((state) => state.UsersReducer.user);
  const [NumeroDossier, setNumeroDossier] = useState("");
  const [TypeAnalyse, setTypeAnalyse] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [tests, setTests] = useState([
    { testName: "", ValeurResultat: "", ValeurUsuelle: "" },
  ]);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleTestChange = (index, field, value) => {
    const newTests = [...tests];
    newTests[index][field] = value;
    setTests(newTests);
  };

  const addTestField = () => {
    setTests([
      ...tests,
      { testName: "", ValeurResultat: "", ValeurUsuelle: "" },
    ]);
  };

  const removeTestField = (index) => {
    const newTests = tests.filter((_, i) => i !== index);
    setTests(newTests);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const analyseData = {
  //     patient: selectedPatient,
  //     NumeroDossier,
  //     TypeAnalyse,
  //     Tests: tests,
  //   };

  //   try {
  //     const res = await fetch("http://localhost:5000/api/Analyses", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //       body: JSON.stringify(analyseData),
  //     });
  //     const data = await res.json();
  //     if (res.ok) {
  //       alert("Analyse enregistrée avec succès");
  //       setNumeroDossier("");
  //       setTypeAnalyse("");
  //       setSelectedPatient("");
  //       setTests([{ testName: "", ValeurResultat: "", ValeurUsuelle: "" }]);
  //     } else {
  //       alert(data.error);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  return (
    <div className="container my-5">
      <h2 className="fw-bold text-success mb-4">🔬 Biologiste Dashboard</h2>

      <div className="card shadow border-0 p-4 rounded-3">
        <h4 className="mb-3 text-primary">Ajouter un Résultat d'Analyse</h4>

        <form>
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label fw-bold">
                Sélectionner le Patient
              </label>
              <select
                className="form-select"
                value={selectedPatient}
                onChange={(e) => {console.log(e.target.value);setSelectedPatient(e.target.value)}}
                required
              >
                <option value="">-- Choisir un patient --</option>
                {patients.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">N° Dossier</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ex: 2025/022246"
                value={NumeroDossier}
                onChange={(e) => setNumeroDossier(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Type d'analyse</label>
            <input
              type="text"
              className="form-control"
              value={TypeAnalyse}
              onChange={(e) => setTypeAnalyse(e.target.value)}
              required
            />
          </div>

          <hr />
          <h5 className="fw-bold text-secondary">Détails des Tests</h5>

          {tests.map((test, index) => (
            <div className="row mb-3 align-items-center" key={index}>
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nom du test (ex: ASLO)"
                  value={test.testName}
                  onChange={(e) =>
                    handleTestChange(index, "testName", e.target.value)
                  }
                  required
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Résultat (ex: < 200 UI/ml)"
                  value={test.ValeurResultat}
                  onChange={(e) =>
                    handleTestChange(index, "ValeurResultat", e.target.value)
                  }
                  required
                />
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Valeurs Usuelles (ex: < 200)"
                  value={test.ValeurUsuelle}
                  onChange={(e) =>
                    handleTestChange(index, "ValeurUsuelle", e.target.value)
                  }
                  required
                />
              </div>
              <div className="col-md-1">
                {tests.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => removeTestField(index)}
                  >
                    ❌
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            className="btn btn-outline-primary btn-sm mb-4"
            onClick={addTestField}
          >
            ➕ Ajouter un autre test
          </button>

          <div>
            <button type="submit" className="btn btn-success fw-bold px-4">
              Enregistrer et Publier l'Analyse
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BiologisteDashboard;
