import React from "react";

interface StatsTabProps {
  stats: {
    plan_to_watch: number;
    watching: number;
    completed: number;
    dropped: number;
  };
}

const StatsTab: React.FC<StatsTabProps> = ({ stats }) => {
  const total = stats.plan_to_watch + stats.watching + stats.completed + stats.dropped;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl mb-2">Статистика просмотра:</h2>
      <div className="bg-gray-900 p-4 rounded-lg shadow-lg">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Просмотрено: {stats.completed}</span>
            <span className="text-sm w-16 text-right">{stats.completed}</span>
          </div>
          <div className="w-full bg-gray-700 h-8 rounded-md overflow-hidden">
            <div
              className="h-full bg-green-600"
              style={{ width: `${(stats.completed / (total || 1)) * 100}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Смотрю: {stats.watching}</span>
            <span className="text-sm w-16 text-right">{stats.watching}</span>
          </div>
          <div className="w-full bg-gray-700 h-8 rounded-md overflow-hidden">
            <div
              className="h-full bg-blue-600"
              style={{ width: `${(stats.watching / (total || 1)) * 100}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Буду смотреть: {stats.plan_to_watch}</span>
            <span className="text-sm w-16 text-right">{stats.plan_to_watch}</span>
          </div>
          <div className="w-full bg-gray-700 h-8 rounded-md overflow-hidden">
            <div
              className="h-full bg-yellow-600"
              style={{ width: `${(stats.plan_to_watch / (total || 1)) * 100}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Заброшено: {stats.dropped}</span>
            <span className="text-sm w-16 text-right">{stats.dropped}</span>
          </div>
          <div className="w-full bg-gray-700 h-8 rounded-md overflow-hidden">
            <div
              className="h-full bg-red-600"
              style={{ width: `${(stats.dropped / (total || 1)) * 100}%` }}
            ></div>
          </div>
        </div>
        <p className="text-sm text-gray-400 mt-4">Всего: {total}</p>
        <p className="text-sm text-gray-400 mt-1">Показаны данные за последние 6 месяцев</p>
      </div>
    </div>
  );
};

export default StatsTab;