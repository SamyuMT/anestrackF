import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Registro.css';
import logo from '../assets/logo.png';
import { AuthContext } from '../App';

function Registro() {
  const [formData, setFormData] = useState({
    procesoClinico: '',
    agenteAnestesico: '',
    consumoMensual: ''
  });
  const { isTokenValid } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('https://anestrack.space/crear_registro/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: {
          agenteAne: formData.agenteAnestesico,
          clinico: formData.procesoClinico,
          conMensual: parseFloat(formData.consumoMensual)
        },
        token: isTokenValid
      })
    });
    const data = await response.status;
    console.log(data); // Log the response data to the console
    // Add form submission logic here
    if (response.status === 200) {
      alert('Registro creado exitosamente. Muchas gracias.');
      navigate('/token');
    } else {
      alert('Error al crear el registro');
    }
  };

  return (
    <div className="registro-container">
      <img src={logo} alt="AnesTrack Logo" className="logo" />
      <h1>ANESTRACK</h1>
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Ingrese el nombre del proceso clínico:
          <input
            type="text"
            name="procesoClinico"
            value={formData.procesoClinico}
            onChange={handleChange}
            placeholder="Nombre del proceso clínico"
          />
        </label>
        <label>
          Ingrese el agente anestésico:
          <select
            name="agenteAnestesico"
            value={formData.agenteAnestesico}
            onChange={handleChange}
          >
            <option value="">Seleccione un agente</option>
            <option value="desflurano">Desflurano</option>
            <option value="isoflurano">Isoflurano</option>
            <option value="sevoflurano">Sevoflurano</option>
          </select>
        </label>
        <label>
          Ingrese el consumo mensual de {formData.agenteAnestesico || 'agente'} en ml:
          <input
            type="number"
            name="consumoMensual"
            value={formData.consumoMensual}
            onChange={handleChange}
            placeholder="Consumo mensual en ml"
          />
        </label>
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default Registro;
