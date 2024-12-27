import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ClientSideRowModelModule } from 'ag-grid-community';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ColDef } from 'ag-grid-community';

import './StatsContent.css';
import Button from 'components/Button/Button';
import Icon from 'components/Icon/Icon';

interface DataPoint {
    date: string;
    value: number;
    category: string;
}

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
    const [rowData, setRowData] = useState<DataPoint[]>([]);
    const [topChannelsData, setTopChannelsData] = useState<ChannelStats[]>([]);
    const [timelineData, setTimelineData] = useState<TimelineStats[]>([]);

    // AG-Grid Column Definitions
    const columnDefs: ColDef<DataPoint>[] = [
        { field: 'date' as keyof DataPoint, sortable: true, filter: true },
        { field: 'value' as keyof DataPoint, sortable: true, filter: true },
        { field: 'category' as keyof DataPoint, sortable: true, filter: true }
    ];

    const topChannelsColumnDefs: ColDef<ChannelStats>[] = [
        { field: 'channel', sortable: true, filter: true },
        { field: 'total_messages', sortable: true, filter: true }
    ];

    const [chartOptions, setChartOptions] = useState<any>({});

    useEffect(() => {
        // Sample data - replace with your actual data fetching logic
        const sampleData = [
            { date: '2023-01-01', value: 100, category: 'A' },
            { date: '2023-01-02', value: 150, category: 'B' },
            { date: '2023-01-03', value: 200, category: 'A' },
        ];
        setRowData(sampleData);

        (async () => {
            try {
                const res = await fetch('http://localhost:8080/stats');
                const { topChannels, timeline } = await res.json();
                setTopChannelsData(topChannels);
                setTimelineData(timeline);

                // Build chart series grouped by channel
                const channels = [...new Set(timeline.map((item: { channel: any; }) => item.channel))];
                const categories = [...new Set(timeline.map((item: { day: string; }) =>
                    item.day.split('T')[0]))];
                const series = channels.map(channel => {
                    const data = categories.map(catDay => {
                        const row = timeline.find((t: { channel: unknown; day: string; }) =>
                            t.channel === channel && t.day.split('T')[0] === catDay);
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
        })();
    }, []);

    return (
        <div className="stats-content">
            <h2>Statistics Dashboard</h2>
            <div className="close-btn">
                <Button onClick={onClose}>
                    <Icon name="close" />
                </Button>
            </div>
            {/* Highcharts Component */}
            <div className="stats-data-content">
                <div className="stats-data-content-fill">
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={chartOptions}
                    />

                    <div className="ag-theme-alpine-dark" style={{ width: '100%', height: '400px' }}>
                        <AgGridReact
                            modules={[ClientSideRowModelModule]}
                            rowData={topChannelsData}
                            columnDefs={topChannelsColumnDefs}
                            pagination={true}
                            paginationPageSize={10}
                            animateRows={true}
                            defaultColDef={{
                                flex: 1,
                                minWidth: 100,
                                sortable: true,
                                filter: true,
                                resizable: true
                            }}
                            enableCellTextSelection={true}
                            suppressMovableColumns={true}
                            rowSelection="multiple"
                        />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default StatsContent;