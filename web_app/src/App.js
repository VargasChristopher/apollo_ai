import React, { useState } from 'react';
import './App.css';

const ApolloAI = () => {
  const [gallery, setGallery] = useState([]);

  // Function to prevent default drag behaviors
  const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle file drop
  const handleDrop = (e) => {
    preventDefaults(e); // Prevent default behaviors
    let files = e.dataTransfer.files; // Get files from the drag event
    handleFiles(files); // Process the files
  };

  // Handle file input change (including camera)
  const handleFileChange = (e) => {
    let files = e.target.files;
    handleFiles(files); // Process files selected via input or camera
  };

  // Process and preview the files
  const handleFiles = (files) => {
    [...files].forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newFile = {
          name: file.name,
          filePath: reader.result // This will be the file's base64 data URL for preview
        };
        setGallery((prevGallery) => [...prevGallery, newFile]); // Update gallery state
      };
      reader.readAsDataURL(file); // Convert the file to base64 string for preview
    });
  };

  // Handle removing a file from the gallery
  const removeFile = (fileName) => {
    setGallery((prevGallery) => prevGallery.filter((file) => file.name !== fileName));
  };

  // Handle camera button click to trigger camera input
  const handleCameraClick = () => {
    document.getElementById('camera-input').click(); // Programmatically click camera input
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', overflowX: 'hidden', fontFamily: "'Poppins', sans-serif" }}>
      {/* Title */}
      <header style={{ textAlign: 'center', padding: '30px' }}>
        <h1 style={{ color: '#ffcc00', fontSize: '4rem', fontWeight: 600 }}>Apollo AI</h1>
        <p style={{ fontSize: '1.2rem', color: '#fff', margin: '20px 0' }}>
          Revolutionizing Accessibility with AI
        </p>
      </header>

      {/* Navbar */}
      <nav style={{ display: 'flex', alignItems: 'center', padding: '20px 50px', position: 'absolute', top: 0, left: 0 }}>
        <ul style={{ display: 'flex', gap: '30px', margin: 0, padding: 0, listStyle: 'none' }}>
          <li><a href="#home" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500, fontSize: '1.1rem' }}>Home</a></li>
          <li><a href="#about" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500, fontSize: '1.1rem' }}>File Drop</a></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <div id="home" style={{ height: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 20px' }}>
        <h1 style={{ fontSize: '2.76rem', marginBottom: '20px', fontWeight: 600, letterSpacing: '1px' }}>
          More Independence. More Accessibility. More Empowerment. <span style={{ color: '#ffcc00', fontSize: '4rem' }}>Guaranteed.</span>
        </h1>
        <p style={{ fontSize: '1.2rem', fontWeight: 400, marginBottom: '30px', maxWidth: '700px', lineHeight: 1.6 }}>
          Apollo AI is a cutting-edge accessibility tool that integrates with various language models (LLMs) to help disabled individuals, particularly those who are blind, interact with digital content seamlessly. By leveraging Alexa, Apollo AI enables users to have their homework documents and readings read aloud to them.
        </p>
        <a href="#drop-area" style={{ backgroundColor: '#f0f0f0', color: '#333', padding: '15px 30px', fontSize: '1.2rem', fontWeight: 600, borderRadius: '40px', cursor: 'pointer', textDecoration: 'none' }}>Drop Files!</a>
      </div>

      {/* About Section */}
      <section id="about" style={{ margin: '20px auto', padding: '30px', maxWidth: '800px', backgroundColor: '#2b2b2b', borderRadius: '12px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)', color: '#ccc', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.2rem', color: 'white' }}>About Apollo AI</h2>
        <p style={{ fontSize: '1.2rem', lineHeight: 1.8 }}>
          Apollo AI is an accessibility tool that allows various LLMs to interact with Alexa to help disabled individuals, especially blind users, to have their homework documents or readings read out to them. This tool enables users to ask questions about their readings, summarize their documents, and request adjustments like speeding up or slowing down the reading speed to enhance their learning experience.
        </p>
      </section>

      {/* File Drop Area */}
      <div id="drop-area"
        style={{
          margin: '20px auto', width: '450px', padding: '50px', background: 'linear-gradient(135deg, #444, #333)',
          borderRadius: '20px', border: '2px dashed #666', textAlign: 'center', color: 'white', cursor: 'pointer'
        }}
        onDragEnter={preventDefaults}
        onDragOver={preventDefaults}
        onDragLeave={preventDefaults}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input').click()}
      >
        <p style={{ fontSize: '1.2rem', fontWeight: 600, color: '#bbb' }}>Drag and drop files here, or click to select files</p>
        <input type="file" id="file-input" multiple accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
      </div>

      {/* Gallery (Preview of Uploaded Files) */}
      <div id="gallery" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
        {gallery.map((file, index) => (
          <div key={index} style={{ position: 'relative', display: 'inline-block', margin: '10px' }}>
            <img
              src={file.filePath}
              alt={`Preview ${index}`}
              style={{ maxWidth: '150px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.5)' }}
            />
            <button
              onClick={() => removeFile(file.name)}
              style={{
                position: 'absolute', top: '-10px', right: '-10px', backgroundColor: '#ff0000', color: '#fff',
                border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer'
              }}
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      {/* Camera Button */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button className="btn-camera" style={{ backgroundColor: '#ffcc00', color: '#000', padding: '15px 30px', fontSize: '1.2rem', fontWeight: 600, borderRadius: '40px', cursor: 'pointer', border: 'none' }} onClick={handleCameraClick}>
          Open Camera
        </button>
        <input type="file" id="camera-input" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handleFileChange} />
      </div>

      {/* Empty Space */}
      <div style={{ height: '100px' }}></div>

      {/* Footer */}
      <footer style={{ backgroundColor: '#111', color: '#fff', textAlign: 'center', padding: '20px', fontSize: '0.9rem', width: '100%' }}>
        &copy; 2024 Apollo AI. All Rights Reserved.
      </footer>
    </div>
  );
};

export default ApolloAI;
