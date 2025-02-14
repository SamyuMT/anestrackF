import React, { useState, useEffect, useContext } from 'react';
import './TablaAdmin.css';
import logo from '../assets/images.png';
import { AuthContext } from '../App';

function TablaAdmin() {
  const [registros, setRegistros] = useState([]);
  const [reportes, setReportes] = useState([]);
  const [selectedReporte, setSelectedReporte] = useState('');
  const [token, setToken] = useState('');
  const [fecha, setFecha] = useState({ dia: '', mes: '', year: '' });
  const [activeTab, setActiveTab] = useState('tabla');
  const { isTokenValid } = useContext(AuthContext);

  useEffect(() => {
    // Fetch registros
    const fetchRegistros = async () => {
      try {
        const response = await fetch('https://anestrack.space/get_registros/info');
        const data = await response.json();
        setRegistros(data.data);
      } catch (error) {
        console.error('Error fetching registros:', error);
      }
    };

    // Fetch reportes
    const fetchReportes = async () => {
      try {
        const response = await fetch('https://anestrack.space/get_reportes/info');
        const data = await response.json();
        setReportes(data.data);
      } catch (error) {
        console.error('Error fetching reportes:', error);
      }
    };

    fetchRegistros();
    fetchReportes();
  }, []);

  const handleReporteChange = (e) => {
    setSelectedReporte(e.target.value);
  };

  const handleFechaChange = (e) => {
    const [year, mes, dia] = e.target.value.split('-');
    setFecha({ dia, mes, year });
  };

  const handleGenerateToken = async (e) => {
    e.preventDefault();
    const response = await fetch('https://anestrack.space/crear_reporte/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: {
          dia: parseInt(fecha.dia),
          mes: parseInt(fecha.mes),
          year: parseInt(fecha.year)
        },
        id: '67ac0c06038754bbb63722171029192'
      })
    });
    const token = await response.text();
    setToken(token);
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(token);
    alert('Token copiado al portapapeles');
  };

  const handleGenerateReport = () => {
    const visibleData = registros.filter((registro) => !selectedReporte || registro.token === selectedReporte);
    console.log('Datos visibles:', visibleData);
    window.print();
  };

  return (
    <div className="tabla-admin-container">
      <img src={logo} alt="AnesTrack Logo" className="logo" />
      <h1>ANESTRACK</h1>
      <div className="tab-buttons">
        <button onClick={() => setActiveTab('tabla')}>Ver Tabla</button>
        <button onClick={() => setActiveTab('token')}>Generar Token</button>
      </div>
      {activeTab === 'tabla' && (
        <div className="tabla-content">
          <h2>Tabla Admin</h2>
          <div className="filtro-reporte">
            <label htmlFor="reporte-select">Seleccione un reporte:</label>
            <select id="reporte-select" value={selectedReporte} onChange={handleReporteChange}>
              <option value="">Seleccione un reporte</option>
              {Array.isArray(reportes) && reportes.map((reporte) => (
                <option key={reporte.token} value={reporte.token}>
                  {`${reporte.dia}/${reporte.mes}/${reporte.year}`}
                </option>
              ))}
            </select>
          </div>
          <table className="tabla-registros">
            <thead>
              <tr>
                <th>Agente Anestésico</th>
                <th>Clínico</th>
                <th>Consumo Mensual (ml)</th>
                <th>Índice Día</th>
                <th>Índice Semana</th>
                <th>Número de Botellas</th>
                <th>Token</th>
              </tr>
            </thead>
            <tbody>
              {registros
                .filter((registro) => !selectedReporte || registro.token === selectedReporte)
                .map((registro) => (
                  <tr key={registro.token}>
                    <td>{registro.agenteAne}</td>
                    <td>{registro.clinico}</td>
                    <td>{registro.conMensual}</td>
                    <td>{registro.indiceDia}</td>
                    <td>{registro.indiceSemana}</td>
                    <td>{registro.numeroBotellas}</td>
                    <td>{registro.token}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          <button onClick={handleGenerateReport}>Generar Reporte</button>
        </div>
      )}
      {activeTab === 'token' && (
        <div className="token-content">
          <h2>Generar Token</h2>
          <form onSubmit={handleGenerateToken}>
            <label>
              Fecha:
              <input type="date" onChange={handleFechaChange} required />
            </label>
            <button type="submit">Generar</button>
          </form>
          {token && (
            <div className="token-display">
              <p>Token generado: {token}</p>
              <button onClick={handleCopyToken}>Copiar Token</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TablaAdmin;
