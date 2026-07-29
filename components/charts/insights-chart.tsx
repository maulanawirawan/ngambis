"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import { BarChart, LineChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import type { StudyReport, FocusSession, PlanningCard } from "@/types";

echarts.use([
  BarChart,
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer,
]);

interface InsightsChartProps {
  reports: StudyReport[];
  focusSessions: FocusSession[];
  completedCards: PlanningCard[];
}

export function InsightsChart({
  reports,
  focusSessions,
  completedCards,
}: InsightsChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Initialize chart
    chartInstance.current = echarts.init(chartRef.current);

    // Prepare data - last 7 days
    const days = [];
    const reportCounts = [];
    const focusMinutes = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const dayLabel = date.toLocaleDateString("id-ID", { weekday: "short" });

      days.push(dayLabel);

      const dayReports = reports.filter((r) => r.report_date === dateStr).length;
      reportCounts.push(dayReports);

      const dayFocus = focusSessions
        .filter((s) => s.started_at.startsWith(dateStr))
        .reduce((acc, s) => acc + Math.floor(s.duration_seconds / 60), 0);
      focusMinutes.push(dayFocus);
    }

    const option: echarts.EChartsCoreOption = {
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
      },
      legend: {
        data: ["Report", "Fokus (menit)"],
        bottom: 0,
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "15%",
        top: "10%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: days,
        axisLine: { lineStyle: { color: "#D7C7B9" } },
        axisLabel: { color: "#211D1E" },
      },
      yAxis: [
        {
          type: "value",
          name: "Report",
          axisLine: { lineStyle: { color: "#D7C7B9" } },
          axisLabel: { color: "#211D1E" },
          splitLine: { lineStyle: { color: "#D7C7B9", opacity: 0.3 } },
        },
        {
          type: "value",
          name: "Menit",
          axisLine: { lineStyle: { color: "#D7C7B9" } },
          axisLabel: { color: "#211D1E" },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: "Report",
          type: "bar",
          data: reportCounts,
          itemStyle: {
            color: "#F16F5C",
            borderRadius: [999, 999, 0, 0],
          },
          barWidth: "40%",
        },
        {
          name: "Fokus (menit)",
          type: "line",
          yAxisIndex: 1,
          data: focusMinutes,
          smooth: true,
          lineStyle: { color: "#5A7A5A", width: 3 },
          itemStyle: { color: "#5A7A5A" },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: "rgba(90, 122, 90, 0.3)" },
                { offset: 1, color: "rgba(90, 122, 90, 0.05)" },
              ],
            },
          },
        },
      ],
    };

    chartInstance.current.setOption(option);

    // Handle resize
    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chartInstance.current?.dispose();
    };
  }, [reports, focusSessions]);

  return (
    <div className="rounded-card bg-paper p-4">
      <h3 className="mb-4 font-display text-lg font-semibold text-ink">
        Aktivitas 7 Hari Terakhir
      </h3>
      <div ref={chartRef} className="h-64 w-full" />
      <p className="mt-2 text-center text-xs text-ink/50">
        Jumlah report harian dan total menit fokus
      </p>
    </div>
  );
}
