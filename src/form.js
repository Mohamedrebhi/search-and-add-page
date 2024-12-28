import React, { useState } from 'react';
import axios from 'axios';
import './form.css';
import { useNavigate } from 'react-router-dom'; // Import for navigation

const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina",
  "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain",
  "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin",
  "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil",
  "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon",
  "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile",
  "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia",
  "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica",
  "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea",
  "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland",
  "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana",
  "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
  "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India",
  "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
  "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati",
  "Korea", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia",
  "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein",
  "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia",
  "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania",
  "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco",
  "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand",
  "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway",
  "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea",
  "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar",
  "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis",
  "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa",
  "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal",
  "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia",
  "Slovenia", "Solomon Islands", "Somalia", "South Africa", "Spain",
  "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland",
  "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo",
  "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
  "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates",
  "United Kingdom", "United States", "Uruguay", "Uzbekistan",
  "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen",
  "Zambia", "Zimbabwe"
];

const Formulaire = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [formData, setFormData] = useState({
    societeName: '',
    directorName: '',
    importProducts: '',
    exportProducts: '',
    number: '',
    website: '',
    carteImage: null,
    departement: '',
    pays: '', // Country selection field
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      carteImage: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("societeName", formData.societeName);
    formDataToSend.append("directorName", formData.directorName);
    formDataToSend.append("departement", formData.departement);
    formDataToSend.append("importProducts", formData.importProducts);
    formDataToSend.append("exportProducts", formData.exportProducts);
    formDataToSend.append("number", formData.number);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("website", formData.website);
    formDataToSend.append("pays", formData.pays);

    if (formData.carteImage) {
      formDataToSend.append("carteImage", formData.carteImage);
    }

    try {
      const response = await axios.post('http://localhost:5000/add-record', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert(response.data.status);
      setFormData({
        societeName: '',
        directorName: '',
        departement: '',
        importProducts: '',
        exportProducts: '',
        number: '',
        email: '',
        website: '',
        pays: '',
        carteImage: null,
      });
    } catch (error) {
      console.error('Error adding record:', error);
      alert('Failed to add record.');
    }
  };

  return (
    <div>
      {/* Go Home Button */}
      <button
        onClick={() => navigate('/')}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007BFF',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          marginBottom: '20px',
        }}
      >
        Retourne
      </button>

      <div className="title-container">
        <h2>Ajout Du Societe</h2>
      </div>

      <div className="form-container">
        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <label>
              Société Name:
              <input
                type="text"
                name="societeName"
                value={formData.societeName}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Nom:
              <input
                type="text"
                name="directorName"
                value={formData.directorName}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              departement:
              <input
                type="text"
                name="departement"
                value={formData.departement}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Import Products (separate by commas):
              <textarea
                name="importProducts"
                value={formData.importProducts}
                onChange={handleChange}
                placeholder="Enter import product names separated by commas"
              />
            </label>
            <label>
              Export Products (separate by commas):
              <textarea
                name="exportProducts"
                value={formData.exportProducts}
                onChange={handleChange}
                placeholder="Enter export product names separated by commas"
              />
            </label>
            <label>
              Tel:
              <input
                type="number"
                name="number"
                value={formData.number}
                onChange={handleChange}
                className="contact-input tel"
                required
              />
            </label>
            <label>
              email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="contact-input email"
                required
              />
            </label>
            <label>
              Website:
              <input
                type="URL"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="contact-input website"
                required
              />
            </label>
            <label>
              Country:
              <select
                name="pays"
                value={formData.pays}
                onChange={handleChange}
                required
                style={{
                  maxHeight: "150px",
                  overflowY: "scroll",
                  display: "block",
                }}
              >
                <option value="" disabled>Select a country</option>
                {countries.map((country, index) => (
                  <option key={index} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Carte Image:
              <input
                type="file"
                name="carteImage"
                onChange={handleImageChange}
                accept="image/*"
              />
            </label>
            <button type="submit">Add Record</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Formulaire;
