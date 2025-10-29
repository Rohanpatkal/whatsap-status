import React, { useState } from "react";
import { Filesystem, Directory } from "@capacitor/filesystem";

const App = () => {
  const [media, setMedia] = useState([]);

  const loadStatuses = async () => {
    try {
      // Path to WhatsApp statuses folder (Android 11+)
      const statusPath = "Android/media/com.whatsapp/WhatsApp/Media/.Statuses";

      // Read directory
      const result = await Filesystem.readdir({
        path: statusPath,
        directory: Directory.External,
      });

      const files = [];

      for (const file of result.files) {
        if (/\.(jpg|jpeg|png|mp4)$/i.test(file.name)) {
          // Read file data
          const fileData = await Filesystem.readFile({
            path: `${statusPath}/${file.name}`,
            directory: Directory.External,
          });

          // Convert to base64 URL
          const src = `data:image/jpeg;base64,${fileData.data}`;
          files.push({ name: file.name, src });
        }
      }

      setMedia(files);
    } catch (err) {
      console.error("Error reading statuses:", err);
      alert("Could not access WhatsApp statuses. Make sure you gave storage permission.");
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2>📸 WhatsApp Status Gallery</h2>
        <button style={styles.button} onClick={loadStatuses}>
          Load Statuses
        </button>
      </header>

      <div style={styles.gallery}>
        {media.map((item, index) => (
          <img key={index} src={item.src} alt={item.name} style={styles.image} />
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
  },
  header: {
    backgroundColor: "#4a90e2",
    color: "#fff",
    padding: "10px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#fff",
    color: "#4a90e2",
    border: "none",
    borderRadius: "6px",
    padding: "8px 16px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  gallery: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "10px",
    padding: "10px",
  },
  image: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: "8px",
  },
};

export default App;
