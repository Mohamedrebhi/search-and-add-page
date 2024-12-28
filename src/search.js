import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import Modal from 'react-modal';
import './search.css';

const SearchPage = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false); // Modal state
  const [selectedImage, setSelectedImage] = useState(null); // Selected image for modal
  const navigate = useNavigate(); // Initialize navigation hook

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/get-companies');
        const result = await response.json();
        setData(result);
        setIsDataLoaded(true);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const highlightText = (text, query, color) => {
    if (typeof text !== 'string') return text;

    let highlightedText = text;

    if (query.trim() !== '') {
      const queries = query.split(',').map((q) => q.trim()).filter(Boolean);
      queries.forEach((queryTerm) => {
        const regex = new RegExp(`(${queryTerm})`, 'gi');
        highlightedText = highlightedText.replace(regex, (match) => {
          return `<span style="background-color: ${color};">${match}</span>`;
        });
      });
    }

    return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
  };

  const highlightColumnHeader = (headerName, query) => {
    const queries = query.split(',').map((q) => q.trim()).filter(Boolean);
   
    if (queries.some((query) => headerName.toLowerCase().includes(query.toLowerCase()))) {
      return <span style={{ backgroundColor: '#ffcccb' }}>{headerName}</span>;
    }
    return headerName;
  };

  // Filter data based on search query (if any)
  const filteredData = searchQuery
    ? data.filter((item) => {
        const queries = searchQuery.split(',').map((q) => q.trim()).filter(Boolean);

        return queries.some((query) => {
          const importProducts = item.importProducts?.join(' ').toLowerCase() || '';
          const exportProducts = item.exportProducts?.join(' ').toLowerCase() || '';
          const pays = item.pays?.toLowerCase() || '';
          const societeName = item.societeName?.toLowerCase() || '';
          const directorName = item.directorName?.toLowerCase() || '';
          const departement = item.departement?.toLowerCase() || '';
          const email = item.email?.toLowerCase() || '';
          const number = item.number?.toLowerCase() || '';
          const website = item.website?.toLowerCase() || '';
          

          return (
            importProducts.includes(query) ||
            exportProducts.includes(query) ||
            pays.includes(query) ||
            societeName.includes(query) ||
            directorName.includes(query) ||
            departement.includes(query) ||
            email.includes(query) ||
            number.includes(query) ||
            website.includes(query) 
            
          );
        });
      })
    : data;

  // Function to open the modal and set the selected image
  const openModal = (imagePath) => {
    setSelectedImage(imagePath);
    setModalIsOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="page-container">
      {/* Button to go back to the home page */}
      <button
        onClick={() => navigate('/')}
        style={{
          margin: '20px',
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Retourne
      </button>

      <div className="search-container">
        <h2 className="search-title">Search</h2>
        <form onSubmit={(e) => e.preventDefault()} className="search-form">
          <input
            type="text"
            className="search-input"
            placeholder="Search by company, director, or product (e.g., 'helba, import')"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button type="submit" className="search-button">Search</button>
        </form>
      </div>

      <table className="results-table">
        <thead>
          <tr>
            <th>#</th>
            <th>{highlightColumnHeader('Societe Name', searchQuery)}</th>
            <th>{highlightColumnHeader('Director Name', searchQuery)}</th>
            <th>{highlightColumnHeader('Departement', searchQuery)}</th>
            <th>{highlightColumnHeader('Import Products', searchQuery)}</th>
            <th>{highlightColumnHeader('Export Products', searchQuery)}</th>
            <th>{highlightColumnHeader('Pays', searchQuery)}</th>
            <th>{highlightColumnHeader('Contact Number', searchQuery)}</th>
            <th>{highlightColumnHeader('Email', searchQuery)}</th>
            <th>{highlightColumnHeader('Website', searchQuery)}</th>
            <th>{highlightColumnHeader('Carte Image', searchQuery)}</th>
           
          </tr>
        </thead>
        <tbody>
          {isDataLoaded ? (
            filteredData.length === 0 ? (
              <tr>
                <td colSpan="11">No results found.</td>
              </tr>
            ) : (
              filteredData.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{highlightText(item.societeName || '', searchQuery, '#a8d8ea')}</td>
                  <td>{highlightText(item.directorName || '', searchQuery, '#ffd3b6')}</td>
                  <td>{highlightText(item.departement || '', searchQuery, '#ffaaa5')}</td>
                  <td>{highlightText(item.importProducts?.join(', ') || '', searchQuery, '#d4a5a5')}</td>
                  <td>{highlightText(item.exportProducts?.join(', ') || '', searchQuery, '#ffcccb')}</td>
                  <td>{item.pays}</td>
                  <td>{item.number}</td>
                  <td>{item.email}</td>
                  <td>
                    {item.website ? (
                      <a
                        href={item.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'blue', textDecoration: 'underline' }}
                      >
                        {item.website}
                      </a>
                    ) : "No Website"}
                  </td>
                  <td>
                    {item.carteImage ? (
                      <img
                        src={`http://localhost:5000/${item.carteImage}`}
                        alt="Company Image"
                        width="100"
                        style={{ cursor: 'pointer' }}
                        onClick={() => openModal(`http://localhost:5000/${item.carteImage}`)} // Open modal on click
                      />
                    ) : "No Image"}
                  </td>
                 
                </tr>
              ))
            )
          ) : (
            <tr>
              <td colSpan="11">Loading...</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal to display the image */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Large Image"
        style={{
          content: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.7)',
            border: 'none',
            padding: '20px',
            maxWidth: '80%',
            maxHeight: '80%',
          },
        }}
      >
        <div>
          <img
            src={selectedImage}
            alt="Enlarged"
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              objectFit: 'contain',
            }}
          />
          <button
            onClick={closeModal}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              backgroundColor: 'red',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              padding: '10px',
              cursor: 'pointer',
            }}
          >
            X
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SearchPage;
