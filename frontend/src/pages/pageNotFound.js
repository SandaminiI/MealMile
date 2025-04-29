import React from "react";
import Layout from "../components/Layout/Layout";
import { Link } from "react-router-dom";

const Pagenotfound = () => {
  return (
    <Layout title={"404 - Page Not Found"}>
      <div style={styles.container}>
        <h1 style={styles.title}>404</h1>
        <h2 style={styles.heading}>Oops! Page Not Found</h2>
        <p style={styles.text}>
          The page you are looking for might have been removed or is temporarily unavailable.
        </p>
        <Link to="/" className="BackButton">
          Go Back Home
        </Link>
      </div>
      <style>
      {`
        .BackButton {
            padding: 12px 24px;
            font-size: 16px;
            background-color: #BF3131;
            color: #EEEEEE;
            text-decoration: none;
            border-radius: 6px;
            transition: background-color 0.3s ease;
        }
        .BackButton:hover {
            background-color: #7D0A0A;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
          }
      `}
      </style>
    </Layout>
  );
};

const styles = {
  container: {
    minHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
    padding: '20px',
  },
  title: {
    fontSize: '120px',
    margin: '0',
    color: '#BF3131',
    fontWeight: 'bold',
  },
  heading: {
    fontSize: '32px',
    margin: '20px 0 10px',
    color: '#333',
  },
  text: {
    fontSize: '18px',
    marginBottom: '30px',
    color: '#555',
    maxWidth: '600px',
  },
//   button: {
//     padding: '12px 24px',
//     fontSize: '16px',
//     backgroundColor: '#7D0A0A',
//     color: '#fff',
//     textDecoration: 'none',
//     borderRadius: '6px',
//     transition: 'background-color 0.3s ease',
//   },
//   buttonHover: {
//     backgroundColor: '#BF3131',
//   },
};

export default Pagenotfound;
