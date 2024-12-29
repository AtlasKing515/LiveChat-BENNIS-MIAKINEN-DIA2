import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ClientSideRowModelModule, ColDef } from 'ag-grid-community';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './StatsContent.css';
import Button from 'components/Button/Button';
import Icon from 'components/Icon/Icon';

interface ChannelStats {
  channel: string;
  total_messages: number;
}

interface TimelineStats {
  channel: string;
  day: string; // format YYYY-MM-DD
  message_count: number;
}

interface Props {
  onClose: () => void;
}

const StatsContent: React.FC<Props> = ({ onClose }) => {
  const [topChannelsData, setTopChannelsData] = useState<ChannelStats[]>([]);
  const [chartOptions, setChartOptions] = useState<any>({});

  const topChannelsColumnDefs: ColDef<ChannelStats>[] = [
    { field: 'channel', sortable: true, filter: true },
    { field: 'total_messages', sortable: true, filter: true }
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:8080/stats');
        const { topChannels, timeline } = await response.json();
        setTopChannelsData(topChannels);

        const channels = [...new Set(timeline.map((item: TimelineStats) => item.channel))];
        const categories = [...new Set(timeline.map((item: TimelineStats) => item.day.split('T')[0]))];
        const series = channels.map(channel => {
          const data = categories.map(day => {
            const row = timeline.find(
                (              t: { channel: unknown; day: string; }) => t.channel === channel && t.day.split('T')[0] === day
            );
            return row ? row.message_count : 0;
          });
          return { name: channel, data };
        });

        setChartOptions({
          title: { text: 'Statistics Overview' },
          xAxis: { categories },
          series
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="stats-content">
      <h2>Statistics Dashboard</h2>
      <div className="close-btn">
        <Button onClick={onClose}>
          <Icon name="close" />
        </Button>
      </div>
      <div className="stats-data-content">
        <div className="stats-data-content-fill">
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
          <div className="ag-theme-alpine-dark" style={{ width: '100%', height: '400px' }}>
            <AgGridReact
              modules={[ClientSideRowModelModule]}
              rowData={topChannelsData}
              columnDefs={topChannelsColumnDefs}
              pagination
              paginationPageSize={10}
              animateRows
              defaultColDef={{
                flex: 1,
                minWidth: 100,
                sortable: true,
                filter: true,
                resizable: true
              }}
              enableCellTextSelection
              suppressMovableColumns
              rowSelection="multiple"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsContent;