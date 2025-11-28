<!-- Logo -->
<p align="center">
  <img src="optistocks_optimizer/client/src/assets/wide_logo.png" alt="OptiStocks Logo" width="800"/>
</p>

---

# OptiStocks – Intelligent Inventory Optimization & Demand Forecasting 🚚📊

OptiStocks is a **full-stack inventory management and demand forecasting platform** designed for modern businesses to monitor inventory, analyze sales performance, and **predict future demand using ARIMA/SARIMA models**.

The system combines an intuitive web dashboard with a powerful time-series forecasting engine, helping companies **reduce stockouts, avoid overstocking, and make data-driven purchasing decisions**.

---

## ✨ Key Features

- Add & manage companies and their stocks
- Real-time inventory analytics & KPIs
- ARIMA / SARIMA based demand forecasting
- Interactive visualizations for historical & forecasted sales
- Order recommendations dashboard
- Secure authentication (JWT-based)
- Deployed full-stack application with ML integration

---

## 🛠 Tech Stack

### 🔹 Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3)

### 🔹 Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb)

### 🔹 Machine Learning / Analytics
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python)
![Streamlit](https://img.shields.io/badge/Streamlit-FF4B4B?style=for-the-badge&logo=streamlit)
![Statsmodels](https://img.shields.io/badge/Statsmodels-0A497B?style=for-the-badge)
![Pandas](https://img.shields.io/badge/Pandas-150458?style=for-the-badge&logo=pandas)
![Plotly](https://img.shields.io/badge/Plotly-3F4F75?style=for-the-badge&logo=plotly)

---

## 🚀 Deployment

| Component | Platform | Link |
|---------|----------|------|
| Frontend | Vercel | https://demand-forecasting-pink.vercel.app|
| Backend API | Render | https://optistocks-optimizer.onrender.com |
| ARIMA Forecasting (ML) | Streamlit Cloud | https://demandforecast1.streamlit.app |

> ⚠️ **Note:** Render uses free instances.  
> The backend may take **5–10 seconds to wake up** on first request.

---

## 🧪 Bonus & Evaluation Highlights

✅ Attempted **Full-Stack Track (Web + API + Database)**  
✅ Implemented **authentication using JWT**  
✅ Integrated **Machine Learning pipeline (ARIMA/SARIMA)**  
✅ Separate ML deployment using **Streamlit Cloud**  
✅ Deployed frontend & backend separately  
✅ Focused on **UX, dark theme, smooth navigation & visual clarity**  
✅ Clean project structure & documentation  

---

## 🖥 Local Setup Instructions

### 1️⃣ Clone the repository
```bash
git clone https://github.com/sanjayjr8/Demand-Forecasting.git
cd Demand-Forecasting/optistocks_optimizer
```

### 2️⃣ Start Backend (Node + Express)
```bash
cd server
npm install
```

Create a `.env` file inside `server/`:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=10000
```

Then run:
```bash
npm run dev
```

Backend runs at:
```
http://localhost:10000
```

### 3️⃣ Start Frontend (React + Vite)
Open a new terminal:
```bash
cd client
npm install
npm run dev
```

Frontend runs at:
```
http://localhost:5173
```

### 4️⃣ Run ARIMA Streamlit App (Optional – Local)
```bash
cd server/arima
pip install -r requirements.txt
streamlit run test.py
```

---

## 📸 Screenshots / Demo

Screenshots and screen-recording are available in the repository and deployment links above.
<img width="1888" height="1010" alt="image" src="https://github.com/user-attachments/assets/5d456218-3319-49e0-b155-db83f156f403" />
<img width="1919" height="949" alt="image" src="https://github.com/user-attachments/assets/6452f553-0997-4e0c-ac95-dd430d8d4e9b" />
<img width="1864" height="930" alt="image" src="https://github.com/user-attachments/assets/f4ed3ed5-9be2-4a33-9028-42e2868915cf" />
<img width="1871" height="1001" alt="image" src="https://github.com/user-attachments/assets/f77751cc-f9f2-4857-a974-1677393fadaa" />




---

## 📌 Assumptions

- Uploaded CSV data follows a time-series format (Month, Sales)
- Render free tier cold start delay is expected
- Forecasting parameters are user-controlled to demonstrate flexibility

---

## 👤 Author

**Sanjay J**  
Final Year B.Tech – CSE  
GitHub: https://github.com/sanjayjr8  
LinkedIn: https://linkedin.com/in/sanjayj08

Built with focus on clean design, scalability, and real-world usability.
