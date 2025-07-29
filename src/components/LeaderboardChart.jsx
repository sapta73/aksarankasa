import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function LeaderboardChart({ data, mode }) {
  // Tentukan kunci data berdasarkan mode yang aktif
  const mainDataKey = mode === "reguler" ? "Total Skor" : "Skor Turnamen";
  const secondaryDataKey =
    mode === "reguler" ? "Level Tertinggi" : "Main di Level";

  return (
    <div style={{ width: "100%", height: 300, marginBottom: "2rem" }}>
      <ResponsiveContainer>
        <BarChart
          data={data.slice(0, 10)} // Ambil 10 data teratas
          margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(0, 198, 255, 0.2)"
          />
          <XAxis dataKey="name" stroke="#ccd6f6" />
          <YAxis stroke="#ccd6f6" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0a192f",
              borderColor: "var(--border-color)",
              color: "#ccd6f6",
            }}
          />
          <Legend />
          <Bar dataKey={mainDataKey} fill="var(--primary-blue)" />
          <Bar dataKey={secondaryDataKey} fill="var(--primary-magenta)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LeaderboardChart;
