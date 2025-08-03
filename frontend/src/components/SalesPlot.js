import React, { useEffect, useState } from 'react';
import "../App.css";
import * as d3 from 'd3';
import axios from 'axios';

const SalesPlot = () => {
    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chartType, setChartType] = useState('line');

    useEffect(() => {
        fetchSalesData();
    }, []);

    const fetchSalesData = async () => {
        try {
            const response = await axios.get('/monthlyRevenue');
            setSalesData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching sales data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (salesData.length > 0) {
            if (chartType === 'line') {
                drawLinePlot();
            } else {
                drawBarChart();
            }
        }
    }, [salesData, chartType]);

    const drawLinePlot = () => {
        // Clear previous chart
        d3.select('#sales-plot').selectAll("*").remove();

        const tooltip = d3
            .select("body")
            .append("div")
            .attr("class", "chart-tooltip")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background", "linear-gradient(135deg, rgba(5, 150, 105, 0.95) 0%, rgba(16, 185, 129, 0.95) 100%)")
            .style("color", "white")
            .style("border", "none")
            .style("border-radius", "12px")
            .style("padding", "12px 16px")
            .style("font-size", "14px")
            .style("font-weight", "500")
            .style("box-shadow", "0 10px 25px rgba(0, 0, 0, 0.2)")
            .style("backdrop-filter", "blur(10px)")
            .style("z-index", "1000");

        const margin = { top: 60, right: 40, bottom: 80, left: 80 };
        const width = 700 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        const svg = d3.select('#sales-plot')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .style('background', 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdf4 100%)')
            .style('border-radius', '20px')
            .style('box-shadow', '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)');

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Add chart title
        g.append("text")
            .attr("x", width / 2)
            .attr("y", -20)
            .attr("text-anchor", "middle")
            .style("font-size", "24px")
            .style("font-weight", "bold")
            .style("fill", "#064e3b")
            .text("मासिक बिक्री राजस्व");

        const x = d3.scaleBand()
            .domain(salesData.map(d => d.month))
            .range([0, width])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(salesData, d => d.revenue) * 1.1])
            .range([height, 0]);

        // Add gradient definition
        const gradient = svg.append("defs")
            .append("linearGradient")
            .attr("id", "line-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0).attr("y1", height)
            .attr("x2", 0).attr("y2", 0);

        gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#10b981")
            .attr("stop-opacity", 0.2);

        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#059669")
            .attr("stop-opacity", 0.8);

        // X Axis
        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("font-size", "12px")
            .style("fill", "#374151")
            .style("font-weight", "500");

        // Y Axis
        g.append('g')
            .call(d3.axisLeft(y).tickFormat(d => `₹${d.toLocaleString()}`))
            .selectAll("text")
            .style("font-size", "12px")
            .style("fill", "#374151")
            .style("font-weight", "500");

        // Add grid lines
        g.append("g")
            .attr("class", "grid")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x)
                .tickSize(-height)
                .tickFormat("")
            )
            .style("stroke-dasharray", "3,3")
            .style("opacity", 0.3);

        g.append("g")
            .attr("class", "grid")
            .call(d3.axisLeft(y)
                .tickSize(-width)
                .tickFormat("")
            )
            .style("stroke-dasharray", "3,3")
            .style("opacity", 0.3);

        // Line path
        const line = d3.line()
            .x(d => x(d.month) + x.bandwidth() / 2)
            .y(d => y(d.revenue))
            .curve(d3.curveCardinal.tension(0.5));

        // Add area under line
        const area = d3.area()
            .x(d => x(d.month) + x.bandwidth() / 2)
            .y0(height)
            .y1(d => y(d.revenue))
            .curve(d3.curveCardinal.tension(0.5));

        g.append("path")
            .datum(salesData)
            .attr("fill", "url(#line-gradient)")
            .attr("d", area)
            .style("opacity", 0)
            .transition()
            .duration(1500)
            .style("opacity", 1);

        // Add line
        const path = g.append("path")
            .datum(salesData)
            .attr("fill", "none")
            .attr("stroke", "#059669")
            .attr("stroke-width", 4)
            .attr("stroke-linecap", "round")
            .attr("d", line);

        // Animate line drawing
        const totalLength = path.node().getTotalLength();
        path
            .attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(2000)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);

        // Add points
        g.selectAll('.dot')
            .data(salesData)
            .enter().append('circle')
            .attr('class', 'dot')
            .attr('cx', d => x(d.month) + x.bandwidth() / 2)
            .attr('cy', d => y(d.revenue))
            .attr('r', 0)
            .attr('fill', '#ffffff')
            .attr('stroke', '#059669')
            .attr('stroke-width', 3)
            .style('box-shadow', '0 4px 6px rgba(0, 0, 0, 0.1)')
            .transition()
            .delay((d, i) => i * 200)
            .duration(800)
            .attr('r', 6)
            .on('end', function(d) {
                const circle = d3.select(this);
                circle.on("mouseenter", function(event, d) {
                    const tooltipText = `${d.month}: ₹${d.revenue.toLocaleString()}`;
                    tooltip.style("visibility", "visible")
                        .html(`<div style="text-align: center;"><strong>${d.month}</strong><br/>₹${d.revenue.toLocaleString()}</div>`)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 40) + "px");
                    
                    circle.transition()
                        .duration(200)
                        .attr('r', 10)
                        .attr('fill', '#fbbf24');
                })
                .on("mousemove", function(event) {
                    tooltip
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 40) + "px");
                })
                .on("mouseout", function() {
                    tooltip.style("visibility", "hidden");
                    circle.transition()
                        .duration(200)
                        .attr('r', 6)
                        .attr('fill', '#ffffff');
                });
            });

        // X-axis label
        g.append("text")
            .attr("x", width / 2)
            .attr("y", height + 50)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "600")
            .style("fill", "#374151")
            .text("महीना");

        // Y-axis label
        g.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -50)
            .attr("x", -height / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "600")
            .style("fill", "#374151")
            .text("राजस्व (₹)");
    };

    const drawBarChart = () => {
        // Clear previous chart
        d3.select('#sales-plot').selectAll("*").remove();

        const margin = { top: 60, right: 40, bottom: 80, left: 80 };
        const width = 700 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        const svg = d3.select('#sales-plot')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .style('background', 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdf4 100%)')
            .style('border-radius', '20px')
            .style('box-shadow', '0 20px 25px -5px rgba(0, 0, 0, 0.1)');

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Chart title
        g.append("text")
            .attr("x", width / 2)
            .attr("y", -20)
            .attr("text-anchor", "middle")
            .style("font-size", "24px")
            .style("font-weight", "bold")
            .style("fill", "#064e3b")
            .text("मासिक बिक्री राजस्व (बार चार्ट)");

        const x = d3.scaleBand()
            .domain(salesData.map(d => d.month))
            .range([0, width])
            .padding(0.2);

        const y = d3.scaleLinear()
            .domain([0, d3.max(salesData, d => d.revenue) * 1.1])
            .range([height, 0]);

        // Bars
        g.selectAll('.bar')
            .data(salesData)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.month))
            .attr('width', x.bandwidth())
            .attr('y', height)
            .attr('height', 0)
            .attr('fill', 'url(#bar-gradient)')
            .attr('rx', 8)
            .transition()
            .delay((d, i) => i * 100)
            .duration(1000)
            .attr('y', d => y(d.revenue))
            .attr('height', d => height - y(d.revenue));

        // Add gradient for bars
        const barGradient = svg.append("defs")
            .append("linearGradient")
            .attr("id", "bar-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0).attr("y1", height)
            .attr("x2", 0).attr("y2", 0);

        barGradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#10b981");

        barGradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#059669");
    };

    return (
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-2xl">
            <div className="max-w-4xl mx-auto">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-emerald-800 mb-2">बिक्री विश्लेषण</h2>
                        <p className="text-emerald-600">मासिक प्रदर्शन का ग्राफिकल दृश्य</p>
                    </div>
                    
                    {/* Chart Type Toggle */}
                    <div className="flex bg-white rounded-xl p-1 shadow-lg mt-4 md:mt-0">
                        <button
                            onClick={() => setChartType('line')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                chartType === 'line'
                                    ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-md'
                                    : 'text-emerald-600 hover:bg-emerald-50'
                            }`}
                        >
                            <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4" />
                                </svg>
                                <span>लाइन चार्ट</span>
                            </div>
                        </button>
                        <button
                            onClick={() => setChartType('bar')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                chartType === 'bar'
                                    ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-md'
                                    : 'text-emerald-600 hover:bg-emerald-50'
                            }`}
                        >
                            <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                <span>बार चार्ट</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Chart Container */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    {loading ? (
                        <div className="flex items-center justify-center h-96">
                            <div className="text-center">
                                <div className="w-16 h-16 border-4 border-emerald-200 rounded-full animate-spin border-t-emerald-600 mx-auto mb-4"></div>
                                <p className="text-emerald-600 font-medium">चार्ट लोड हो रहा है...</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <svg id="sales-plot"></svg>
                        </div>
                    )}
                </div>

                {/* Summary Stats */}
                {!loading && salesData.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl p-4 text-white">
                            <div className="text-2xl font-bold">
                                ₹{salesData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
                            </div>
                            <div className="text-emerald-100">कुल राजस्व</div>
                        </div>
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white">
                            <div className="text-2xl font-bold">
                                ₹{Math.round(salesData.reduce((sum, item) => sum + item.revenue, 0) / salesData.length).toLocaleString()}
                            </div>
                            <div className="text-green-100">औसत मासिक राजस्व</div>
                        </div>
                        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-4 text-white">
                            <div className="text-2xl font-bold">
                                ₹{Math.max(...salesData.map(item => item.revenue)).toLocaleString()}
                            </div>
                            <div className="text-yellow-100">उच्चतम मासिक राजस्व</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SalesPlot;