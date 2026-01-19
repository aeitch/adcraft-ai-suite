import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const engagementData = [
  { time: "10h", value: 20 },
  { time: "14h", value: 35 },
  { time: "16h", value: 45, highlight: true },
  { time: "20h", value: 30 },
  { time: "30h", value: 55 },
];

const keywordData = [
  { month: "Mon", value: 80 },
  { month: "Feb", value: 65 },
  { month: "Jun", value: 90 },
  { month: "High", value: 75 },
];

const keywordMetricsData = [
  { month: "Mon", purple: 400, cyan: 300 },
  { month: "May", purple: 600, cyan: 450 },
  { month: "Sep", purple: 800, cyan: 600 },
  { month: "Jun", purple: 550, cyan: 400 },
  { month: "Mon", purple: 700, cyan: 500 },
];

export const AnalyticsDashboard = () => {
  const aiInsightScore = 74;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="grid grid-cols-2 gap-4"
    >
      {/* Engagement Metrics */}
      <div className="rounded-xl bg-card border border-border p-4">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Engagement Metrics
        </h3>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 15%)" />
              <XAxis
                dataKey="time"
                tick={{ fill: "hsl(0 0% 55%)", fontSize: 10 }}
                axisLine={{ stroke: "hsl(0 0% 15%)" }}
              />
              <YAxis
                tick={{ fill: "hsl(0 0% 55%)", fontSize: 10 }}
                axisLine={{ stroke: "hsl(0 0% 15%)" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0 0% 8%)",
                  border: "1px solid hsl(0 0% 15%)",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "hsl(0 0% 95%)" }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(188 94% 53%)"
                strokeWidth={2}
                dot={{ fill: "hsl(188 94% 53%)", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: "hsl(188 94% 63%)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Keyword Performance */}
      <div className="rounded-xl bg-card border border-border p-4">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Keyword Performance
        </h3>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={keywordData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 15%)" />
              <XAxis
                dataKey="month"
                tick={{ fill: "hsl(0 0% 55%)", fontSize: 10 }}
                axisLine={{ stroke: "hsl(0 0% 15%)" }}
              />
              <YAxis
                tick={{ fill: "hsl(0 0% 55%)", fontSize: 10 }}
                axisLine={{ stroke: "hsl(0 0% 15%)" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0 0% 8%)",
                  border: "1px solid hsl(0 0% 15%)",
                  borderRadius: "8px",
                }}
              />
              <Bar
                dataKey="value"
                fill="hsl(271 91% 65%)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Keywords Metrics */}
      <div className="rounded-xl bg-card border border-border p-4">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Keywords Metrics
        </h3>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={keywordMetricsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 15%)" />
              <XAxis
                dataKey="month"
                tick={{ fill: "hsl(0 0% 55%)", fontSize: 10 }}
                axisLine={{ stroke: "hsl(0 0% 15%)" }}
              />
              <YAxis
                tick={{ fill: "hsl(0 0% 55%)", fontSize: 10 }}
                axisLine={{ stroke: "hsl(0 0% 15%)" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0 0% 8%)",
                  border: "1px solid hsl(0 0% 15%)",
                  borderRadius: "8px",
                }}
              />
              <Bar
                dataKey="purple"
                fill="hsl(271 91% 65%)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="cyan"
                fill="hsl(188 94% 53%)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insights */}
      <div className="rounded-xl bg-card border border-border p-4">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          AI Insights
        </h3>
        <div className="flex items-center gap-4">
          {/* Progress Ring */}
          <div className="relative w-20 h-20">
            <svg className="w-full h-full progress-ring" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="hsl(0 0% 15%)"
                strokeWidth="8"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(aiInsightScore / 100) * 251.2} 251.2`}
                initial={{ strokeDasharray: "0 251.2" }}
                animate={{
                  strokeDasharray: `${(aiInsightScore / 100) * 251.2} 251.2`,
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              <defs>
                <linearGradient
                  id="progressGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="hsl(271 91% 65%)" />
                  <stop offset="100%" stopColor="hsl(188 94% 53%)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span
                className="text-lg font-bold text-gradient"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {aiInsightScore}%
              </motion.span>
            </div>
          </div>

          {/* Insights List */}
          <div className="flex-1 space-y-2 text-xs">
            {[
              { label: "Market Alignment", color: "bg-neon-cyan" },
              { label: "Previous Insights", color: "bg-primary" },
              { label: "Keywords Performance", color: "bg-warning" },
              { label: "Insights", color: "bg-success" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-2"
              >
                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                <span className="text-muted-foreground">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
